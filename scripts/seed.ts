import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  tag: String,
  dopamineScore: Number,
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
  {
    title: 'Cyberpunk Neon Goggles',
    description: '100% UV protection, 200% aesthetic clout.',
    price: 420,
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
    tag: 'Cyberpunk',
    dopamineScore: 900,
  },
  {
    title: 'Zero-Gravity Floating Chair',
    description: 'Defy physics while scrolling TikTok.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    tag: 'Future Living',
    dopamineScore: 1500,
  },
  {
    title: 'Retro Y2K Clear Headphones',
    description: 'See-through plastic housing with glowing bass drivers.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    tag: 'Y2K',
    dopamineScore: 650,
  },
  {
    title: 'Holographic Streetwear Jacket',
    description: 'Reflects sunlight into full rainbow spectrums.',
    price: 890,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    tag: 'Drip',
    dopamineScore: 1200,
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log('✅ Database seeded with high-dopamine items!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});