'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/src/lib/store';
import {
  ShoppingBag,
  Flame,
  Shirt,
  Trophy,
  LogOut,
  Zap,
  User,
} from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const { fakeBalance, streakCount, cart, clearCart } = useAppStore();

  const cartItemCount = Array.isArray(cart) ? cart.length : 0;

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });

      if (res.ok) {
        clearCart();
        localStorage.removeItem('dopacart-store-storage');
        window.location.href = '/login';
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch {
      alert('Network error during logout.');
    }
  };

  return (
    <header className="bg-white border-b-2 border-black sticky top-0 z-40 selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/feed" className="flex items-center gap-3 group">
          <div className="p-2.5 bg-black text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-neutral-800 transition-colors">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase font-serif">
            DOPACART<span className="text-xs font-sans font-normal align-top ml-0.5">®</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest font-bold">
          <Link
            href="/feed"
            className="hover:underline underline-offset-4 transition-all"
          >
            Catalog
          </Link>
          <Link
            href="/closet"
            className="flex items-center gap-1.5 hover:underline underline-offset-4 transition-all"
          >
            <Shirt className="w-4 h-4 text-black" /> Wardrobe
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 hover:underline underline-offset-4 transition-all"
          >
            <Trophy className="w-4 h-4 text-black" /> Rankings
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-1.5 hover:underline underline-offset-4 transition-all"
          >
            <User className="w-4 h-4 text-black" /> Dossier
          </Link>
        </nav>

        {/* Right Section: Streak, Balance, Bag, and Logout */}
        <div className="flex items-center gap-3 font-mono">
          {/* Daily Streak Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase">
            <Flame className="w-4 h-4 text-black fill-black" />
            <span>{streakCount}D STREAK</span>
          </div>

          {/* Fake Balance Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black">
            <span>${fakeBalance.toLocaleString()}</span>
          </div>

          {/* Bag / Cart Icon Button */}
          <Link
            href="/cart"
            className="p-2.5 bg-white hover:bg-neutral-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors relative"
            title="Your Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-black w-5 h-5 border border-white flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2.5 bg-white hover:bg-black hover:text-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}