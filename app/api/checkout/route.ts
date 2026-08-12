import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/src/lib/db';
import { User } from '@/src/models/User';
import { Order } from '@/src/models/Order';
import { evaluateAndGrantBadges } from '@/src/lib/achievements';
import { transporter } from '@/src/lib/nodemailer';
import { getReceiptEmailHtml } from '@/src/lib/emailTemplates';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { id?: string; userId?: string; _id?: string };

    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { items, totalAmount, deliveryAddress, paymentCard, otp } = body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    const receivedOtp = String(otp || '').trim();
    if (!receivedOtp || receivedOtp.length !== 6) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit payment authorization OTP.' }, { status: 400 });
    }

    await connectToDatabase();

    const targetId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const user = await User.findById(targetId);

    if (!user) {
      return NextResponse.json({ error: 'User not found in database.' }, { status: 404 });
    }

    // 1. Verify Payment OTP Code
    const storedOtp = String(user.cardOtp || '').trim();
    if (!storedOtp || storedOtp !== receivedOtp) {
      return NextResponse.json({ error: 'Invalid payment OTP code. Please check your email.' }, { status: 400 });
    }

    if (user.cardOtpExpiry && new Date() > new Date(user.cardOtpExpiry)) {
      return NextResponse.json({ error: 'Payment authorization code expired. Request a new OTP.' }, { status: 400 });
    }

    // 2. Check balance
    if (user.fakeBalance < totalAmount) {
      return NextResponse.json({ error: 'Insufficient funds on your Infinite Black Card.' }, { status: 400 });
    }

    // 3. Clear OTP after verification
    user.cardOtp = null;
    user.cardOtpExpiry = null;

    // 4. Create Order Record
    const orderItems = items.map((item: any) => ({
      _id: item._id,
      productId: item._id,
      title: item.title,
      price: Number(item.price) || 0,
      image: item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      category: item.category || 'General',
      selectedSize: item.selectedSize || 'Standard',
    }));

    const finalAddress = deliveryAddress || user.deliveryAddress || "Mom's Basement, Room 2B";

    const order = await Order.create({
      userId: user._id,
      userEmail: user.email,
      items: orderItems,
      totalAmount,
      deliveryAddress: finalAddress,
      paymentCard: paymentCard || 'Infinite Black Card (•••• 4890)',
      deliveryStatus: 'Order Verified & Processing',
    });

    // 5. Deduct Balance & Update Stats
    user.fakeBalance -= totalAmount;
    user.cart = [];
    user.totalSpent = (user.totalSpent || 0) + totalAmount;
    user.ordersCount = (user.ordersCount || 0) + 1;

    await user.save();

    // 6. Badges & Email Receipt
    try { await evaluateAndGrantBadges(user._id.toString()); } catch (e) {}

    try {
      if (user.email) {
        await transporter.sendMail({
          from: `"DopaCart Vault" <${process.env.GMAIL_USER}>`,
          to: user.email,
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
    } catch (e) {}

    return NextResponse.json({
      success: true,
      orderId: order._id,
      newBalance: user.fakeBalance,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}