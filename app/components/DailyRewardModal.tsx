'use client';

import { useEffect, useState } from 'react';
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

        // Lock claim state locally
        localStorage.setItem('dopacart_daily_claimed_date', todayStr);
        setClaimedToday(true);

        // Real-time Store Updates
        if (data.newBalance !== undefined) setBalance(data.newBalance);
        if (data.streakCount !== undefined) {
          setUserData({ streakCount: data.streakCount });
          setCurrentStreak(data.streakCount);
        }

        // Victory Confetti Burst
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#C8A24F', '#9B7A2B', '#FFFFFF', '#1C1712'],
        });
      } else {
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
    <div className="w-full max-w-4xl mx-auto font-sans selection:bg-[#C8A24F] selection:text-white px-1 sm:px-0">
      <div className="bg-[#1C1712] text-[#F8F3EB] border border-[#C8A24F]/40 p-3.5 xs:p-5 sm:p-7 md:p-8 rounded-[22px] xs:rounded-[28px] sm:rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute top-0 right-0 w-36 sm:w-64 h-36 sm:h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Info Hub */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 xs:gap-3.5 sm:gap-4 relative z-10 w-full sm:w-auto">
          <div className="p-2.5 xs:p-3 sm:p-3.5 bg-[#C8A24F] text-white rounded-xl sm:rounded-2xl shadow-lg shadow-[#C8A24F]/20 shrink-0">
            <Gift className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
          </div>

          <div className="space-y-0.5 sm:space-y-1 w-full min-w-0">
            <span className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#C8A24F] flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> Daily Grant & Streak Bonus
            </span>

            <h3 className="text-base xs:text-lg sm:text-2xl font-normal text-white m-0 tracking-tight leading-snug">
              {claimedToday ? 'Daily Allowance Claimed' : 'Claim $10,000+ Allowance'}
            </h3>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-3 font-mono text-[9px] xs:text-[10px] sm:text-xs text-[#75695C] m-0 pt-0.5">
              <span className="flex items-center gap-1 text-[#C8A24F] font-semibold">
                <Flame className="w-3 h-3 shrink-0" /> {currentStreak}D Active Streak
              </span>
              <span className="hidden sm:inline text-[#75695C]/60">•</span>
              <span className="text-[8px] xs:text-[9px] sm:text-xs block w-full sm:w-auto">
                Base $10,000 + $1,500/day
              </span>
            </div>
          </div>
        </div>

        {/* Claim Button Container */}
        <div className="relative z-10 shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
          {claimedToday ? (
            /* CLAIMED STATE */
            <div className="w-full sm:w-auto px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-3.5 bg-white/10 border border-[#C8A24F]/40 text-[#C8A24F] font-mono text-[10px] xs:text-xs font-bold uppercase tracking-wider sm:tracking-widest rounded-full flex items-center justify-center gap-1.5 sm:gap-2 cursor-not-allowed shadow-inner">
              <CheckCircle2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-[#C8A24F] shrink-0" />
              <span className="whitespace-nowrap">Claimed for Today</span>
            </div>
          ) : (
            /* ACTIVE CLAIM BUTTON */
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="w-full sm:w-auto px-5 xs:px-7 sm:px-8 py-3 sm:py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-[10px] xs:text-xs font-bold uppercase tracking-wider sm:tracking-widest rounded-full flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-lg shadow-[#C8A24F]/25 active:scale-95 disabled:opacity-50"
            >
              {claiming ? (
                <span className="whitespace-nowrap">Authorizing Vault...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
                  <span className="whitespace-nowrap">Claim Daily Allowance</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}