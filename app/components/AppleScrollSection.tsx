'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ShoppingBag, Flame, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function AppleScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook scroll progress relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Smooth Apple-style 3D perspective transforms
  const rotateX = useTransform(scrollYProgress, [0.1, 0.45], [35, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.45], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  const translateY = useTransform(scrollYProgress, [0.1, 0.45], [100, 0]);

  // Floating micro-badge animations
  const floatY1 = useTransform(scrollYProgress, [0.2, 0.6], [40, -30]);
  const floatY2 = useTransform(scrollYProgress, [0.2, 0.6], [60, -40]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[160vh] bg-[#1C1712] text-[#F8F3EB] py-24 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-start font-sans"
    >
      {/* Ambient Radial Lighting Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8A24F]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Sticky Header Content */}
      <div className="sticky top-28 z-20 text-center max-w-3xl mx-auto space-y-4 mb-16">
        <motion.div
          style={{ opacity }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C8A24F]/30 backdrop-blur-md font-mono text-xs text-[#C8A24F] uppercase tracking-widest"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C8A24F] animate-pulse" />
          The High-Roller Operating System
        </motion.div>

        <motion.h2
          style={{ opacity }}
          className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white m-0"
        >
          Designed for <span className="italic text-[#C8A24F]">Pure</span> Dopamine.
        </motion.h2>

        <motion.p
          style={{ opacity }}
          className="font-mono text-xs sm:text-sm text-[#75695C] uppercase tracking-widest max-w-lg mx-auto m-0"
        >
          Scroll to open the virtual studio terminal. Zero real currency, unlimited high-fashion acquisition.
        </motion.p>
      </div>

      {/* 3D Apple-Style Canvas Screen Container */}
      <div className="w-full max-w-6xl mx-auto perspective-[1200px] pt-12">
        <motion.div
          style={{
            rotateX,
            scale,
            opacity,
            translateY,
          }}
          className="relative rounded-[40px] border border-[#C8A24F]/40 bg-[#251F19]/90 backdrop-blur-2xl p-4 sm:p-6 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* macOS Style Window Controls Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#75695C]/20 px-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="ml-3 text-[#75695C] uppercase text-[10px] tracking-widest hidden sm:inline-block">
                DopaCart OS v2.6 — Vault Engine Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#C8A24F]/20 text-[#C8A24F] text-[10px] font-bold uppercase tracking-widest border border-[#C8A24F]/40">
                Grant Balance: $100,000
              </span>
            </div>
          </div>

          {/* Interactive Screen Display Area */}
          <div className="relative rounded-[28px] overflow-hidden bg-[#1C1712] border border-white/10 mt-4 h-[500px] sm:h-[620px] flex flex-col justify-between p-6 sm:p-12">
            {/* Screen Content Background Artwork */}
            <img
              src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=80"
              alt="Luxury Horology Screen"
              className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1712] via-[#1C1712]/70 to-transparent" />

            {/* Screen Top Header Bar */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#C8A24F] font-bold block">
                  Simulated Maison Catalog
                </span>
                <h3 className="text-3xl sm:text-5xl font-normal text-white m-0">
                  Haute Horlogerie & Gear
                </h3>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md font-mono text-xs text-white">
                <Flame className="w-4 h-4 text-[#C8A24F]" />
                <span>8-Day Active Streak</span>
              </div>
            </div>

            {/* Screen Center Product Card Display */}
            <div className="relative z-10 my-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-6">
              <div className="md:col-span-7 space-y-4">
                <span className="bg-[#C8A24F] text-white font-mono text-[10px] font-bold px-3.5 py-1 rounded-full uppercase tracking-widest inline-block">
                  INSTANT ACQUISITION
                </span>
                <h4 className="text-3xl sm:text-4xl font-normal text-white m-0">
                  Onyx Skeleton Automatic
                </h4>
                <p className="font-mono text-xs text-[#75695C] leading-relaxed max-w-md m-0">
                  Crafted in forged carbon with self-winding precision. Zero credit card checks required.
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <span className="font-mono text-3xl font-bold text-[#C8A24F]">
                    $8,900
                  </span>
                  <Link
                    href="/feed"
                    className="px-7 py-3 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-lg shadow-[#C8A24F]/30 flex items-center gap-2"
                  >
                    Acquire Drop <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-5 relative hidden md:block">
                <div className="w-full h-64 bg-white/5 rounded-[32px] border border-white/10 p-4 overflow-hidden relative group">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
                    alt="Skeleton Watch"
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6 p-3 rounded-full bg-black/60 backdrop-blur-md text-[#C8A24F] border border-white/20">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Bottom Bar */}
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10 font-mono text-xs text-[#75695C]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8A24F]" />
                <span>100% Risk-Free Virtual Wallet Protection</span>
              </div>
              <span className="text-[#C8A24F] uppercase font-bold">
                ● 14,200 Active High Rollers Online
              </span>
            </div>
          </div>

          {/* Floating High-Dopamine Badges (Drift on Scroll) */}
          <motion.div
            style={{ y: floatY1 }}
            className="hidden lg:flex absolute -left-8 top-1/3 bg-white/90 backdrop-blur-2xl border border-white text-[#1C1712] p-5 rounded-[28px] shadow-2xl items-center gap-4 z-30"
          >
            <div className="p-3 bg-[#1C1712] text-[#C8A24F] rounded-2xl">
              <Zap className="w-6 h-6 fill-[#C8A24F]" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-[#75695C] uppercase tracking-widest block">
                Instant Processing
              </span>
              <p className="font-serif font-bold text-base text-[#1C1712] m-0">
                +$5,000 Daily Grant
              </p>
            </div>
          </motion.div>

          <motion.div
            style={{ y: floatY2 }}
            className="hidden lg:flex absolute -right-8 bottom-1/4 bg-[#1C1712]/90 backdrop-blur-2xl border border-[#C8A24F]/50 text-white p-5 rounded-[28px] shadow-2xl items-center gap-4 z-30"
          >
            <div className="p-3 bg-[#C8A24F] text-white rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-[#C8A24F] uppercase tracking-widest block">
                Order Settled
              </span>
              <p className="font-serif font-bold text-base text-white m-0">
                Added to Wardrobe Vault
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}