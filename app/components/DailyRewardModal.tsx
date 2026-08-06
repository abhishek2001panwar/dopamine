'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/src/lib/store';
import confetti from 'canvas-confetti';
import { Flame, Check, Sparkles, X, Gift, Calendar, Zap, ShieldCheck } from 'lucide-react';

const STREAK_DAYS = [
  { day: 1, reward: 500 },
  { day: 2, reward: 1000 },
  { day: 3, reward: 1500 },
  { day: 4, reward: 2000 },
  { day: 5, reward: 2500 },
  { day: 6, reward: 3500 },
  { day: 7, reward: 5000 },
];

export function DailyRewardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimedToday, setClaimedToday] = useState(false);

  const { fakeBalance, streakCount, lastClaimedDate, setUserData } = useAppStore();

  // Check if reward was already claimed today
  useEffect(() => {
    if (!lastClaimedDate) {
      setClaimedToday(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const lastClaim = new Date(lastClaimedDate).toISOString().split('T')[0];
    setClaimedToday(today === lastClaim);
  }, [lastClaimedDate]);

  const currentStreakIndex = Math.min((streakCount || 0) % 7, 6);
  const todayReward = STREAK_DAYS[currentStreakIndex].reward;

  const handleClaim = async () => {
    if (claiming || claimedToday) return;

    setClaiming(true);

    try {
      const res = await fetch('/api/user/allowance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: todayReward, isDailyClaim: true }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });

        const today = new Date().toISOString();
        const nextStreak = (streakCount || 0) + 1;

        setUserData({
          fakeBalance: (fakeBalance || 0) + todayReward,
          streakCount: nextStreak,
          lastClaimedDate: today,
        });

        setClaimedToday(true);
      } else {
        alert(data.error || 'Failed to claim allowance.');
      }
    } catch {
      alert('Network error claiming daily allowance.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <>
      {/* Banner Card in Page Layout */}
      <div className="bg-white/70 backdrop-blur-2xl border border-white/90 p-8 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle Gold Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A24F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 z-10">
          <div className="p-4 bg-[#1C1712] text-[#F8F3EB] rounded-2xl border border-[#EAE2D5] shrink-0 shadow-md">
            <Flame className="w-6 h-6 text-[#C8A24F] fill-[#C8A24F]" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-normal text-[#1C1712] m-0">
                Daily Allowance Multiplier
              </h3>
              <span className="font-mono text-[10px] font-bold bg-[#FAF7F2] text-[#9B7A2B] px-3 py-1 rounded-full border border-[#EAE2D5] uppercase tracking-wider">
                {streakCount || 0}D Active
              </span>
            </div>
            <p className="font-mono text-xs text-[#75695C] m-0">
              Claim daily capital grants to build up your streak allowance and rank multiplier.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full md:w-auto px-8 py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 flex items-center justify-center gap-2 shrink-0 active:scale-95 z-10"
        >
          <Gift className="w-4 h-4" /> {claimedToday ? 'Streak Dossier' : 'Claim Daily Grant'}
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1712]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-white/90 p-8 sm:p-10 max-w-xl w-full space-y-8 rounded-[44px] shadow-[0_30px_70px_rgba(0,0,0,0.2)] relative overflow-hidden animate-fadeIn">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-[#75695C] hover:text-[#1C1712] hover:bg-white/80 rounded-full transition-colors shadow-sm"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 text-center border-b border-[#EAE2D5] pb-6">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B]">
                24-Hour Capital Distribution
              </span>
              <h2 className="text-4xl font-normal text-[#1C1712] m-0">
                Daily Allowance
              </h2>
              <p className="font-mono text-xs text-[#75695C] max-w-sm mx-auto m-0">
                Log in every 24 hours to step up your daily grant tier.
              </p>
            </div>

            {/* 7-Day Streak Grid */}
            <div className="grid grid-cols-7 gap-2">
              {STREAK_DAYS.map((item, idx) => {
                const dayNumber = idx + 1;
                const isCompleted = dayNumber <= (streakCount % 7 === 0 && streakCount > 0 ? 7 : streakCount % 7);
                const isCurrent = dayNumber === currentStreakIndex + 1 && !claimedToday;

                return (
                  <div
                    key={item.day}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col justify-between h-28 font-mono transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#1C1712] text-white border-[#1C1712] shadow-sm'
                        : isCurrent
                        ? 'bg-white border-[#C8A24F] text-[#1C1712] shadow-lg shadow-[#C8A24F]/20 scale-105'
                        : 'bg-white/40 border-[#EAE2D5] text-[#75695C]/50'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">D{item.day}</span>
                    <div className="my-auto flex justify-center">
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-[#C8A24F]" />
                      ) : (
                        <Sparkles className={`w-4 h-4 ${isCurrent ? 'text-[#C8A24F] animate-pulse' : 'text-[#75695C]/40'}`} />
                      )}
                    </div>
                    <span className={`text-[9px] font-bold ${isCompleted ? 'text-white/80' : isCurrent ? 'text-[#9B7A2B]' : 'text-[#75695C]/50'}`}>
                      +${item.reward}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Claim Action */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleClaim}
                disabled={claiming || claimedToday}
                className={`w-full py-4 font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md ${
                  claimedToday
                    ? 'bg-[#EAE2D5] text-[#75695C] cursor-not-allowed border border-[#EAE2D5]'
                    : 'bg-[#C8A24F] hover:bg-[#B38C3B] text-white shadow-[#C8A24F]/25 active:scale-95'
                }`}
              >
                {claiming
                  ? 'Processing Grant...'
                  : claimedToday
                  ? 'Claimed Today • Returns Tomorrow'
                  : `Claim Day ${currentStreakIndex + 1} Grant (+$${todayReward.toLocaleString()})`}
              </button>

              <p className="font-mono text-[10px] text-center text-[#75695C] uppercase font-bold m-0 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24F]" /> Resets if a 24-hour cycle is missed.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}