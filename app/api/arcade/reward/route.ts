import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/src/lib/db';
import { User } from '@/src/models/User';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { id?: string; userId?: string; _id?: string };

    const userId = decoded.id || decoded.userId || decoded._id;
    const body = await req.json();
    const { rewardAmount, gameTitle } = body;

    // Sanity check on reward amounts (Max $2,500 per puzzle/game win)
    const validReward = Math.min(Math.max(Number(rewardAmount) || 0, 100), 2500);

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Reward the user
    user.fakeBalance = (user.fakeBalance || 0) + validReward;
    await user.save();

    console.log(`[ARCADE REWARD] Credited $${validReward} to ${user.email} for ${gameTitle}`);

    return NextResponse.json({
      success: true,
      rewardAmount: validReward,
      newBalance: user.fakeBalance,
      message: `$${validReward.toLocaleString()} deposited to your Infinite Black Card!`,
    });
  } catch (err: any) {
    console.error('Arcade Reward Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to deposit reward' }, { status: 500 });
  }
}