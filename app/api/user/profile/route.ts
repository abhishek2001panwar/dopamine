import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/src/lib/db';
import { User } from '@/src/models/User';
import { Order } from '@/src/models/Order';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectToDatabase();

    // 1. Fetch User Profile
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Fetch User Orders from DB (sorted newest first)
    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        fakeBalance: user.fakeBalance,
        streakCount: user.streakCount,
        totalSpent: user.totalSpent || 0,
        deliveryAddress: user.deliveryAddress || "Mom's Basement, Room 2B",
        shoppingVibe: user.shoppingVibe || 'Impulse Shopper',
        cart: user.cart || [],
      },
      orders: orders || [],
    });
  } catch (err: any) {
    console.error('Profile API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}