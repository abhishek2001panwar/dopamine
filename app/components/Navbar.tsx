'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/src/lib/store';
import { 
  ShoppingBag, 
  Sparkles, 
  Search, 
  User, 
  Flame, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import { CartDrawer } from './CartDrawer';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // App Store State
  const { fakeBalance, streakCount, cart, resetUser } = useAppStore();
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
    // { label: 'Wardrobe', href: '/closet' },
    { label: 'Badges', href: '/badges' },
    { label: 'Standings', href: '/leaderboard' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/feed?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Handle Logout Action
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        // Clear Zustand global user state if function exists
        if (resetUser) resetUser();

        // Redirect to login page
        router.push('/login');
        router.refresh();
      } else {
        console.error('Failed to log out');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* FIXED TOP NAVBAR PINNED TO VERY TOP OF VIEWPORT */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full font-sans-modern">
        {/* Top Utility Announcement Bar */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1C1712] via-[#2A231B] to-[#1C1712] text-[#F8F3EB] py-2 px-4 border-b border-[#C8A24F]/20 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em]">
          {/* Soft Ambient Gold Glows */}
          <div className="absolute -left-10 -top-10 w-28 h-28 bg-[#C8A24F]/15 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-[#C8A24F]/15 rounded-full blur-xl pointer-events-none" />

          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 sm:gap-4 relative z-10 text-center">
            {/* Left Icon Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C8A24F]/10 border border-[#C8A24F]/30 text-[#C8A24F] text-[9px] font-bold">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>DAILY GRANT</span>
            </div>

            {/* Center Text with Gold Shimmer */}
            <p className="m-0 truncate flex items-center gap-2 font-medium">
              <span className="sm:hidden text-[#C8A24F]">✨</span>
              <span>Refill Daily</span>
              <span className="text-[#C8A24F]/60">•</span>
              <span className="text-[#C8A24F] font-semibold bg-gradient-to-r from-[#FAF7F2] via-[#C8A24F] to-[#FAF7F2] bg-clip-text text-transparent animate-shimmer">
                Zero Real Dollars
              </span>
              <span className="text-[#C8A24F]/60">•</span>
              <span>Unlimited Impulse Shopping</span>
            </p>

            {/* Right Status Indicator */}
            <div className="hidden md:inline-flex items-center gap-1.5 text-[9px] text-[#75695C] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A24F] animate-ping" />
              <span>VAULT ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Flush Top Glass Navbar Header */}
        <header
          className={`w-full transition-all duration-300 bg-[#FAF7F2]/80 backdrop-blur-xl border-b border-[#EAE2D5] ${
            isScrolled
              ? 'shadow-[0_15px_35px_rgba(28,23,18,0.08)] py-2.5 sm:py-3.5 bg-[#FAF7F2]/95'
              : 'py-3 sm:py-4'
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
                className="p-2 sm:p-2.5 rounded-full bg-white/90 border border-[#EAE2D5] text-[#1C1712] hover:border-[#C8A24F] hover:text-[#C8A24F] hover:shadow-[0_4px_15px_rgba(200,162,79,0.2)] transition-all duration-300 shadow-sm flex items-center justify-center active:scale-95"
                aria-label="Search Products"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Glass Icon: Slide-Over Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:p-2.5 rounded-full bg-white/90 border border-[#EAE2D5] text-[#1C1712] hover:border-[#C8A24F] hover:text-[#C8A24F] hover:shadow-[0_4px_15px_rgba(200,162,79,0.2)] transition-all duration-300 shadow-sm flex items-center justify-center active:scale-95"
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
                className="p-2 sm:p-2.5 rounded-full bg-[#1C1712] text-white hover:bg-[#B38C3B] hover:shadow-[0_4px_15px_rgba(200,162,79,0.3)] transition-all duration-300 shadow-sm flex items-center justify-center active:scale-95"
                aria-label="Account Profile"
                title="Profile / Sign In"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Desktop Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="hidden sm:flex p-2 sm:p-2.5 rounded-full bg-white/90 border border-[#EAE2D5] text-[#75695C] hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all duration-300 shadow-sm items-center justify-center active:scale-95 disabled:opacity-50"
                aria-label="Log Out"
                title="Log Out Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
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

                {/* Mobile Dedicated Logout Action */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="py-3 mt-2 flex justify-between items-center text-red-600 font-bold w-full text-left bg-red-50/60 rounded-xl px-4 border border-red-100 active:scale-98 transition-all disabled:opacity-50"
                >
                  <span>{isLoggingOut ? 'Terminating Session...' : 'Log Out Vault'}</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </nav>
            </div>
          )}
        </header>
      </div>

      {/* INVISIBLE SPACER: Prevents page content from hiding under the fixed header */}
      <div className="pt-[105px] sm:pt-[118px]" />

      {/* Global Slide-Over Quick Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}