'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Clock, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/src/lib/store';

interface DropCardProps {
  product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    tag?: string;
    dropEndsAt?: string;
  };
  onClaimSuccess: (product: any) => void;
}

export function DropCountdownCard({ product, onClaimSuccess }: DropCardProps) {
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 59, seconds: 59 });

  const { fakeBalance } = useAppStore();

  // Ticking countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaimDrop = async () => {
    if (claiming || claimed) return;

    if (fakeBalance < product.price) {
      alert(`Insufficient virtual funds. You need $${product.price.toLocaleString()} to claim this drop.`);
      return;
    }

    setClaiming(true);

    try {
      // Trigger success callback to add to cart store
      onClaimSuccess(product);
      setClaimed(true);

      // Trigger Confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C8A24F', '#9B7A2B', '#FFFFFF', '#1C1712'],
      });
    } catch (err) {
      console.error('Drop claim error:', err);
      alert('Failed to claim drop. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="bg-[#1C1712] text-[#F8F3EB] border border-[#C8A24F]/50 rounded-[36px] p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.2)] flex flex-col justify-between relative overflow-hidden font-sans group">
      {/* Ambient Gold Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#75695C]/30 font-mono text-xs">
          <span className="text-[#C8A24F] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Live Limited Drop
          </span>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 text-white font-bold">
            <Clock className="w-3.5 h-3.5 text-[#C8A24F] animate-pulse" />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Card Main Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6">
          <div className="md:col-span-5 h-48 rounded-2xl overflow-hidden border border-white/10 relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {product.tag && (
              <span className="absolute top-3 left-3 bg-[#C8A24F] text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                {product.tag}
              </span>
            )}
          </div>

          <div className="md:col-span-7 space-y-2">
            <h3 className="text-2xl font-normal text-white m-0 line-clamp-1">{product.title}</h3>
            <p className="text-xs text-[#75695C] leading-relaxed line-clamp-2 m-0">{product.description}</p>
            <div className="pt-2 font-mono text-2xl font-bold text-[#C8A24F]">
              ${product.price?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#75695C]/30 flex items-center justify-between gap-4 font-mono">
        <span className="text-[10px] uppercase text-[#75695C] hidden sm:inline-block">
          ● Instant Vault Transfer
        </span>

        <button
          onClick={handleClaimDrop}
          disabled={claiming || claimed}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
            claimed
              ? 'bg-white/10 text-[#C8A24F] border border-[#C8A24F] cursor-default'
              : 'bg-[#C8A24F] hover:bg-[#B38C3B] text-white shadow-[#C8A24F]/25'
          }`}
        >
          {claimed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#C8A24F]" />
              <span>Claimed to Bag!</span>
            </>
          ) : claiming ? (
            <span>Processing Claim...</span>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>Claim Drop Item</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}