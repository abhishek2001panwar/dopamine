import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import  { connectToDatabase } from '@/src/lib/db';
import {User} from '@/src/models/User';

export async function POST() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.id || decoded.userId || decoded._id;

    // Save onboarded status and lastOnboardedDate to MongoDB
    const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        onboarded: true,
        lastOnboardedDate: todayStr 
      },
      { new: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}