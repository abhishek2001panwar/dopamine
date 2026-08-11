import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../src/lib/db';
import  Product  from '@/src/models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}