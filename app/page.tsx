'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Star, 
  ChevronRight 
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AppleScrollSection } from './components/AppleScrollSection';
import InstallPWA from './components/InstallPWA';

const categories = [
  { name: 'Sneakers & Kicks', count: 'Footwear Collection', icon: '👟', href: '/feed?category=Footwear' },
  { name: 'Luxury Apparel', count: 'Outerwear & Tops', icon: '🧥', href: '/feed?category=Outerwear' },
  { name: 'Haute Horlogerie', count: 'Timepieces', icon: '⌚', href: '/feed?category=Timepieces' },
  { name: 'Cyber Tech & Gear', count: 'Tech & Gear', icon: '⚡', href: '/feed?category=Gear' },
  { name: 'Tailoring & Suits', count: 'VIP Formalwear', icon: '✨', href: '/feed?category=Tailoring' },
  { name: 'Denim & Bottoms', count: 'Raw Denim & Trousers', icon: '👖', href: '/feed?category=Bottoms' },
];

const liveTicker = [
  { user: 'Alex M.', action: 'acquired Rolex Submariner', price: '$14,200', time: 'Just now' },
  { user: 'Emma K.', action: 'acquired Dior Saddle Bag', price: '$3,800', time: '3m ago' },
  { user: 'James R.', action: 'acquired MacBook Pro M3', price: '$2,499', time: '5m ago' },
  { user: 'Sophia L.', action: 'acquired Jordan 1 Retro', price: '$1,250', time: '8m ago' },
  { user: 'Lucas P.', action: 'acquired Porsche 911 GT3', price: '$225,000', time: '11m ago' },
];

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setFeaturedProducts(data.products.slice(0, 4));
        }
      })
      .catch((err) => console.error('Failed to load featured products:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#231E18] selection:bg-[#C8A24F] selection:text-white antialiased overflow-x-hidden font-sans">
      <Navbar />
      <InstallPWA />

      {/* Social Ticker */}
      <div className="w-full bg-white/50 border-b border-[#EAE2D5] py-2.5 sm:py-3 overflow-hidden">
        <div className="flex items-center gap-8 sm:gap-12 whitespace-nowrap animate-marquee">
          {liveTicker.concat(liveTicker).map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8A24F] animate-ping" />
              <p className="font-mono text-[11px] sm:text-xs text-[#75695C] m-0">
                <strong className="text-[#1C1712] font-semibold">{item.user}</strong> {item.action} for{' '}
                <span className="text-[#9B7A2B] font-bold">{item.price}</span>{' '}
                <span className="text-[#75695C]/60 text-[10px]">({item.time})</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <main className="w-full space-y-16 sm:space-y-24 md:space-y-32 py-8 sm:py-16">
        {/* Full-Width Hero Section */}
        <section className="w-full px-4 sm:px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left Image Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 relative"
            >
              <div className="relative rounded-[28px] sm:rounded-[40px] overflow-hidden border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/60 backdrop-blur-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80"
                  alt="Luxury Fashion Hero"
                  className="w-full h-[360px] sm:h-[480px] lg:h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1712]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-1.5 sm:space-y-2 backdrop-blur-2xl bg-white/20 p-5 sm:p-8 rounded-[20px] sm:rounded-[28px] border border-white/30 shadow-2xl">
                  <span className="inline-block font-mono text-[9px] sm:text-[10px] uppercase tracking-widest bg-[#C8A24F] text-white px-3 py-1 rounded-full font-bold">
                    SPRING '26 EDITORIAL
                  </span>
                  <h3 className="text-xl sm:text-3xl font-normal m-0 text-white">The High-Roller Capsule</h3>
                  <p className="text-[11px] sm:text-xs text-white/80 font-normal m-0">Acquire without financial constraint.</p>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 space-y-6 sm:space-y-8"
            >
              <div className="space-y-4 sm:space-y-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/80 border border-[#EAE2D5] text-[#9B7A2B] font-mono text-[11px] sm:text-xs uppercase tracking-widest shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A24F]" /> Zero-Cost Luxury Simulator
                </span>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal text-[#1C1712] leading-[1.08] tracking-tight m-0">
                  Buy Luxury.<br />
                  <span className="italic text-[#C8A24F]">Spend</span> Nothing.
                </h1>

                <p className="text-sm sm:text-lg text-[#75695C] leading-relaxed font-normal max-w-xl m-0">
                  Discover thousands of curated luxury drops, build your dream wardrobe archive, and spend only virtual capital.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-5 font-mono text-xs font-bold uppercase">
                <Link
                  href="/feed"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white tracking-widest rounded-full shadow-[0_15px_30px_rgba(200,162,79,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                >
                  Start Shopping <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/feed"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white/80 hover:bg-white text-[#1C1712] border border-[#EAE2D5] tracking-widest rounded-full shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  Browse Collections
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="pt-6 sm:pt-8 border-t border-[#EAE2D5] grid grid-cols-3 gap-3 sm:gap-6 font-mono">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-normal text-[#1C1712] m-0">120K+</h2>
                  <p className="text-[10px] sm:text-[11px] text-[#75695C] uppercase tracking-wider mt-1 m-0">Active Users</p>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-4xl font-normal text-[#1C1712] m-0">8M+</h2>
                  <p className="text-[10px] sm:text-[11px] text-[#75695C] uppercase tracking-wider mt-1 m-0">Purchases</p>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-4xl font-normal text-[#1C1712] m-0">15K+</h2>
                  <p className="text-[10px] sm:text-[11px] text-[#75695C] uppercase tracking-wider mt-1 m-0">Products</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="w-full px-4 sm:px-8 md:px-16 space-y-6 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#EAE2D5] pb-4 sm:pb-6">
            <div>
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#9B7A2B]">Curated Directories</span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#1C1712] mt-0.5 m-0">Explore By Category</h2>
            </div>
            <Link href="/feed" className="font-mono text-xs font-bold uppercase tracking-widest text-[#1C1712] hover:text-[#C8A24F] flex items-center gap-1 transition-colors">
              View All Directories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 text-center space-y-2.5 sm:space-y-4 shadow-[0_10px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(200,162,79,0.15)] hover:border-[#C8A24F] transition-all duration-300 hover:-translate-y-1 group block"
              >
                <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                <div>
                  <h4 className="font-normal text-base sm:text-xl text-[#1C1712] group-hover:text-[#9B7A2B] transition-colors m-0 truncate">{cat.name}</h4>
                  <p className="font-mono text-[10px] sm:text-[11px] text-[#75695C] mt-1 m-0 truncate">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Real Products from DB */}
        <section className="w-full px-4 sm:px-8 md:px-16 space-y-6 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#EAE2D5] pb-4 sm:pb-6">
            <div>
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#9B7A2B]">Handpicked Arrivals</span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#1C1712] mt-0.5 m-0">Featured Luxury Picks</h2>
            </div>
            <Link href="/feed" className="font-mono text-xs font-bold uppercase tracking-widest text-[#1C1712] hover:text-[#C8A24F] flex items-center gap-1 transition-colors">
              Explore Full Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white/60 border border-white/80 rounded-[28px] sm:rounded-[36px] h-72 sm:h-80 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featuredProducts.map((product) => {
                const isLiked = wishlist[product._id];

                return (
                  <div
                    key={product._id}
                    className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgba(200,162,79,0.12)] transition-all duration-300 sm:hover:-translate-y-2 group flex flex-col justify-between"
                  >
                    {/* Clickable Image */}
                    <Link href={`/products/${product._id}`} className="h-60 sm:h-72 bg-[#F8F3EB] relative overflow-hidden block">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {product.tag && (
                        <span className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 bg-[#1C1712] text-white font-mono text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                          {product.tag}
                        </span>
                      )}

                      <button
                        onClick={(e) => toggleWishlist(product._id, e)}
                        className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2.5 sm:p-3 rounded-full bg-white/80 backdrop-blur-md text-[#1C1712] hover:text-[#C8A24F] transition-colors shadow-sm z-10"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#C8A24F] text-[#C8A24F]' : ''}`} />
                      </button>
                    </Link>

                    <div className="p-5 sm:p-7 space-y-4 sm:space-y-5">
                      <div>
                        <p className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#75695C] m-0">
                          {product.category || 'Luxury Collection'}
                        </p>
                        <Link href={`/products/${product._id}`} className="no-underline">
                          <h3 className="font-normal text-xl sm:text-2xl text-[#1C1712] hover:text-[#C8A24F] transition-colors mt-1 line-clamp-1 m-0">
                            {product.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 text-[#C8A24F] mt-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#C8A24F]" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#EAE2D5]">
                        <h4 className="text-xl sm:text-2xl font-normal text-[#1C1712] m-0">
                          ${(product.price || 0).toLocaleString()}
                        </h4>
                        <Link
                          href={`/products/${product._id}`}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-1.5 shadow-md shadow-[#C8A24F]/20"
                        >
                          Inspect <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-[#75695C] font-mono text-xs uppercase">
              No featured items available. Run `npx tsx scripts/seed.ts` to populate the catalog.
            </div>
          )}
        </section>

        {/* Collection Banner */}
        <section className="w-full px-4 sm:px-8 md:px-16">
          <div className="relative rounded-[32px] sm:rounded-[48px] overflow-hidden border border-white/80 shadow-2xl min-h-[380px] sm:h-[480px] flex items-center p-6 sm:p-12 md:p-20">
            <img
              src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=80"
              alt="Luxury Watches Collection"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C1712]/95 via-[#1C1712]/70 to-transparent" />

            <div className="relative z-10 max-w-xl text-white space-y-4 sm:space-y-6">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#C8A24F] font-bold">
                CURATED COLLECTION
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal leading-tight m-0 text-white">
                Haute Horlogerie & Timepieces
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal m-0">
                Acquire handcrafted tourbillons, skeleton chronographs, and rare releases using your daily virtual allowance.
              </p>
              <Link
                href="/feed?category=Timepieces"
                className="inline-flex items-center gap-2 px-7 py-3.5 sm:px-9 sm:py-4 bg-white text-[#1C1712] hover:bg-[#FAF7F2] font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-colors shadow-xl"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <AppleScrollSection />

      {/* Footer */}
      <footer className="w-full bg-white/80 border-t border-[#EAE2D5] py-8 sm:py-12 px-4 sm:px-8 md:px-16">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <h3 className="font-normal text-2xl text-[#1C1712] m-0">DopaCart®</h3>
            <p className="font-mono text-xs text-[#75695C] m-0">— Pure Digital Impulse. Zero Real Cash.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 font-mono text-xs font-bold uppercase tracking-widest text-[#1C1712]">
            <Link href="/feed" className="hover:text-[#C8A24F] transition-colors">Catalog</Link>
            <Link href="/leaderboard" className="hover:text-[#C8A24F] transition-colors">Standings</Link>
            <Link href="/login" className="hover:text-[#C8A24F] transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}