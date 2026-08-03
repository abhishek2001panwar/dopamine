'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Shield, Zap, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Top Utility Bar */}
      <div className="border-b border-black text-center py-2 text-xs font-mono uppercase tracking-widest bg-black text-white">
        Zero Real Currency • Pure Digital Impulse • Refill Daily
      </div>

      {/* Main Header */}
      <header className="border-b border-black sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Editorial Logo */}
          <Link href="/" className="font-black text-3xl tracking-tighter uppercase font-serif">
            DOPACART<span className="text-sm font-sans font-normal align-top ml-1">®</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-10 font-mono text-xs uppercase tracking-wider font-semibold">
            <Link href="/feed" className="hover:underline underline-offset-4">
              Catalog
            </Link>
            <Link href="/closet" className="hover:underline underline-offset-4">
              Wardrobe
            </Link>
            <Link href="/leaderboard" className="hover:underline underline-offset-4">
              High Rollers
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-4 font-mono text-xs font-bold uppercase">
            <Link
              href="/login"
              className="px-4 py-2 hover:bg-neutral-100 transition-colors border border-transparent"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 bg-black text-white hover:bg-neutral-800 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="divide-y divide-black">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8 space-y-8">
              <span className="inline-block px-3 py-1 border border-black font-mono text-xs uppercase font-bold tracking-widest">
                Vol. 01 — Virtual Commerce Simulator
              </span>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] uppercase font-serif">
                Buy Everything.<br />
                Spend Nothing.
              </h1>

              <p className="text-lg md:text-xl font-normal text-neutral-600 max-w-xl leading-relaxed">
                A zero-cost luxury mall engineered for pure retail dopamine. Collect rare items, spin the reward wheel, and rank up without touch of financial regret.
              </p>
            </div>

            <div className="lg:col-span-4 space-y-6 border-t lg:border-t-0 lg:border-l border-black pt-8 lg:pt-0 lg:pl-12">
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase text-neutral-500 font-bold">Initial Allowance</p>
                <p className="text-4xl font-mono font-bold">$10,000.00</p>
                <p className="text-xs text-neutral-500">Credited instantly upon registration.</p>
              </div>

              <div className="pt-4 space-y-3">
                <Link
                  href="/signup"
                  className="w-full py-4 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                >
                  Create Account <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/feed"
                  className="w-full py-4 border border-black text-black font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-100 transition-colors"
                >
                  Explore Feed
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black divide-y md:divide-y-0 md:divide-x divide-black">
            {/* Column 1 */}
            <div className="p-8 space-y-6">
              <span className="font-mono text-xs font-bold text-neutral-400">01 / REWARDS</span>
              <h3 className="text-2xl font-bold font-serif uppercase tracking-tight">Daily Multipliers</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                Maintain continuous 24-hour check-in streaks to multiply your virtual budget allowance and gain exclusive rank status badges.
              </p>
            </div>

            {/* Column 2 */}
            <div className="p-8 space-y-6">
              <span className="font-mono text-xs font-bold text-neutral-400">02 / ARCHIVE</span>
              <h3 className="text-2xl font-bold font-serif uppercase tracking-tight">Digital Closet</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                Organize your acquired items in a personal wardrobe archive. Generate clean, high-resolution flex cards to export anywhere.
              </p>
            </div>

            {/* Column 3 */}
            <div className="p-8 space-y-6">
              <span className="font-mono text-xs font-bold text-neutral-400">03 / RANKINGS</span>
              <h3 className="text-2xl font-bold font-serif uppercase tracking-tight">High Roller Board</h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                Compete against big spenders globally. Rankings update live based on total virtual capital deployed in the catalog.
              </p>
            </div>
          </div>
        </section>

        {/* Large Statement Callout */}
        <section className="bg-black text-white py-24 px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              Zero Friction • Express Checkout
            </p>
            <h2 className="text-4xl md:text-6xl font-black font-serif tracking-tight uppercase leading-tight">
              Shopping without limits.<br />
              Zero real cards required.
            </h2>
            <div className="pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
              >
                Start Shopping Now <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 font-mono text-xs text-neutral-500 uppercase flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} DOPACART. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 font-bold text-black">
          <Link href="/feed" className="hover:underline">Catalog</Link>
          <Link href="/login" className="hover:underline">Login</Link>
          <Link href="/signup" className="hover:underline">Register</Link>
        </div>
      </footer>
    </div>
  );
}