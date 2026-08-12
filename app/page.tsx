'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Heart, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AppleScrollSection } from './components/AppleScrollSection';
import InstallPWA from './components/InstallPWA';

// Editorial Pillars
const PILLARS = [
  {
    num: '01',
    title: 'Daily Capital Grant',
    desc: 'Receive automatic daily allowance refills. Settle high-end acquisitions instantly without touching real fiat currency.',
    badge: '$10,000 DEFAULT'
  },
  {
    num: '02',
    title: 'Vault 2FA Security',
    desc: 'Your custom 16-digit Infinite Black Card is secured behind email OTP verification for every transaction.',
    badge: '100% PROTECTED'
  },
  {
    num: '03',
    title: 'Curated Dossier',
    desc: 'Construct a personal digital wardrobe archive of rare timepieces, outerwear, footwear, and bespoke tailoring.',
    badge: 'EXCLUSIVE ARCHIVE'
  }
];

const CATEGORIES = [
  { name: 'Timepieces', desc: 'Haute Horlogerie', icon: '⌚', href: '/feed?category=Timepieces' },
  { name: 'Footwear', desc: 'Sneakers & Kicks', icon: '👟', href: '/feed?category=Footwear' },
  { name: 'Outerwear', desc: 'Coats & Jackets', icon: '🧥', href: '/feed?category=Outerwear' },
  { name: 'Cyber Gear', desc: 'Audio & Tech', icon: '⚡', href: '/feed?category=Gear' },
  { name: 'Tailoring', desc: 'VIP Formalwear', icon: '✨', href: '/feed?category=Tailoring' },
  { name: 'Bottoms', desc: 'Raw Denim & Pants', icon: '👖', href: '/feed?category=Bottoms' },
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
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white font-sans antialiased overflow-x-hidden">
      <Navbar />
      <InstallPWA />

      {/* --- HERO SECTION --- */}
      <section className="w-full max-w-7xl mx-auto px-4 xs:px-6 sm:px-12 pt-6 xs:pt-10 sm:pt-20 pb-10 sm:pb-16 space-y-6 sm:space-y-12 text-center">
        {/* Subtle Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 xs:gap-2 px-3 py-1 xs:px-4 xs:py-1.5 rounded-full bg-white border border-[#EAE2D5] font-mono text-[9px] xs:text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest text-[#9B7A2B] shadow-sm"
        >
          <Sparkles className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-[#C8A24F] shrink-0" /> 
          <span>Pure Impulse • Zero Real Dollars</span>
        </motion.div>

        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-2.5 sm:space-y-4 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl xs:text-5xl sm:text-7xl font-normal tracking-tight leading-[1.08] text-[#1C1712] m-0">
            Acquire Everything.<br />
            <span className="font-serif-luxury italic text-[#C8A24F]">Surrender Nothing.</span>
          </h1>
          <p className="font-mono text-[10px] xs:text-xs sm:text-sm text-[#75695C] uppercase tracking-wider sm:tracking-[0.2em] max-w-xl mx-auto leading-relaxed m-0 px-2">
            The zero-cost luxury shopping simulator powered by daily grant allowances & protected Infinite Black Cards.
          </p>
        </motion.div>

        {/* Primary Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-mono text-xs font-bold uppercase pt-1 sm:pt-2 px-2 sm:px-0"
        >
          <Link
            href="/feed"
            className="w-full sm:w-auto px-6 xs:px-8 py-3.5 sm:py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white tracking-wider sm:tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-6 xs:px-8 py-3.5 sm:py-4 bg-white hover:bg-[#FAF7F2] border border-[#EAE2D5] text-[#1C1712] tracking-wider sm:tracking-widest rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
          >
            <span>Claim Daily Grant</span>
          </Link>
        </motion.div>

        {/* Hero Visual Card Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-2 sm:pt-6"
        >
          <div className="relative rounded-[24px] xs:rounded-[32px] sm:rounded-[44px] overflow-hidden border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white/80 p-2 xs:p-3 sm:p-4 max-w-5xl mx-auto">
            <div className="relative h-[240px] xs:h-[320px] sm:h-[480px] rounded-[18px] xs:rounded-[24px] sm:rounded-[36px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=85"
                alt="Luxury Fashion Editorial"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1712]/75 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 xs:bottom-6 xs:left-6 xs:right-6 sm:bottom-10 sm:left-10 text-left text-white space-y-1">
                <span className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] uppercase font-bold tracking-widest bg-[#C8A24F] text-white px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full inline-block">
                  CURATED DROP
                </span>
                <h3 className="text-lg xs:text-2xl sm:text-4xl font-normal m-0 text-white leading-tight">The Haute Horlogerie Dossier</h3>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- 3 PILLARS OF DOPACART --- */}
      <section className="w-full max-w-7xl mx-auto px-4 xs:px-6 sm:px-12 py-10 sm:py-16 border-t border-[#EAE2D5]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xs:gap-8 sm:gap-12">
          {PILLARS.map((p, idx) => (
            <div key={idx} className="space-y-2 sm:space-y-3 bg-white/40 sm:bg-transparent p-4 xs:p-5 sm:p-0 rounded-2xl border border-[#EAE2D5]/60 sm:border-none">
              <div className="flex justify-between items-center font-mono">
                <span className="text-lg sm:text-xl font-bold text-[#C8A24F]">{p.num}</span>
                <span className="text-[8px] xs:text-[9px] font-bold uppercase tracking-widest bg-white border border-[#EAE2D5] px-2.5 py-1 rounded-full text-[#75695C]">
                  {p.badge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-normal text-[#1C1712] m-0">{p.title}</h3>
              <p className="font-sans text-xs sm:text-sm text-[#75695C] leading-relaxed m-0">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CATEGORY CARDS --- */}
      <section className="w-full max-w-7xl mx-auto px-4 xs:px-6 sm:px-12 py-8 sm:py-12 space-y-6 sm:space-y-8 border-t border-[#EAE2D5]">
        <div className="flex flex-col xs:flex-row items-start xs:items-end justify-between gap-2 xs:gap-0">
          <div>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#9B7A2B]">Directories</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-normal text-[#1C1712] m-0">Browse By Vault</h2>
          </div>
          <Link href="/feed" className="font-mono text-[11px] sm:text-xs font-bold uppercase text-[#1C1712] hover:text-[#C8A24F] flex items-center gap-1 transition-colors self-end xs:self-auto">
            All Categories <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 xs:gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="bg-white border border-[#EAE2D5] rounded-2xl p-3.5 xs:p-5 text-center space-y-1.5 xs:space-y-2.5 hover:border-[#C8A24F] transition-all duration-300 hover:-translate-y-1 group block shadow-sm"
            >
              <div className="text-2xl xs:text-3xl">{cat.icon}</div>
              <div>
                <h4 className="font-normal text-sm xs:text-base text-[#1C1712] group-hover:text-[#C8A24F] transition-colors m-0 truncate">{cat.name}</h4>
                <p className="font-mono text-[9px] xs:text-[10px] text-[#75695C] m-0 truncate">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- FEATURED PRODUCTS GRID --- */}
      <section className="w-full max-w-7xl mx-auto px-4 xs:px-6 sm:px-12 py-8 sm:py-12 space-y-6 sm:space-y-8 border-t border-[#EAE2D5]">
        <div className="flex flex-col xs:flex-row items-start xs:items-end justify-between gap-2 xs:gap-0">
          <div>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#9B7A2B]">Handpicked</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-normal text-[#1C1712] m-0">Featured Acquisitions</h2>
          </div>
          <Link href="/feed" className="font-mono text-[11px] sm:text-xs font-bold uppercase text-[#1C1712] hover:text-[#C8A24F] flex items-center gap-1 transition-colors self-end xs:self-auto">
            Full Catalog <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-72 sm:h-80 animate-pulse border border-[#EAE2D5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6">
            {featuredProducts.map((product) => {
              const isLiked = wishlist[product._id];

              return (
                <div
                  key={product._id}
                  className="bg-white border border-[#EAE2D5] rounded-2xl xs:rounded-3xl overflow-hidden shadow-sm hover:border-[#C8A24F] transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <Link href={`/products/${product._id}`} className="h-52 xs:h-64 bg-[#F8F3EB] relative overflow-hidden block">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => toggleWishlist(product._id, e)}
                      className="absolute top-3 right-3 p-2 xs:p-2.5 rounded-full bg-white/80 backdrop-blur-md text-[#1C1712] hover:text-[#C8A24F] transition-colors shadow-sm active:scale-90"
                    >
                      <Heart className={`w-3.5 h-3.5 xs:w-4 xs:h-4 ${isLiked ? 'fill-[#C8A24F] text-[#C8A24F]' : ''}`} />
                    </button>
                  </Link>

                  <div className="p-4 xs:p-5 space-y-3">
                    <div>
                      <span className="font-mono text-[9px] xs:text-[10px] font-bold uppercase text-[#75695C] block">
                        {product.category || 'Luxury Drop'}
                      </span>
                      <h3 className="text-base xs:text-lg font-normal text-[#1C1712] m-0 line-clamp-1">{product.title}</h3>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 xs:pt-3 border-t border-[#EAE2D5]">
                      <span className="font-mono text-base xs:text-lg font-bold text-[#1C1712]">
                        ${(product.price || 0).toLocaleString()}
                      </span>
                      <Link
                        href={`/products/${product._id}`}
                        className="p-2 xs:p-2.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white rounded-full transition-all shadow-sm active:scale-95"
                        title="Inspect Product"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Apple Scroll Showcase */}
      <AppleScrollSection />

      {/* --- CLEAN FOOTER --- */}
      <footer className="w-full border-t border-[#EAE2D5] py-8 sm:py-12 px-4 xs:px-6 sm:px-12 bg-white font-mono text-xs text-[#75695C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1712] m-0">DopaCart®</h3>
            <p className="m-0 text-[11px] sm:text-xs">Pure Digital Impulse. Zero Real Dollars Required.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 xs:gap-6 font-bold uppercase text-[#1C1712] text-[11px] sm:text-xs">
            <Link href="/feed" className="hover:text-[#C8A24F]">Catalog</Link>
            <Link href="/leaderboard" className="hover:text-[#C8A24F]">Standings</Link>
            <Link href="/login" className="hover:text-[#C8A24F]">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}