'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/src/lib/store';
import { 
  ShoppingBag, 
  Sparkles, 
  Search, 
  User, 
  Flame, 
  Menu, 
  X
} from 'lucide-react';
import { CartDrawer } from './CartDrawer';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // App Store State
  const { fakeBalance, streakCount, cart } = useAppStore();
  const cartItemCount = Array.isArray(cart) ? cart.length : 0;

  // Handle scroll effect for dynamic glass shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Catalog', href: '/feed' },
    { label: 'Wardrobe', href: '/closet' },
    { label: 'Badges', href: '/badges' }, // <--- Trophy Room Route Added
    { label: 'Standings', href: '/leaderboard' },
    { label: 'Profile', href: '/profile' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/feed?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* SINGLE STICKY WRAPPER PINNED TO VERY TOP */}
      <div className="sticky top-0 z-50 w-full font-sans-modern">
        {/* Top Utility Announcement Bar */}
        <div className="bg-[#1C1712] text-[#F8F3EB] py-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 px-4 relative text-center">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A24F] animate-pulse shrink-0 hidden sm:inline-block" />
          <span className="truncate">Refill Daily • Zero Real Dollars • Unlimited Impulse Shopping</span>
          <Sparkles className="w-3.5 h-3.5 text-[#C8A24F] animate-pulse shrink-0 hidden sm:inline-block" />
        </div>

        {/* Flush Top Glass Navbar */}
        <header
          className={`w-full transition-all duration-300 bg-[#FAF7F2]/90 backdrop-blur-2xl border-b border-[#EAE2D5] ${
            isScrolled
              ? 'shadow-[0_15px_35px_rgba(28,23,18,0.06)] py-3 sm:py-3.5'
              : 'py-4 sm:py-5'
          }`}
        >
          <div className="max-w-8xl mx-auto px-4 sm:px-8 md:px-12 w-full flex items-center justify-between gap-4 sm:gap-6">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1C1712] hover:text-[#C8A24F] transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Luxury Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <h1 className="font-serif-luxury font-black text-2xl sm:text-3xl tracking-tight text-[#1C1712]">
                Dopa<span className="text-[#C8A24F] italic">Cart</span>
                <span className="text-[9px] font-sans text-[#9B7A2B] align-top ml-0.5 font-bold">®</span>
              </h1>
            </Link>

            {/* Desktop Editorial Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10 font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#75695C]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors relative py-1 ${
                      isActive ? 'text-[#1C1712] font-bold' : 'hover:text-[#1C1712]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C8A24F] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Utilities & Icons */}
            <div className="flex items-center gap-2 sm:gap-3 font-mono">
              {/* Virtual Grant Balance Pill */}
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#EAE2D5] text-[#1C1712] text-xs font-bold shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#C8A24F] animate-pulse" />
                <span className="text-[9px] text-[#75695C] uppercase tracking-wider font-semibold">Grant</span>
                <span className="text-[#9B7A2B] font-serif-luxury font-bold text-xs sm:text-sm">
                  ${(fakeBalance || 0).toLocaleString()}
                </span>
              </div>

              {/* Login Streak Indicator */}
              <div
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EAE2D5] text-[#1C1712] text-xs font-bold"
                title="Current Daily Login Streak"
              >
                <Flame className="w-3.5 h-3.5 text-[#C8A24F]" />
                <span className="text-[#1C1712]">{streakCount || 0}D</span>
              </div>

              {/* Glass Icon: Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full bg-white/90 border border-[#EAE2D5] text-[#1C1712] hover:border-[#C8A24F] hover:text-[#C8A24F] hover:shadow-[0_4px_15px_rgba(200,162,79,0.2)] transition-all duration-300 shadow-sm flex items-center justify-center active:scale-95"
                aria-label="Search Products"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Glass Icon: Slide-Over Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-white/90 border border-[#EAE2D5] text-[#1C1712] hover:border-[#C8A24F] hover:text-[#C8A24F] hover:shadow-[0_4px_15px_rgba(200,162,79,0.2)] transition-all duration-300 shadow-sm flex items-center justify-center active:scale-95"
                aria-label="View Quick Cart Drawer"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C8A24F] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md border border-white">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Glass Icon: User Profile */}
              <Link
                href="/profile"
                className="p-2.5 rounded-full bg-[#1C1712] text-white hover:bg-[#B38C3B] hover:shadow-[0_4px_15px_rgba(200,162,79,0.3)] transition-all duration-300 shadow-sm flex items-center justify-center active:scale-95"
                aria-label="Account Profile"
                title="Profile / Sign In"
              >
                <User className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Search Dropdown Drawer */}
          {searchOpen && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mt-3 pt-3 border-t border-[#EAE2D5] animate-fadeIn">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                <Search className="w-4 h-4 text-[#75695C] shrink-0" />
                <input
                  type="text"
                  placeholder="Search footwear, timepieces, apparel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent font-mono text-xs sm:text-sm text-[#1C1712] placeholder:text-[#75695C] focus:outline-none py-1"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-[#75695C] hover:text-[#1C1712]"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden max-w-7xl mx-auto px-6 mt-4 pt-4 border-t border-[#EAE2D5] space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-[#EAE2D5]/60">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#75695C]">Balance</span>
                  <p className="font-serif-luxury font-bold text-base text-[#9B7A2B]">
                    ${(fakeBalance || 0).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EAE2D5] text-xs font-mono font-bold text-[#1C1712]">
                  <Flame className="w-3.5 h-3.5 text-[#C8A24F]" />
                  <span>{streakCount || 0}D Streak</span>
                </div>
              </div>

              <nav className="flex flex-col space-y-2 font-mono text-xs uppercase tracking-widest">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 border-b border-[#EAE2D5]/40 flex justify-between items-center ${
                      pathname === link.href ? 'text-[#C8A24F] font-bold' : 'text-[#1C1712]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-[#75695C]">→</span>
                  </Link>
                ))}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="py-2 border-b border-[#EAE2D5]/40 flex justify-between items-center text-[#1C1712] w-full text-left"
                >
                  <span>Quick Bag ({cartItemCount})</span>
                  <ShoppingBag className="w-4 h-4 text-[#C8A24F]" />
                </button>
              </nav>
            </div>
          )}
        </header>
      </div>

      {/* Global Slide-Over Quick Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}