import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/src/lib/db';
import { User } from '@/src/models/User';
import { Order } from '@/src/models/Order';
import { evaluateAndGrantBadges } from '@/src/lib/achievements';
import { Resend } from 'resend';
import { getReceiptEmailHtml } from '@/src/lib/emailTemplates';
import { transporter } from '@/src/lib/nodemailer';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. Secure Authentication: Extract user ID from verified JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to complete checkout.' },
        { status: 401 }
      );
    }

    // Verify JWT Token safely with fallback secret
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { id?: string; userId?: string; _id?: string };

    // Flexible ID check to fix "User profile not found" errors
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Token structure missing valid User ID.' },
        { status: 401 }
      );
    }

    // 2. Parse request payload
    const body = await req.json();
    const { items, totalAmount, deliveryAddress, paymentCard } = body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    if (totalAmount === undefined || totalAmount < 0) {
      return NextResponse.json({ error: 'Invalid checkout amount.' }, { status: 400 });
    }

    await connectToDatabase();

    // 3. Find User in MongoDB using safe ObjectId casting
    const targetId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const user = await User.findById(targetId);

    if (!user) {
      return NextResponse.json({ error: 'User not found in database.' }, { status: 404 });
    }

    // 4. Verify user balance
    if (user.fakeBalance < totalAmount) {
      return NextResponse.json({ error: 'Insufficient Fake Bucks balance.' }, { status: 400 });
    }

    // 5. Create Complete Order Record
    const orderItems = items.map((item: any) => ({
      _id: item._id,
      title: item.title,
      price: Number(item.price) || 0,
      image: item.image,
    }));

    const finalAddress = deliveryAddress || user.deliveryAddress || "Mom's Basement, Room 2B";

    const order = await Order.create({
      userId: user._id,
      userEmail: user.email,
      items: orderItems,
      totalAmount,
      deliveryAddress: finalAddress,
      paymentCard: paymentCard || 'Infinite Black Card',
      deliveryStatus: 'DELIVERED TO VAULT',
    });

    // 6. Update User document
    user.fakeBalance -= totalAmount;
    user.cart = []; // Empty DB cart
    user.totalSpent = (user.totalSpent || 0) + totalAmount;
    user.ordersCount = (user.ordersCount || 0) + 1;

    if (!user.unlockedBadges) {
      user.unlockedBadges = [];
    }

    await user.save();

    // 7. Evaluate Achievement Badges safely
    let newBadges: any[] = [];
    try {
      newBadges = await evaluateAndGrantBadges(user._id.toString());
    } catch (badgeErr) {
      console.warn('Badge evaluation error:', badgeErr);
    }

  // Inside your checkout API route:
try {
  if (user.email) {
    await transporter.sendMail({
      from: `"DopaCart Vault" <${process.env.GMAIL_USER}>`,
      to: user.email, // <--- Sends to ANY user email address!
      subject: `✨ Acquisition Dossier #${order._id.toString().substring(0, 8).toUpperCase()} Confirmed`,
      html: getReceiptEmailHtml({
        userName: user.name || 'High Roller',
        orderId: order._id.toString(),
        items: orderItems,
        totalAmount,
        deliveryAddress: finalAddress,
      }),
    });
  }
} catch (emailErr) {
  console.warn('Gmail sending failed:', emailErr);
}

    return NextResponse.json({
      success: true,
      orderId: order._id,
      newBalance: user.fakeBalance,
      newBadges,
    });
  } catch (err: any) {
    console.error('Checkout API error:', err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}