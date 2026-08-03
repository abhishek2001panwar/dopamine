import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../../../../src/lib/db';
import { User } from '../../../../src/models/User';

const BASE_ALLOWANCE = 10000;
const STREAK_BONUS_PER_DAY = 1500; // Adds $1,500 extra per streak day

export async function POST() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectToDatabase();

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const lastClaimed = user.lastClaimedDate ? new Date(user.lastClaimedDate) : null;

    // Helper to calculate difference in calendar days
    let canClaim = false;
    let newStreak = user.streakCount || 0;

    if (!lastClaimed) {
      // First claim ever
      canClaim = true;
      newStreak = 1;
    } else {
      // Check difference in days ignoring hours/minutes
      const msPerDay = 1000 * 60 * 60 * 24;
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startOfLastClaim = new Date(lastClaimed.getFullYear(), lastClaimed.getMonth(), lastClaimed.getDate()).getTime();
      
      const diffDays = Math.round((startOfToday - startOfLastClaim) / msPerDay);

      if (diffDays === 0) {
        return NextResponse.json(
          { error: 'You have already claimed your daily allowance today!' },
          { status: 400 }
        );
      } else if (diffDays === 1) {
        // Logged in consecutive day -> increase streak
        canClaim = true;
        newStreak += 1;
      } else {
        // Missed a day -> reset streak back to 1
        canClaim = true;
        newStreak = 1;
      }
    }

    // Calculate total payout = Base ($10k) + (Streak Days * $1.5k)
    const bonusAmount = (newStreak - 1) * STREAK_BONUS_PER_DAY;
    const totalPayout = BASE_ALLOWANCE + bonusAmount;

    // Update user record
    user.fakeBalance += totalPayout;
    user.streakCount = newStreak;
    user.longestStreak = Math.max(user.longestStreak || 0, newStreak);
    user.lastClaimedDate = now;
    await user.save();

    return NextResponse.json({
      success: true,
      payout: totalPayout,
      baseAllowance: BASE_ALLOWANCE,
      bonusAmount,
      newBalance: user.fakeBalance,
      streakCount: user.streakCount,
      longestStreak: user.longestStreak,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}