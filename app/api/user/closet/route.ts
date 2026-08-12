import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import {connectToDatabase} from '@/src/lib/db';
import {User} from '@/src/models/User';
import {Order} from '@/src/models/Order';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { id?: string; userId?: string; _id?: string };

    const userId = decoded.id || decoded.userId || decoded._id;

    await connectToDatabase();

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch all completed orders for this user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    // Aggregate individual purchased items
    const wardRobeItems: any[] = [];
    let totalItemsPurchased = 0;

    orders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          totalItemsPurchased += 1;
          wardRobeItems.push({
            ...item,
            orderId: order._id,
            purchasedAt: order.createdAt,
          });
        });
      }
    });

    return NextResponse.json({
      success: true,
      items: wardRobeItems,
      totalItemsCount: totalItemsPurchased,
      user: {
        name: user.name,
        email: user.email,
        totalSpent: user.totalSpent || 0,
      },
    });
  } catch (err: any) {
    console.error('Closet API Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch wardrobe' }, { status: 500 });
  }
}