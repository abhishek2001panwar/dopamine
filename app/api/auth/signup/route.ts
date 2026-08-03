import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../../src/lib/db';
import { User } from '../../../../src/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, fakeBalance: user.fakeBalance },
    });

    response.cookies.set('token', token, { httpOnly: true, path: '/' });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}