'use client';

import { useEffect } from 'react';
import { useAppStore } from '../../src/lib/store';
import { Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function BadgeUnlockToast() {
  const { activeNotificationBadge, clearBadgeNotification } = useAppStore();

  useEffect(() => {
    if (activeNotificationBadge) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.2 },
      });

      const timer = setTimeout(() => {
        clearBadgeNotification();
      }, 6000); // Auto dismiss after 6 seconds

      return () => clearTimeout(timer);
    }
  }, [activeNotificationBadge, clearBadgeNotification]);

  if (!activeNotificationBadge) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-bounce transition-all">
      <div className="bg-gradient-to-r from-purple-900 via-pink-900 to-black border-2 border-yellow-400 p-5 rounded-2xl shadow-2xl text-white max-w-sm flex items-start gap-4 relative">
        <button
          onClick={clearBadgeNotification}
          className="absolute top-2 right-2 text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-4xl p-2 bg-black/40 rounded-xl border border-yellow-400/50">
          {activeNotificationBadge.icon}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Milestone Unlocked!
          </div>
          <h4 className="font-extrabold text-lg leading-tight">{activeNotificationBadge.name}</h4>
          <p className="text-xs text-zinc-300">{activeNotificationBadge.description}</p>
          <div className="text-xs font-bold text-green-400 pt-1">
            +${activeNotificationBadge.rewardFakeBucks.toLocaleString()} Bonus Fake Bucks!
          </div>
        </div>
      </div>
    </div>
  );
}