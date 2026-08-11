'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Gift, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/src/lib/store';

// Helper: Get local date string YYYY-MM-DD safely (avoids UTC timezone bugs)
const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function DailyRewardModal() {
  const [claimedToday, setClaimedToday] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const { setBalance, setUserData } = useAppStore();

  useEffect(() => {
    const todayStr = getLocalDateString();
    const lastClaimLocal = localStorage.getItem('dopacart_daily_claimed_date');

    // 1. Instant check via localStorage
    if (lastClaimLocal === todayStr) {
      setClaimedToday(true);
    }

    // 2. Verified check via MongoDB API
    fetch('/api/user/profile', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setCurrentStreak(data.user.streakCount || 0);

          if (data.user.lastClaimedDate) {
            const lastClaimDate = new Date(data.user.lastClaimedDate);
            const lastClaimStr = getLocalDateString(lastClaimDate);

            // Compare calendar date strings directly
            if (lastClaimStr === todayStr) {
              setClaimedToday(true);
              localStorage.setItem('dopacart_daily_claimed_date', todayStr);
            } else {
              setClaimedToday(false);
            }
          }
        }
      })
      .catch((err) => console.error('Daily check error:', err));
  }, []);

  const handleClaim = async () => {
    if (claimedToday || claiming) return;

    setClaiming(true);

    try {
      const res = await fetch('/api/allowance/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const todayStr = getLocalDateString();

        // 1. Lock claim state locally
        localStorage.setItem('dopacart_daily_claimed_date', todayStr);
        setClaimedToday(true);

        // 2. Real-time Store Updates
        if (data.newBalance !== undefined) setBalance(data.newBalance);
        if (data.streakCount !== undefined) {
          setUserData({ streakCount: data.streakCount });
          setCurrentStreak(data.streakCount);
        }

        // 3. Victory Confetti Burst
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#C8A24F', '#9B7A2B', '#FFFFFF', '#1C1712'],
        });
      } else {
        // If API returned 400 (Already claimed)
        setClaimedToday(true);
        if (data.error) console.warn('Allowance notice:', data.error);
      }
    } catch (err) {
      console.error('Allowance claim network error:', err);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans selection:bg-[#C8A24F] selection:text-white">
      <div className="bg-[#1C1712] text-[#F8F3EB] border border-[#C8A24F]/40 p-6 md:p-8 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Left Info Hub */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-[#C8A24F] text-white rounded-2xl shadow-lg shadow-[#C8A24F]/20 shrink-0">
            <Gift className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#C8A24F] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Daily Grant & Streak Bonus
            </span>
            <h3 className="text-2xl font-normal text-white m-0">
              {claimedToday ? 'Daily Allowance Claimed' : 'Claim $10,000+ Allowance'}
            </h3>
            <div className="flex items-center gap-3 font-mono text-xs text-[#75695C] m-0">
              <span className="flex items-center gap-1 text-[#C8A24F]">
                <Flame className="w-3.5 h-3.5" /> {currentStreak}D Active Streak
              </span>
              <span>•</span>
              <span>Base $10,000 + $1,500/day Streak Multiplier</span>
            </div>
          </div>
        </div>

        {/* Right Claim Button */}
        <div className="relative z-10 shrink-0 w-full sm:w-auto">
          {claimedToday ? (
            /* CLAIMED STATE */
            <div className="px-8 py-3.5 bg-white/10 border border-[#C8A24F]/40 text-[#C8A24F] font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 cursor-not-allowed shadow-inner">
              <CheckCircle2 className="w-4 h-4 text-[#C8A24F]" />
              <span>Claimed for Today</span>
            </div>
          ) : (
            /* ACTIVE CLAIM BUTTON */
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C8A24F]/25 active:scale-95 disabled:opacity-50"
            >
              {claiming ? (
                <span>Authorizing Vault...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Claim Daily Allowance</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}