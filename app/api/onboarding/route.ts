import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/src/lib/db';
import { User } from '@/src/models/User';

export async function POST(req: Request) {
  try {
    // 1. MUST await cookies in Next.js 15+
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Please log in again.' }, { status: 401 });
    }

    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const { deliveryAddress, shoppingVibe } = await req.json();

    if (!deliveryAddress || !shoppingVibe) {
      return NextResponse.json({ error: 'Please select an address and shopping vibe!' }, { status: 400 });
    }

    await connectToDatabase();

    // 3. Update User profile & grant onboarding bonus
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.deliveryAddress = deliveryAddress;
    user.shoppingVibe = shoppingVibe;
    user.onboarded = true;
    user.fakeBalance = (user.fakeBalance || 10000) + 5000;

    await user.save();

    return NextResponse.json({
      success: true,
      fakeBalance: user.fakeBalance,
      user: {
        deliveryAddress: user.deliveryAddress,
        shoppingVibe: user.shoppingVibe,
        onboarded: user.onboarded,
      },
    });
  } catch (err: any) {
    console.error('Onboarding API Error:', err);
    return NextResponse.json({ error: err.message || 'Onboarding failed' }, { status: 500 });
  }
}