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
    
    // Clean and normalize received code
    const receivedOtp = String(body.otp || '').trim().replaceAll(/\s+/g, '');

    if (!receivedOtp || receivedOtp.length !== 6) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit code' }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch fresh user record directly from DB
    const user = await User.findById(userId).select('+cardOtp +cardOtpExpiry');

    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const storedOtp = String(user.cardOtp || '').trim();

    console.log(`[OTP VERIFY DEBUG] Received: "${receivedOtp}" | Stored in DB: "${storedOtp}"`);

    // 1. Verify OTP match
    if (!storedOtp || storedOtp !== receivedOtp) {
      return NextResponse.json(
        { error: 'Invalid security code. Please request a new code if needed.' },
        { status: 400 }
      );
    }

    // 2. Verify expiry
    if (user.cardOtpExpiry && new Date() > new Date(user.cardOtpExpiry)) {
      return NextResponse.json(
        { error: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Clear used OTP
    user.cardOtp = null;
    user.cardOtpExpiry = null;
    await user.save();

    return NextResponse.json({ success: true, authorized: true });
  } catch (err: any) {
    console.error('Verify OTP Error:', err);
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}