import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/src/lib/db';
import { User } from '@/src/models/User';
import { Order } from '@/src/models/Order';
import { evaluateAndGrantBadges } from '@/src/lib/achievements';
import { Resend } from 'resend';

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

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

    // 3. Find User in MongoDB using verified JWT id
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Verify user balance
    if (user.fakeBalance < totalAmount) {
      return NextResponse.json({ error: 'Insufficient Fake Bucks balance' }, { status: 400 });
    }

    // 5. Create Complete Order Record (including address & card info)
    const order = await Order.create({
      userId: user._id,
      userEmail: user.email,
      items: items.map((item: any) => ({
        _id: item._id,
        title: item.title,
        price: Number(item.price) || 0,
        image: item.image,
      })),
      totalAmount,
      deliveryAddress: deliveryAddress || user.deliveryAddress || "Mom's Basement, Room 2B",
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

    // 8. Safe Resend Email Dispatch
    try {
      if (process.env.RESEND_API_KEY && user.email) {
        await resend.emails.send({
          from: 'DopaCart <onboarding@resend.dev>',
          to: user.email,
          subject: '✨ Order Confirmed! (No real package coming)',
          html: `<p>You spent <strong>$${totalAmount.toLocaleString()} Fake Dollars</strong>!</p>`,
        });
      }
    } catch (emailErr) {
      console.warn('Resend email failed, but order was completed:', emailErr);
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