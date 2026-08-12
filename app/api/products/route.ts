import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/db';
import  Product  from '@/src/models/Product';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || Infinity;
    const sort = searchParams.get('sort') || 'newest';

    await connectToDatabase();

    // Construct Mongo Filter Query
    const query: any = {};

    // 1. Category Filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // 2. Search Text Filter (Title or Description)
    if (search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } },
      ];
    }

    // 3. Price Range Filter
    query.price = { $gte: minPrice };
    if (maxPrice !== Infinity) {
      query.price.$lte = maxPrice;
    }

    // 4. Sorting Options
    let sortOptions: any = { createdAt: -1 }; // Default: Newest Drops
    if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'dopamine') {
      sortOptions = { dopamineScore: -1, price: -1 };
    }

    const products = await Product.find(query).sort(sortOptions);

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    console.error('Products API Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch products' }, { status: 500 });
  }
}