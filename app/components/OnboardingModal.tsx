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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-purple-200 rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Clearance Protocol • Step {step} of 2
          </div>
          <h2 className="text-3xl font-black text-gray-900">
            {step === 1 ? 'Where Should We Ship Your $0 Clout?' : 'Pick Your Shopping Persona'}
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {step === 1
              ? 'Don’t worry, no physical box is coming. But our virtual delivery drones need a destination!'
              : 'Tell us how you plan on spending your unlimited virtual allowance.'}
          </p>
        </div>

        {/* Step 1: Creative Address Setup */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wider">
                Virtual Shipping HQ / Address
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-purple-600 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Penthouse 9, Cyberpunk Towers..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Funny Presets */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-gray-400 uppercase">Or Pick a Classic Location:</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_ADDRESSES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAddress(preset)}
                    className="text-xs font-semibold px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 transition-all text-left"
                  >
                    📍 {preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => (address.trim() ? setStep(2) : alert('Enter an address first!'))}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 mt-4"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Shopping Vibe & Bonus Claim */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              {SHOPPER_VIBES.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setVibe(item.name)}
                  className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                    vibe === item.name
                      ? 'border-2 border-purple-600 bg-purple-50/50 ring-2 ring-purple-100'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="pt-0.5">
                    <input
                      type="radio"
                      checked={vibe === item.name}
                      onChange={() => setVibe(item.name)}
                      className="accent-purple-600 w-4 h-4"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bonus Banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
              <span>Includes +$5,000 Fake Bucks Instant Onboarding Bonus!</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <ShieldCheck className="w-5 h-5" />
              {loading ? 'Initializing Wallet...' : 'Claim $5K Bonus & Start Shopping!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}