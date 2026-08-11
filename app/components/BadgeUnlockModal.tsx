'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, X, Check, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/src/lib/store';

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  rewardAmount: number;
  unlockedAt?: string;
  category: 'STREAK' | 'SPENDING' | 'ACQUISITION' | 'CLOUT';
}

interface BadgeUnlockModalProps {
  badge: BadgeItem | null;
  onClose: () => void;
}

export function BadgeUnlockModal({ badge, onClose }: BadgeUnlockModalProps) {
  const { fakeBalance, setBalance } = useAppStore();

  if (!badge) return null;

  const handleClaimReward = async () => {
    try {
      // Trigger confetti celebration
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#C8A24F', '#9B7A2B', '#FFFFFF', '#1C1712'],
      });

      // Update balance locally
      setBalance((fakeBalance || 0) + badge.rewardAmount);

      // Claim reward API call
      await fetch('/api/user/badges/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badgeId: badge.id }),
      });

      onClose();
    } catch {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 font-sans selection:bg-[#C8A24F] selection:text-white">
        {/* Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1C1712]/60 backdrop-blur-xl"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 220 }}
          className="relative max-w-md w-full bg-[#FAF7F2] border border-white/90 p-8 sm:p-10 rounded-[44px] shadow-[0_35px_80px_rgba(0,0,0,0.25)] text-center space-y-6 overflow-hidden"
        >
          {/* Ambient Gold Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C8A24F]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-[#75695C] hover:text-[#1C1712] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Badge */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#C8A24F]/20 animate-ping" />
            <div className="w-24 h-24 bg-[#1C1712] rounded-full flex items-center justify-center text-[#C8A24F] shadow-2xl relative z-10 border-2 border-[#C8A24F]/60">
              <Award className="w-12 h-12 text-[#C8A24F]" />
            </div>
          </div>

          {/* Content Header */}
          <div className="space-y-2 relative z-10">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#9B7A2B] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A24F]" /> Milestone Reached
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1C1712] m-0">
              {badge.title}
            </h2>
            <p className="font-mono text-xs text-[#75695C] leading-relaxed max-w-xs mx-auto m-0">
              {badge.description}
            </p>
          </div>

          {/* Reward Amount Pill */}
          <div className="p-4 bg-white/80 border border-[#EAE2D5] rounded-2xl flex items-center justify-between font-mono relative z-10 shadow-sm">
            <span className="text-xs font-bold text-[#75695C] uppercase">Bonus Grant Award</span>
            <span className="text-lg font-bold text-[#9B7A2B] flex items-center gap-1">
              <Wallet className="w-4 h-4 text-[#C8A24F]" /> +${badge.rewardAmount.toLocaleString()}
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2 relative z-10">
            <button
              onClick={handleClaimReward}
              className="w-full py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C8A24F]/25 active:scale-95"
            >
              <Check className="w-4 h-4" /> Claim ${badge.rewardAmount.toLocaleString()} & Continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}