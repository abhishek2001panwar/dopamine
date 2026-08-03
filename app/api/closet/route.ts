import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/src/lib/db';
import { Order } from '@/src/models/Order';
import { User } from '@/src/models/User';

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectToDatabase();

    const user = await User.findById(decoded.id).select('name unlockedBadges totalSpent');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. Fetch all orders completed by this user
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    // 2. Flatten all items into a single wardrobe array & deduplicate by product ID/title
    const purchasedMap = new Map<string, any>();

    orders.forEach((order: any) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const key = item._id || item.title;
          if (!purchasedMap.has(key)) {
            purchasedMap.set(key, {
              ...item,
              purchasedAt: order.createdAt,
            });
          }
        });
      }
    });

    const items = Array.from(purchasedMap.values());
    const totalValue = items.reduce((acc, i) => acc + (Number(i.price) || 0), 0);

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        totalSpent: user.totalSpent || 0,
        unlockedBadges: user.unlockedBadges || [],
      },
      items,
      stats: {
        totalItems: items.length,
        totalValue,
        totalOrders: orders.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch closet items' }, { status: 500 });
  }
}