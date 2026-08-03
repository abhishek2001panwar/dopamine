import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/src/lib/db';
import { User } from '@/src/models/User';

// Weighted rewards configuration
const PRIZES = [
  { amount: 1000, label: '$1,000', weight: 35 },
  { amount: 5000, label: '$5,000', weight: 25 },
  { amount: 10000, label: '$10,000', weight: 20 },
  { amount: 25000, label: '$25,000', weight: 12 },
  { amount: 50000, label: '$50,000', weight: 6 },
  { amount: 100000, label: '⚡ JACKPOT $100,000', weight: 2 },
];

function getRandomWeightedPrize() {
  const totalWeight = PRIZES.reduce((acc, p) => acc + p.weight, 0);
  let randomNum = Math.floor(Math.random() * totalWeight);

  for (let i = 0; i < PRIZES.length; i++) {
    if (randomNum < PRIZES[i].weight) {
      return { prize: PRIZES[i], index: i };
    }
    randomNum -= PRIZES[i].weight;
  }
  return { prize: PRIZES[0], index: 0 };
}

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

    // Check if 24 hours have passed since the last spin
    const now = new Date();
    if (user.lastSpinDate) {
      const lastSpin = new Date(user.lastSpinDate);
      const diffHours = Math.abs(now.getTime() - lastSpin.getTime()) / (1000 * 60 * 60);

      if (diffHours < 24) {
        const remainingHours = Math.ceil(24 - diffHours);
        return NextResponse.json(
          { error: `Wheel locked! Try again in ~${remainingHours} hours.` },
          { status: 400 }
        );
      }
    }

    // Determine won prize
    const { prize, index } = getRandomWeightedPrize();

    // Update user balance and spin date
    user.fakeBalance = (user.fakeBalance || 0) + prize.amount;
    user.lastSpinDate = now;
    await user.save();

    return NextResponse.json({
      success: true,
      prizeIndex: index,
      wonPrize: prize,
      newBalance: user.fakeBalance,
      lastSpinDate: user.lastSpinDate,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}