'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { BadgeUnlockModal, BadgeItem } from '@/app/components/BadgeUnlockModal';
import { 
  Award, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Flame, 
  Wallet, 
  ShoppingBag, 
  Crown,
  Zap
} from 'lucide-react';

const ALL_ACHIEVEMENTS: BadgeItem[] = [
  {
    id: 'streak_3',
    title: '3-Day Login Streak',
    description: 'Logged in consistently for 3 consecutive days.',
    rewardAmount: 5000,
    category: 'STREAK',
  },
  {
    id: 'streak_7',
    title: 'High-Roller Commitment',
    description: 'Maintained a 7-day daily grant login streak.',
    rewardAmount: 15000,
    category: 'STREAK',
  },
  {
    id: 'spend_50k',
    title: 'Impulse Buyer',
    description: 'Spent over $50,000 in virtual capital.',
    rewardAmount: 10000,
    category: 'SPENDING',
  },
  {
    id: 'spend_100k',
    title: 'Centurion Clout',
    description: 'Crossed $100,000 in total vault acquisitions.',
    rewardAmount: 25000,
    category: 'SPENDING',
  },
  {
    id: 'first_order',
    title: 'First Acquisition',
    description: 'Completed your first instant checkout transaction.',
    rewardAmount: 5000,
    category: 'ACQUISITION',
  },
  {
    id: 'vault_collector',
    title: 'Vault Hoarder',
    description: 'Acquired 10 or more luxury wardrobe items.',
    rewardAmount: 20000,
    category: 'CLOUT',
  },
];

export default function BadgesPage() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [activeModalBadge, setActiveModalBadge] = useState<BadgeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUnlockedIds(data.user.unlockedBadges || ['first_order']);
          setClaimedIds(data.user.claimedBadges || []);
        }
      })
      .catch((err) => console.error('Failed to load badges telemetry:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalRewardsClaimable = ALL_ACHIEVEMENTS.filter(
    (b) => unlockedIds.includes(b.id) && !claimedIds.includes(b.id)
  ).reduce((acc, b) => acc + b.rewardAmount, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white pb-24 antialiased font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-8 space-y-12">
        {/* Header Banner */}
        <section className="bg-[#1C1712] text-[#F8F3EB] border border-[#C8A24F]/40 p-8 md:p-12 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.12)] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 border-b border-[#75695C]/30 pb-6">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#C8A24F] flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" /> Clout Room Dossier
              </span>
              <h1 className="text-3xl sm:text-5xl font-normal text-white m-0">
                Trophy & Milestone Vault
              </h1>
            </div>

            <div className="flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-md self-start sm:self-auto font-mono text-xs">
              <Sparkles className="w-4 h-4 text-[#C8A24F]" />
              <span>{unlockedIds.length} OF {ALL_ACHIEVEMENTS.length} UNLOCKED</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 pt-2 font-mono text-xs uppercase">
            <div className="space-y-1">
              <span className="text-[#75695C] block text-[10px]">Unlocked Clout Badges</span>
              <p className="text-2xl font-normal text-white m-0">{unlockedIds.length}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[#75695C] block text-[10px]">Claimable Capital</span>
              <p className="text-2xl font-normal text-[#C8A24F] m-0">${totalRewardsClaimable.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[#75695C] block text-[10px]">Vault Status</span>
              <p className="text-2xl font-normal text-white m-0">VIP High Roller</p>
            </div>
          </div>
        </section>

        {/* Badges Grid */}
        <section className="space-y-6">
          <div className="border-b border-[#EAE2D5] pb-4 flex justify-between items-center">
            <h2 className="text-2xl font-normal text-[#1C1712] m-0">
              Milestone Badges
            </h2>
            <span className="font-mono text-xs font-bold text-[#75695C] uppercase tracking-widest">
              VOL. 01 — CLOUT STANDINGS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_ACHIEVEMENTS.map((badge) => {
              const isUnlocked = unlockedIds.includes(badge.id);
              const isClaimed = claimedIds.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`bg-white/70 backdrop-blur-2xl border p-6 rounded-[32px] flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                    isUnlocked
                      ? 'border-[#C8A24F]/60 shadow-[0_20px_40px_rgba(200,162,79,0.1)]'
                      : 'border-[#EAE2D5] opacity-60 grayscale'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl ${isUnlocked ? 'bg-[#1C1712] text-[#C8A24F]' : 'bg-[#EAE2D5] text-[#75695C]'}`}>
                        <Award className="w-6 h-6" />
                      </div>

                      <span className="font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-[#FAF7F2] border border-[#EAE2D5] text-[#9B7A2B]">
                        {badge.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="space-y-1">
                      <h3 className="text-xl font-normal text-[#1C1712] m-0 flex items-center gap-1.5">
                        {badge.title}
                        {!isUnlocked && <Lock className="w-3.5 h-3.5 text-[#75695C]" />}
                      </h3>
                      <p className="text-xs text-[#75695C] leading-relaxed font-normal m-0">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-6 border-t border-[#EAE2D5] mt-6 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#9B7A2B]">
                      +${badge.rewardAmount.toLocaleString()} Grant
                    </span>

                    {isUnlocked ? (
                      isClaimed ? (
                        <span className="font-mono text-[10px] font-bold text-[#75695C] flex items-center gap-1 uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A24F]" /> Claimed
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveModalBadge(badge)}
                          className="px-4 py-2 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md active:scale-95 transition-all"
                        >
                          Claim Award
                        </button>
                      )
                    ) : (
                      <span className="font-mono text-[10px] font-bold text-[#75695C] uppercase">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Unlock Celebration Modal */}
      <BadgeUnlockModal
        badge={activeModalBadge}
        onClose={() => setActiveModalBadge(null)}
      />
    </div>
  );
}