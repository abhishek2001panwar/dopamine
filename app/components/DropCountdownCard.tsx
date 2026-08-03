'use client';

import { useEffect, useState } from 'react';
import { Flame, Clock, Sparkles } from 'lucide-react';

interface DropProps {
  product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    dropStartTime: string;
    virtualStock: number;
    claimedCount: number;
  };
  onClaimSuccess: (product: any) => void;
}

export function DropCountdownCard({ product, onClaimSuccess }: DropProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockLeft, setStockLeft] = useState(product.virtualStock - product.claimedCount);

  useEffect(() => {
    const targetDate = new Date(product.dropStartTime).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsLive(true);
        setTimeLeft(null);
        clearInterval(timer);
      } else {
        setIsLive(false);
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [product.dropStartTime]);

  const handleClaimDrop = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/drops/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });

      const data = await res.json();

      if (res.ok) {
        setStockLeft(data.remainingStock);
        onClaimSuccess(product);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to claim drop.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-red-950/40 via-zinc-900 to-black border-2 border-red-500/60 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Stock Tag */}
      <div className="absolute top-3 right-3 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider animate-pulse z-10 flex items-center gap-1">
        <Flame className="w-3.5 h-3.5" />
        {stockLeft > 0 ? `${stockLeft} / ${product.virtualStock} LEFT` : 'SOLD OUT'}
      </div>

      <div className="h-64 overflow-hidden relative">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
      </div>

      <div className="p-6 space-y-4">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Limited Virtual Drop
          </span>
          <h2 className="text-2xl font-black text-white">{product.title}</h2>
          <p className="text-xs text-zinc-400 mt-1">{product.description}</p>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <span className="text-2xl font-black text-pink-400">${product.price}</span>

          {isLive ? (
            <button
              onClick={handleClaimDrop}
              disabled={loading || stockLeft <= 0}
              className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                stockLeft <= 0
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 text-white hover:scale-105 shadow-lg shadow-red-500/30'
              }`}
            >
              {stockLeft <= 0 ? 'Sold Out' : loading ? 'Securing...' : 'Claim Drop Now'}
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-zinc-950 px-4 py-2 rounded-2xl border border-zinc-800 text-red-400 font-mono font-bold text-sm">
              <Clock className="w-4 h-4 animate-spin" />
              {timeLeft ? (
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              ) : (
                'Unlocking...'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}