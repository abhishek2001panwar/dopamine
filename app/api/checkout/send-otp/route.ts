import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/src/lib/db';
import { User } from '@/src/models/User';
import { transporter } from '@/src/lib/nodemailer';

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

    const { amount } = await req.json();

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user || !user.email) {
      return NextResponse.json({ error: 'User or email address not found.' }, { status: 404 });
    }

    if (user.fakeBalance < amount) {
      return NextResponse.json({ error: 'Insufficient card capital balance.' }, { status: 400 });
    }

    // Generate 6-Digit OTP
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 mins

    user.cardOtp = otpCode;
    user.cardOtpExpiry = otpExpiry;
    await user.save();

    console.log(`[CHECKOUT OTP DEBUG] Sent Payment OTP ${otpCode} to ${user.email}`);

    // Send Email
    await transporter.sendMail({
      from: `"DopaCart Vault Security" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: `🔑 Authorize Payment Order ($${amount.toLocaleString()}): ${otpCode}`,
      html: `
        <div style="font-family: monospace; background: #FAF7F2; padding: 30px; border-radius: 16px; border: 1px solid #EAE2D5;">
          <h2 style="color: #1C1712;">DopaCart® Infinite Black Card Authorization</h2>
          <p style="color: #75695C;">You are authorizing a virtual capital transaction of <strong>$${amount.toLocaleString()}</strong>.</p>
          <div style="background: #1C1712; color: #C8A24F; font-size: 28px; font-weight: bold; padding: 16px; text-align: center; border-radius: 12px; letter-spacing: 6px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="font-size: 11px; color: #75695C;">Enter this 6-digit code in your checkout window to settle payment.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Payment OTP sent to ${user.email}`,
    });
  } catch (err: any) {
    console.error('Checkout Send OTP Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to dispatch checkout OTP' }, { status: 500 });
  }
}