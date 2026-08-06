'use client';

import { useState } from 'react';
import { useAppStore } from '@/src/lib/store';
import confetti from 'canvas-confetti';
import { Sparkles, MapPin, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

const PRESET_ADDRESSES = [
  "Mom's Basement, Room 2B (Knock 3 times)",
  "Penthouse in Neo-Tokyo (Floor 104)",
  "Bench Outside Apple Store (Waiting for Drops)",
  "A Floating Digital Cloud (Zero Dust)",
  "My Gaming Chair, Suburbia, Earth",
];

const SHOPPER_VIBES = [
  { id: 'impulse', name: '⚡ 3 AM Impulse Buyer', desc: 'Adds items to bag before thinking.' },
  { id: 'hoarder', name: '💎 Digital Vault Hoarder', desc: 'Buys everything, wears nothing.' },
  { id: 'flexer', name: '👑 Maximum Clout Flexer', desc: 'Only buys items over $50,000.' },
  { id: 'saver', name: '🤑 Fake Buck Billionaire', desc: 'Spins the wheel daily and never leaves.' },
];

export function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [vibe, setVibe] = useState(SHOPPER_VIBES[0].name);
  const [loading, setLoading] = useState(false);

  // Destructure store actions in a single clean declaration
  const { setBalance, setOnboarded } = useAppStore();

  async function handleSubmit() {
    if (!address.trim()) {
      alert('Please enter or pick a delivery location!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryAddress: address,
          shoppingVibe: vibe,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
        setBalance(data.fakeBalance);
        setOnboarded(true); // Save onboarded status locally so it NEVER pops up again!
        onComplete();
      } else {
        alert(data.error || 'Onboarding failed');
      }
    } catch {
      alert('Network error during onboarding setup.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1712]/60 backdrop-blur-md flex items-center justify-center p-4 font-sans selection:bg-[#C8A24F] selection:text-white">
      <div className="bg-[#FAF7F2] border border-white/90 rounded-[44px] max-w-lg w-full p-8 sm:p-10 space-y-6 shadow-[0_30px_70px_rgba(0,0,0,0.2)] relative overflow-hidden animate-fadeIn">
        {/* Ambient Background Gold Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/80 border border-[#EAE2D5] text-[#9B7A2B] rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A24F]" />
            Clearance Protocol • Step {step} of 2
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#1C1712] m-0">
            {step === 1 ? 'Where Should We Ship Your $0 Clout?' : 'Pick Your Shopping Persona'}
          </h2>
          <p className="font-mono text-xs text-[#75695C] max-w-sm mx-auto m-0">
            {step === 1
              ? 'Don’t worry, no physical box is coming. But our virtual delivery drones need a destination!'
              : 'Tell us how you plan on spending your unlimited virtual allowance.'}
          </p>
        </div>

        {/* Step 1: Creative Address Setup */}
        {step === 1 && (
          <div className="space-y-5 relative z-10">
            <div>
              <label className="block font-mono text-xs font-bold text-[#75695C] mb-2 uppercase tracking-widest">
                Virtual Shipping HQ / Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#C8A24F] absolute left-4 top-4" />
                <input
                  type="text"
                  placeholder="e.g. Penthouse 9, Cyberpunk Towers..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#EAE2D5] rounded-2xl font-mono text-xs uppercase font-bold text-[#1C1712] placeholder:text-[#75695C]/50 focus:outline-none focus:border-[#C8A24F] transition-colors shadow-sm"
                />
              </div>
            </div>

            {/* Funny Presets */}
            <div className="space-y-2">
              <p className="font-mono text-[10px] font-bold text-[#9B7A2B] uppercase tracking-widest m-0">
                Or Pick a Classic Location:
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_ADDRESSES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAddress(preset)}
                    className="font-mono text-xs font-semibold px-3.5 py-1.5 bg-white/80 hover:bg-white text-[#1C1712] rounded-full border border-[#EAE2D5] hover:border-[#C8A24F] transition-all text-left shadow-sm"
                  >
                    📍 {preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => (address.trim() ? setStep(2) : alert('Enter an address first!'))}
              className="w-full py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#C8A24F]/25 transition-all active:scale-95 mt-4"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Shopping Vibe & Bonus Claim */}
        {step === 2 && (
          <div className="space-y-5 relative z-10">
            <div className="space-y-2.5">
              {SHOPPER_VIBES.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setVibe(item.name)}
                  className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                    vibe === item.name
                      ? 'border-[#C8A24F] bg-white shadow-md shadow-[#C8A24F]/10 ring-1 ring-[#C8A24F]'
                      : 'border-[#EAE2D5] hover:border-[#C8A24F]/50 bg-white/60'
                  }`}
                >
                  <div className="pt-0.5">
                    <input
                      type="radio"
                      checked={vibe === item.name}
                      onChange={() => setVibe(item.name)}
                      className="accent-[#C8A24F] w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-normal text-[#1C1712] m-0">{item.name}</h4>
                    <p className="font-mono text-xs text-[#75695C] mt-0.5 m-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bonus Banner */}
            <div className="p-3.5 bg-white/80 border border-[#C8A24F] rounded-2xl text-[#1C1712] font-mono text-xs font-bold flex items-center gap-2 shadow-sm">
              <Zap className="w-4 h-4 text-[#C8A24F] fill-[#C8A24F] shrink-0" />
              <span>Includes +$5,000 Fake Bucks Instant Onboarding Bonus!</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#C8A24F]/25 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Initializing Wallet...' : 'Claim $5K Bonus & Start Shopping!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}