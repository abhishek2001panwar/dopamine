'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Star, 
  Search, 
  ChevronRight, 
  Flame 
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AppleScrollSection } from './components/AppleScrollSection';

const categories = [
  { name: 'Sneakers & Kicks', count: '2,340 Items', icon: '👟', href: '/feed?category=sneakers' },
  { name: 'Luxury Apparel', count: '4,120 Items', icon: '🧥', href: '/feed?category=luxury' },
  { name: 'Haute Horlogerie', count: '1,180 Items', icon: '⌚', href: '/feed?category=watches' },
  { name: 'Cyber Tech & Gear', count: '890 Items', icon: '⚡', href: '/feed?category=tech' },
  { name: 'Maison Beauty', count: '1,840 Items', icon: '✨', href: '/feed?category=beauty' },
  { name: 'Hypercars & Exclusives', count: '140 Items', icon: '🏎️', href: '/feed?category=cars' },
];

const featuredProducts = [
  {
    id: '1',
    title: 'Retro High OG "Chicago"',
    brand: 'Jordan Brand',
    price: 1250,
    rating: 5,
    tag: 'NEW ARRIVAL',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '2',
    title: 'Onyx Skeleton Automatic',
    brand: 'Horology Studio',
    price: 8900,
    rating: 5,
    tag: 'LIMITED EDITION',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '3',
    title: 'Terracotta Oversized Hoodie',
    brand: 'Jacquemus Studio',
    price: 680,
    rating: 5,
    tag: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '4',
    title: 'Acoustic Studio Headphones',
    brand: 'Audio Artisan',
    price: 1100,
    rating: 5,
    tag: 'TRENDING DROP',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
  },
];

const liveTicker = [
  { user: 'Alex M.', action: 'acquired Rolex Submariner', price: '$14,200', time: 'Just now' },
  { user: 'Emma K.', action: 'acquired Dior Saddle Bag', price: '$3,800', time: '3m ago' },
  { user: 'James R.', action: 'acquired MacBook Pro M3', price: '$2,499', time: '5m ago' },
  { user: 'Sophia L.', action: 'acquired Jordan 1 Retro', price: '$1,250', time: '8m ago' },
  { user: 'Lucas P.', action: 'acquired Porsche 911 GT3', price: '$225,000', time: '11m ago' },
];

