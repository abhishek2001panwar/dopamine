import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../../../../src/lib/db';
import { User } from '../../../../src/models/User';


const BASE_ALLOWANCE = 10000;
const STREAK_BONUS_PER_DAY = 1500;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { id?: string; userId?: string; _id?: string };

    const userId = decoded.id || decoded.userId || decoded._id;

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const now = new Date();
    const lastClaimed = user.lastClaimedDate ? new Date(user.lastClaimedDate) : null;

    let canClaim = false;
    let newStreak = user.streakCount || 0;

    if (!lastClaimed) {
      canClaim = true;
      newStreak = 1;
    } else {
      const msPerDay = 1000 * 60 * 60 * 24;
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startOfLastClaim = new Date(lastClaimed.getFullYear(), lastClaimed.getMonth(), lastClaimed.getDate()).getTime();

      const diffDays = Math.round((startOfToday - startOfLastClaim) / msPerDay);

      if (diffDays === 0) {
        return NextResponse.json(
          { error: 'Allowance already claimed for today!', claimedToday: true },
          { status: 400 }
        );
      } else if (diffDays === 1) {
        canClaim = true;
        newStreak += 1;
      } else {
        canClaim = true;
        newStreak = 1;
      }
    }

    const bonusAmount = (newStreak - 1) * STREAK_BONUS_PER_DAY;
    const totalPayout = BASE_ALLOWANCE + bonusAmount;

    user.fakeBalance = (user.fakeBalance || 0) + totalPayout;
    user.streakCount = newStreak;
    user.longestStreak = Math.max(user.longestStreak || 0, newStreak);
    user.lastClaimedDate = now;
    await user.save();

    return NextResponse.json({
      success: true,
      payout: totalPayout,
      newBalance: user.fakeBalance,
      streakCount: user.streakCount,
      claimedToday: true,
    });
  } catch (err: any) {
    console.error('Allowance claim error:', err);
    return NextResponse.json({ error: err.message || 'Allowance failed' }, { status: 500 });
  }
}