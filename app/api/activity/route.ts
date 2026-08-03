import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/db';
import { Order } from '@/src/models/Order';

const FAKE_USERS = ['Avery', 'Kai', 'Jordan', 'Skyler', 'Rowan', 'Zion', 'Nova', 'River'];
const CITIES = ['Tokyo', 'NYC', 'London', 'Berlin', 'Seoul', 'LA', 'Toronto'];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch real recent orders from MongoDB
    const realOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);

    // Format real orders
    const realActivities = realOrders.map((order) => ({
      id: order._id.toString(),
      user: order.userEmail.split('@')[0],
      itemTitle: order.items[0]?.title || 'Aesthetic Item',
      amount: order.totalAmount,
      location: 'Cloud',
      timeAgo: 'Just now',
    }));

    // Generate random filler activity for maximum hype
    const randomUser = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const simulatedActivity = {
      id: `sim_${Date.now()}`,
      user: randomUser,
      itemTitle: 'Cyberpunk Neon Goggles',
      amount: 420,
      location: randomCity,
      timeAgo: '2m ago',
    };

    return NextResponse.json({
      activities: [...realActivities, simulatedActivity],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}