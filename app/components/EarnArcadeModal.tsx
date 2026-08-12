'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Gamepad2, 
  Trophy, 
  Sparkles, 
  CreditCard, 
  Brain, 
  Zap, 
  CheckCircle2, 
  RotateCcw,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/src/lib/store';

interface EarnArcadeModalProps {
  onClose: () => void;
}

export function EarnArcadeModal({ onClose }: EarnArcadeModalProps) {
  const [activeTab, setActiveTab] = useState<'MEMORY' | 'CIPHER' | 'TAP'>('MEMORY');
  const [claiming, setLoading] = useState(false);
  const [rewardWon, setRewardWon] = useState<number | null>(null);

  const { fakeBalance, setBalance } = useAppStore();

  // --- GAME 1: MEMORY MATCH STATE ---
  const INITIAL_CARDS = ['⌚', '🧥', '👟', '✨', '⌚', '🧥', '👟', '✨'].sort(() => Math.random() - 0.5);
  const [memoryCards, setMemoryCards] = useState<string[]>(INITIAL_CARDS);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const handleCardClick = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (memoryCards[first] === memoryCards[second]) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setFlipped([]);
        
        if (newMatched.length === memoryCards.length) {
          claimReward(1500, 'Maison Memory Match');
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  // --- GAME 2: CIPHER PUZZLE STATE ---
  const [cipherInput, setCipherInput] = useState('');
  const [cipherError, setCipherError] = useState(false);

  const handleCipherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Puzzle Question: "If Rolex = 5, Dior = 4, Porsche = 7, DopaCart = ?" -> Answer: 8
    if (cipherInput.trim() === '8') {
      claimReward(2000, 'Cipher Code Decryption');
    } else {
      setCipherError(true);
      setTimeout(() => setCipherError(false), 1500);
    }
  };

  // --- GAME 3: SPEED TAP STATE ---
  const [tapsLeft, setTapsLeft] = useState(15);
  const [timerLeft, setTimerLeft] = useState(5);
  const [tapActive, setTapActive] = useState(false);

  const startSpeedTap = () => {
    setTapsLeft(15);
    setTimerLeft(5);
    setTapActive(true);
  };

  useEffect(() => {
    if (!tapActive) return;
    if (timerLeft <= 0) {
      setTapActive(false);
      return;
    }
    const interval = setInterval(() => setTimerLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [tapActive, timerLeft]);

  const handleTap = () => {
    if (!tapActive) return;
    const nextTaps = tapsLeft - 1;
    setTapsLeft(nextTaps);

    if (nextTaps <= 0) {
      setTapActive(false);
      claimReward(1000, 'High-Roller Speed Tap');
    }
  };

  // Deposit Reward to API
  const claimReward = async (amount: number, gameTitle: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/arcade/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rewardAmount: amount, gameTitle }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setRewardWon(amount);
        setBalance(data.newBalance ?? fakeBalance + amount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1712]/75 backdrop-blur-md flex items-center justify-center p-4 font-sans selection:bg-[#C8A24F] selection:text-white">
      <div className="bg-[#FAF7F2] border border-white p-6 sm:p-8 max-w-lg w-full space-y-6 rounded-[36px] shadow-2xl relative overflow-hidden animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#75695C] hover:text-[#1C1712] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B] flex items-center justify-center gap-1">
            <Gamepad2 className="w-3.5 h-3.5 text-[#C8A24F]" /> Capital Arcade Vault
          </span>
          <h3 className="text-2xl sm:text-3xl font-normal text-[#1C1712] m-0">
            Earn Card Capital
          </h3>
          <p className="font-mono text-xs text-[#75695C] m-0">
            Solve puzzles & win mini-games to refill your Infinite Black Card!
          </p>
        </div>

        {rewardWon ? (
          /* REWARD SUCCESS SCREEN */
          <div className="bg-white border border-[#EAE2D5] p-8 rounded-3xl text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-[#1C1712] text-[#C8A24F] rounded-full flex items-center justify-center mx-auto shadow-md">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase font-bold text-[#9B7A2B]">Reward Transferred!</span>
              <h2 className="text-3xl font-normal text-[#1C1712] m-0">+${rewardWon.toLocaleString()}</h2>
              <p className="font-mono text-xs text-[#75695C]">Funds have been deposited to your Infinite Black Card.</p>
            </div>
            <button
              onClick={() => setRewardWon(null)}
              className="w-full py-3 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md"
            >
              Play Another Game
            </button>
          </div>
        ) : (
          /* GAME SELECTOR TABS */
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px] font-bold uppercase">
              <button
                onClick={() => setActiveTab('MEMORY')}
                className={`py-2 px-1 rounded-xl border transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'MEMORY' ? 'bg-[#1C1712] text-[#C8A24F] border-[#1C1712]' : 'bg-white text-[#75695C] border-[#EAE2D5]'
                }`}
              >
                <Brain className="w-3 h-3" /> Memory
              </button>
              <button
                onClick={() => setActiveTab('CIPHER')}
                className={`py-2 px-1 rounded-xl border transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'CIPHER' ? 'bg-[#1C1712] text-[#C8A24F] border-[#1C1712]' : 'bg-white text-[#75695C] border-[#EAE2D5]'
                }`}
              >
                <Sparkles className="w-3 h-3" /> Cipher
              </button>
              <button
                onClick={() => setActiveTab('TAP')}
                className={`py-2 px-1 rounded-xl border transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'TAP' ? 'bg-[#1C1712] text-[#C8A24F] border-[#1C1712]' : 'bg-white text-[#75695C] border-[#EAE2D5]'
                }`}
              >
                <Zap className="w-3 h-3" /> Speed Tap
              </button>
            </div>

            {/* TAB 1: MEMORY MATCH GAME */}
            {activeTab === 'MEMORY' && (
              <div className="bg-white border border-[#EAE2D5] p-5 rounded-3xl space-y-4 text-center">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[#75695C]">Pair all 4 Luxury Icons</span>
                  <span className="font-bold text-[#9B7A2B]">Reward: $1,500</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {memoryCards.map((card, idx) => {
                    const isFlipped = flipped.includes(idx) || matched.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleCardClick(idx)}
                        className={`h-16 text-2xl rounded-2xl border transition-all flex items-center justify-center ${
                          isFlipped ? 'bg-[#FAF7F2] border-[#C8A24F]' : 'bg-[#1C1712] text-transparent border-[#1C1712]'
                        }`}
                      >
                        {isFlipped ? card : '❓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: CIPHER PUZZLE */}
            {activeTab === 'CIPHER' && (
              <form onSubmit={handleCipherSubmit} className="bg-white border border-[#EAE2D5] p-5 rounded-3xl space-y-4 text-center">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[#75695C]">Solve Code Logic</span>
                  <span className="font-bold text-[#9B7A2B]">Reward: $2,000</span>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D5] font-mono text-xs text-[#1C1712] space-y-1 text-left">
                  <p className="m-0 font-bold text-[#C8A24F]">🔎 Vault Pattern Logic:</p>
                  <p className="m-0">• Rolex = 5</p>
                  <p className="m-0">• Dior = 4</p>
                  <p className="m-0">• Porsche = 7</p>
                  <p className="m-0 font-bold">• DopaCart = ?</p>
                </div>

                <input
                  type="text"
                  placeholder="Enter Answer Number"
                  value={cipherInput}
                  onChange={(e) => setCipherInput(e.target.value)}
                  className="w-full py-2.5 px-4 bg-[#FAF7F2] border border-[#EAE2D5] rounded-xl text-center font-mono text-base font-bold focus:outline-none focus:border-[#C8A24F]"
                />

                {cipherError && (
                  <p className="font-mono text-xs text-red-600 font-bold m-0">Incorrect code! Hint: Count the letters.</p>
                )}

                <button
                  type="submit"
                  disabled={claiming}
                  className="w-full py-3 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {claiming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Answer'}
                </button>
              </form>
            )}

            {/* TAB 3: SPEED TAP GAME */}
            {activeTab === 'TAP' && (
              <div className="bg-white border border-[#EAE2D5] p-5 rounded-3xl space-y-4 text-center">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[#75695C]">15 Taps in 5 Seconds</span>
                  <span className="font-bold text-[#9B7A2B]">Reward: $1,000</span>
                </div>

                {!tapActive ? (
                  <button
                    onClick={startSpeedTap}
                    className="w-full py-8 bg-[#1C1712] text-[#C8A24F] font-mono text-sm font-bold uppercase tracking-widest rounded-2xl border border-[#C8A24F]/40 shadow-md active:scale-95"
                  >
                    ⚡ Start Speed Challenge
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between font-mono text-xs font-bold text-[#1C1712]">
                      <span>Timer: {timerLeft}s</span>
                      <span>Taps Remaining: {tapsLeft}</span>
                    </div>

                    <button
                      onClick={handleTap}
                      className="w-full py-10 bg-[#C8A24F] active:bg-[#B38C3B] text-white font-mono text-2xl font-bold uppercase rounded-2xl shadow-lg transform active:scale-90 transition-transform"
                    >
                      🪙 TAP ME FAST!
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-[#EAE2D5] font-mono text-[10px] text-[#75695C] uppercase">
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-[#C8A24F]" /> Infinite Black Card Depositor
          </span>
          <span>Zero Real Money</span>
        </div>
      </div>
    </div>
  );
}