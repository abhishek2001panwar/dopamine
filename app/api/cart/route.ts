import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/src/lib/db';
import { User } from '@/src/models/User';

// GET: Fetch user's active cart from MongoDB
// GET: Fetch user's cart from MongoDB
export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ cart: [] });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await connectToDatabase();

    const user = await User.findById(decoded.id).select('cart fakeBalance');
    if (!user) return NextResponse.json({ cart: [], fakeBalance: 10000 });

    return NextResponse.json({
      cart: user.cart || [],
      fakeBalance: user.fakeBalance ?? 10000,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, cart: [] }, { status: 500 });
  }
}

// POST: Save updated cart array to MongoDB
export async function POST(req: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const { cart } = await req.json();

    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { cart: cart || [] },
      { new: true }
    );

    return NextResponse.json({ success: true, cart: updatedUser?.cart || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}