'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/src/lib/store';
import confetti from 'canvas-confetti';
import { Flame, Check, Sparkles, X, Gift } from 'lucide-react';

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
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

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
      <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono selection:bg-black selection:text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-black text-white border border-black shrink-0">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-lg uppercase tracking-tight text-black">
                Daily Allowance Multiplier
              </span>
              <span className="font-mono text-[10px] font-bold bg-neutral-100 text-black px-2 py-0.5 border border-black uppercase">
                {streakCount || 0}D Active
              </span>
            </div>
            <p className="text-xs text-neutral-600 uppercase">
              Claim daily capital grants to build up your streak allowance.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full md:w-auto px-6 py-3 bg-black text-white hover:bg-neutral-800 font-mono text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shrink-0 border border-black"
        >
          <Gift className="w-4 h-4" /> {claimedToday ? 'Streak Dossier' : 'Claim Daily Grant'}
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 selection:bg-black selection:text-white">
          <div className="bg-white border-2 border-black p-8 max-w-xl w-full space-y-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-black hover:bg-neutral-100 border border-transparent hover:border-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 text-center border-b-2 border-black pb-6">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                24-Hour Capital Distribution
              </span>
              <h3 className="text-3xl font-black font-serif uppercase tracking-tight">
                Daily Allowance
              </h3>
              <p className="font-mono text-xs text-neutral-600 uppercase max-w-sm mx-auto">
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
                    className={`p-2 border-2 border-black text-center flex flex-col justify-between h-24 font-mono transition-all ${
                      isCompleted
                        ? 'bg-black text-white'
                        : isCurrent
                        ? 'bg-neutral-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-neutral-400 opacity-60'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">D{item.day}</span>
                    <div className="my-auto flex justify-center">
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Sparkles className={`w-4 h-4 ${isCurrent ? 'text-black' : 'text-neutral-400'}`} />
                      )}
                    </div>
                    <span className="text-[9px] font-bold">+${item.reward}</span>
                  </div>
                );
              })}
            </div>

            {/* Claim Action */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleClaim}
                disabled={claiming || claimedToday}
                className={`w-full py-4 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                  claimedToday
                    ? 'bg-neutral-200 text-neutral-500 border-2 border-neutral-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-neutral-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5'
                }`}
              >
                {claiming
                  ? 'Processing Grant...'
                  : claimedToday
                  ? 'Claimed Today • Returns Tomorrow'
                  : `Claim Day ${currentStreakIndex + 1} Grant (+$${todayReward.toLocaleString()})`}
              </button>

              <p className="font-mono text-[10px] text-center text-neutral-500 uppercase font-bold">
                * Resets if a 24-hour cycle is missed.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}