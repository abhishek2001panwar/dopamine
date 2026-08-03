import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/db';
import { User } from '@/src/models/User';

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch top 20 users sorted by totalSpent descending
    const leaderboard = await User.find({})
      .select('name fakeBalance totalSpent streakCount unlockedBadges ordersCount createdAt')
      .sort({ totalSpent: -1, ordersCount: -1 })
      .limit(20)
      .lean();

    const formattedLeaderboard = leaderboard.map((user: any, index: number) => ({
      rank: index + 1,
      id: user._id.toString(),
      name: user.name || 'Anonymous Baller',
      totalSpent: user.totalSpent || 0,
      streakCount: user.streakCount || 0,
      badgeCount: Array.isArray(user.unlockedBadges) ? user.unlockedBadges.length : 0,
      ordersCount: user.ordersCount || 0,
      joinedDate: user.createdAt,
    }));

    return NextResponse.json({ success: true, leaderboard: formattedLeaderboard });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch leaderboard' }, { status: 500 });
  }
}