export default function LandingPage() {
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#231E18] selection:bg-[#C8A24F] selection:text-white antialiased overflow-x-hidden">
     

      {/* 2. Glass Navbar */}
    <Navbar />

      {/* 3. Social Ticker */}
      <div className="w-full bg-white/50 border-b border-[#EAE2D5] py-3 overflow-hidden">
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
          {liveTicker.concat(liveTicker).map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#C8A24F] animate-ping" />
              <p className="font-mono text-xs text-[#75695C] m-0">
                <strong className="text-[#1C1712] font-semibold">{item.user}</strong> {item.action} for{' '}
                <span className="text-[#9B7A2B] font-bold">{item.price}</span>{' '}
                <span className="text-[#75695C]/60 text-[10px]">({item.time})</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <main className="w-full space-y-32 py-16">
        {/* 4. Full-Width Hero Section */}
        <section className="w-full px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 relative"
            >
              <div className="relative rounded-[40px] overflow-hidden border border-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.06)] bg-white/60 backdrop-blur-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80"
                  alt="Luxury Fashion Hero"
                  className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1712]/70 via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 text-white space-y-2 backdrop-blur-2xl bg-white/20 p-8 rounded-[28px] border border-white/30 shadow-2xl">
                  <span className="font-mono text-[10px] uppercase tracking-widest bg-[#C8A24F] text-white px-3.5 py-1 rounded-full font-bold">
                    SPRING '26 EDITORIAL
                  </span>
                  <h3 className="text-3xl font-normal m-0 text-white">The High-Roller Capsule</h3>
                  <p className="text-xs text-white/80 font-normal m-0">Acquire without financial constraint.</p>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Headline & CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#EAE2D5] text-[#9B7A2B] font-mono text-xs uppercase tracking-widest shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A24F]" /> Zero-Cost Luxury Simulator
                </span>

                {/* h1 uses FontOne */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-normal text-[#1C1712] leading-[1.05] tracking-tight m-0">
                  Buy Luxury.<br />
                  <span className="italic text-[#C8A24F]">Spend</span> Nothing.
                </h1>

                {/* p uses FontTwo */}
                <p className="text-base sm:text-lg text-[#75695C] leading-relaxed font-normal max-w-xl m-0">
                  Discover thousands of curated luxury drops, build your dream wardrobe archive, and spend only virtual capital.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-9 py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full shadow-[0_15px_30px_rgba(200,162,79,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                >
                  Start Shopping <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/feed"
                  className="w-full sm:w-auto px-9 py-4 bg-white/80 hover:bg-white text-[#1C1712] border border-[#EAE2D5] font-mono text-xs font-bold uppercase tracking-widest rounded-full shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  Browse Collections
                </Link>
              </div>

              {/* Statistics Bar */}
              <div className="pt-8 border-t border-[#EAE2D5] grid grid-cols-3 gap-6 font-mono">
                <div>
                  <h2 className="text-3xl md:text-4xl font-normal text-[#1C1712] m-0">120K+</h2>
                  <p className="text-[11px] text-[#75695C] uppercase tracking-wider mt-1 m-0">Active Users</p>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-normal text-[#1C1712] m-0">8M+</h2>
                  <p className="text-[11px] text-[#75695C] uppercase tracking-wider mt-1 m-0">Purchases</p>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-normal text-[#1C1712] m-0">15K+</h2>
                  <p className="text-[11px] text-[#75695C] uppercase tracking-wider mt-1 m-0">Products</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. Categories Grid */}
        <section className="w-full px-6 md:px-16 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE2D5] pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#9B7A2B]">Curated Directories</span>
              <h2 className="text-4xl sm:text-5xl font-normal text-[#1C1712] mt-1 m-0">Explore By Category</h2>
            </div>
            <Link href="/feed" className="font-mono text-xs font-bold uppercase tracking-widest text-[#1C1712] hover:text-[#C8A24F] flex items-center gap-1 transition-colors">
              View All Directories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[32px] p-8 text-center space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(200,162,79,0.15)] hover:border-[#C8A24F] transition-all duration-500 hover:-translate-y-2 group block"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                <div>
                  <h4 className="font-normal text-xl text-[#1C1712] group-hover:text-[#9B7A2B] transition-colors m-0">{cat.name}</h4>
                  <p className="font-mono text-[11px] text-[#75695C] mt-1 m-0">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Featured Products */}
        <section className="w-full px-6 md:px-16 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE2D5] pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#9B7A2B]">Handpicked Arrivals</span>
              <h2 className="text-4xl sm:text-5xl font-normal text-[#1C1712] mt-1 m-0">Featured Luxury Picks</h2>
            </div>
            <Link href="/feed" className="font-mono text-xs font-bold uppercase tracking-widest text-[#1C1712] hover:text-[#C8A24F] flex items-center gap-1 transition-colors">
              Explore Full Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => {
              const isLiked = wishlist[product.id];

              return (
                <div
                  key={product.id}
                  className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[36px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(200,162,79,0.12)] transition-all duration-500 hover:-translate-y-2 group flex flex-col justify-between"
                >
                  <div className="h-72 bg-[#F8F3EB] relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-[#1C1712] text-white font-mono text-[10px] font-bold px-3.5 py-1 rounded-full uppercase tracking-widest">
                      {product.tag}
                    </span>

                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md text-[#1C1712] hover:text-[#C8A24F] transition-colors shadow-sm"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#C8A24F] text-[#C8A24F]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-7 space-y-5">
                    <div>
                      <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#75695C] m-0">{product.brand}</p>
                      <h3 className="font-normal text-2xl text-[#1C1712] mt-1 line-clamp-1 m-0">{product.title}</h3>
                      <div className="flex items-center gap-1 text-[#C8A24F] mt-1.5">
                        {[...Array(product.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#C8A24F]" />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#EAE2D5]">
                      <h4 className="text-2xl font-normal text-[#1C1712] m-0">${product.price.toLocaleString()}</h4>
                      <Link
                        href="/feed"
                        className="px-6 py-3 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-1.5 shadow-md shadow-[#C8A24F]/20"
                      >
                        Virtual Buy <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Collection Banner */}
        <section className="w-full px-6 md:px-16">
          <div className="relative rounded-[48px] overflow-hidden border border-white/80 shadow-2xl h-[480px] flex items-center p-8 md:p-20">
            <img
              src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=80"
              alt="Luxury Watches Collection"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C1712]/90 via-[#1C1712]/60 to-transparent" />

            <div className="relative z-10 max-w-xl text-white space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#C8A24F] font-bold">
                CURATED COLLECTION
              </span>
              <h2 className="text-5xl md:text-6xl font-normal leading-tight m-0 text-white">
                Haute Horlogerie & Timepieces
              </h2>
              <p className="text-sm text-white/80 leading-relaxed font-normal m-0">
                Acquire handcrafted tourbillons, skeleton chronographs, and rare releases using your daily virtual allowance.
              </p>
              <Link
                href="/feed?category=watches"
                className="inline-flex items-center gap-2 px-9 py-4 bg-white text-[#1C1712] hover:bg-[#FAF7F2] font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-colors shadow-xl"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 8. Allowance Dashboard */}
        <section className="w-full px-6 md:px-16">
          <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-2xl border border-white/90 rounded-[44px] p-10 md:p-16 shadow-[0_25px_60px_rgba(0,0,0,0.04)] space-y-10">
            <div className="text-center space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#9B7A2B]">Capital Allocation Dashboard</span>
              <h2 className="text-4xl sm:text-5xl font-normal text-[#1C1712] m-0">Daily Virtual Allowance</h2>
              <p className="text-sm text-[#75695C] max-w-md mx-auto m-0">
                Log in every 24 hours to collect daily grants, maintain streak multipliers, and claim bonus bucks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-[#FAF7F2] border border-[#EAE2D5] rounded-[28px] p-7 space-y-2">
                <span className="font-mono text-xs font-bold text-[#75695C] uppercase tracking-wider block">Today's Balance</span>
                <h3 className="text-4xl font-normal text-[#1C1712] m-0">$10,000.00</h3>
                <p className="font-mono text-[11px] text-[#75695C] m-0">Credited automatically upon login.</p>
              </div>

              <div className="bg-[#FAF7F2] border border-[#EAE2D5] rounded-[28px] p-7 space-y-2">
                <span className="font-mono text-xs font-bold text-[#75695C] uppercase tracking-wider block">Active Login Streak</span>
                <h3 className="text-4xl font-normal text-[#9B7A2B] m-0">8 Days</h3>
                <p className="font-mono text-[11px] text-[#75695C] m-0">Streak multiplier active (+20% bonus).</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-9 py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-[#C8A24F]/25 transition-all"
              >
                Claim Daily Grant <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 9. Brand Showcase */}
        <section className="w-full px-6 md:px-16 text-center space-y-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#75695C]">
            Simulated Global Luxury Maisons
          </span>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-20 text-2xl sm:text-3xl text-[#75695C]/50 tracking-widest">
            <h4 className="m-0 text-[#75695C]/50">JACQUEMUS</h4>
            <h4 className="m-0 text-[#75695C]/50">ZARA STUDIO</h4>
            <h4 className="m-0 text-[#75695C]/50">AESOP</h4>
            <h4 className="m-0 text-[#75695C]/50">RARE RABBIT</h4>
            <h4 className="m-0 text-[#75695C]/50">COS</h4>
          </div>
        </section>
      </main>
      <AppleScrollSection/>

      {/* 10. Footer */}
      <footer className="w-full bg-white/80 border-t border-[#EAE2D5] py-12 px-6 md:px-16">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <h3 className="font-normal text-2xl text-[#1C1712] m-0">DopaCart®</h3>
            <p className="font-mono text-xs text-[#75695C] m-0">— Pure Digital Impulse. Zero Real Cash.</p>
          </div>
          <div className="flex gap-10 font-mono text-xs font-bold uppercase tracking-widest text-[#1C1712]">
            <Link href="/feed" className="hover:text-[#C8A24F] transition-colors">Catalog</Link>
            <Link href="/leaderboard" className="hover:text-[#C8A24F] transition-colors">Standings</Link>
            <Link href="/login" className="hover:text-[#C8A24F] transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}