import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/db';
import { Product } from '@/src/models/Product';

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    await connectToDatabase();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: 'Drop item not found' }, { status: 404 });
    }

    if (!product.isDrop) {
      return NextResponse.json({ error: 'This item is not a limited drop' }, { status: 400 });
    }

    // Check if drop has started
    if (new Date(product.dropStartTime) > new Date()) {
      return NextResponse.json({ error: 'Drop is locked! Countdown still active.' }, { status: 400 });
    }

    // Check stock
    if (product.claimedCount >= product.virtualStock) {
      return NextResponse.json({ error: 'SOLD OUT! Better luck on the next drop.' }, { status: 400 });
    }

    // Atomically increment claimed count
    product.claimedCount += 1;
    await product.save();

    return NextResponse.json({
      success: true,
      remainingStock: product.virtualStock - product.claimedCount,
      product,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}