'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  UserPlus, 
  ArrowRight, 
  User, 
  Mail, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Fingerprint, 
  X,
  Gift,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationStep {
  id: number;
  label: string;
  subtext: string;
}

const REGISTRATION_STEPS: RegistrationStep[] = [
  { id: 1, label: 'Encrypting & Registering Dossier', subtext: 'Establishing secure 256-bit member handshake...' },
  { id: 2, label: 'Provisioning High-Roller Vault Account', subtext: 'Configuring user profile, wardrobe archive & flex status...' },
  { id: 3, label: 'Crediting $10,000 Instant Grant Balance', subtext: 'Allocating initial virtual capital to your wallet...' },
  { id: 4, label: 'Registration Complete! Welcome to DopaCart®', subtext: 'Vault unlocked. Launching your VIP luxury feed...' },
];

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setCurrentStepIndex(0);
    setScanProgress(15);

    try {
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      // --- STEP 1: Encrypting Payload ---
      setCurrentStepIndex(0);
      setScanProgress(30);
      await delay(1600);

      // Execute signup API request
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // --- STEP 2: Vault Provisioning ---
        setCurrentStepIndex(1);
        setScanProgress(60);
        await delay(1800);

        // --- STEP 3: Crediting $10,000 Grant ---
        setCurrentStepIndex(2);
        setScanProgress(85);
        await delay(1600);

        // --- STEP 4: Registration Complete & Confetti ---
        setCurrentStepIndex(3);
        setScanProgress(100);
        confetti({ particleCount: 180, spread: 90, origin: { y: 0.5 } });
        await delay(1500);

        // Final Redirect
        window.location.href = '/feed';
      } else {
        await delay(800);
        setError(data.error || 'Failed to create user account. Please check your inputs.');
      }
    } catch {
      setError('Network connection error during registration.');
    }
  };

  const cancelRegistration = () => {
    setLoading(false);
    setError(null);
    setCurrentStepIndex(0);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] font-sans selection:bg-[#C8A24F] selection:text-white flex flex-col justify-between p-6 antialiased overflow-x-hidden">
      {/* Top Header Navigation */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center py-4 border-b border-[#EAE2D5]">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif font-black text-2xl tracking-tight text-[#1C1712]">
            Dopa<span className="text-[#C8A24F] italic">Cart</span>
            <span className="text-[9px] font-sans text-[#9B7A2B] align-top ml-0.5 font-bold">®</span>
          </span>
        </Link>
        <Link
          href="/login"
          className="font-mono text-xs font-bold uppercase tracking-widest text-[#1C1712] hover:text-[#C8A24F] transition-colors flex items-center gap-1"
        >
          Existing User Log In <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Registration Form */}
      <main className="my-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl border border-white/90 p-8 sm:p-12 rounded-[44px] shadow-[0_30px_70px_rgba(0,0,0,0.04)] space-y-8 relative overflow-hidden">
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-1.5 border-b border-[#EAE2D5] pb-6 relative z-10">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A24F]" /> Initial Grant: $10,000 Free Balance
            </span>
            <h1 className="text-3xl sm:text-4xl font-normal text-[#1C1712] m-0">
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSignup} className="space-y-6 relative z-10">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold uppercase tracking-wider block text-[#75695C]">
                Full Name / Alias
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-4 top-4 text-[#C8A24F]" />
                <input
                  type="text"
                  required
                  placeholder="SATO NAITO"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#EAE2D5] rounded-2xl font-mono text-xs uppercase font-bold text-[#1C1712] placeholder:text-[#75695C]/40 focus:outline-none focus:border-[#C8A24F] transition-colors shadow-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold uppercase tracking-wider block text-[#75695C]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-4 text-[#C8A24F]" />
                <input
                  type="email"
                  required
                  placeholder="USER@DOPACART.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#EAE2D5] rounded-2xl font-mono text-xs uppercase font-bold text-[#1C1712] placeholder:text-[#75695C]/40 focus:outline-none focus:border-[#C8A24F] transition-colors shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold uppercase tracking-wider block text-[#75695C]">
                Set Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-4 top-4 text-[#C8A24F]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#EAE2D5] rounded-2xl font-mono text-xs uppercase font-bold text-[#1C1712] placeholder:text-[#75695C]/40 focus:outline-none focus:border-[#C8A24F] transition-colors shadow-sm"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C8A24F]/25 active:scale-95"
              >
                <UserPlus className="w-4 h-4" /> Initialize & Claim $10,000
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="pt-4 border-t border-[#EAE2D5] text-center relative z-10">
            <p className="font-mono text-xs text-[#75695C] uppercase m-0">
              Already registered?{' '}
              <Link href="/login" className="text-[#1C1712] font-bold underline underline-offset-4 hover:text-[#C8A24F] transition-colors">
                Sign In to Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* EXTENDED FULL-SCREEN INITIALIZATION SCANNER OVERLAY */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-[#FAF7F2]/85 backdrop-blur-3xl flex flex-col items-center justify-center p-6 animate-fadeIn font-sans">
          {/* Cancel Registration Button */}
          <button
            onClick={cancelRegistration}
            className="absolute top-8 right-8 p-3 text-[#75695C] hover:text-[#1C1712] bg-white/90 rounded-full border border-[#EAE2D5] shadow-sm transition-colors"
            title="Cancel Registration"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-xl w-full text-center space-y-8">
            {/* Radar Scanner Badge */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#C8A24F]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-[#C8A24F]/40 animate-spin" style={{ animationDuration: '3s' }} />
              
              <div className="w-24 h-24 bg-[#1C1712] rounded-full flex items-center justify-center text-[#C8A24F] shadow-2xl relative z-10 border-2 border-[#C8A24F]/60">
                {error ? (
                  <AlertCircle className="w-10 h-10 text-red-400 animate-bounce" />
                ) : currentStepIndex === 3 ? (
                  <Gift className="w-10 h-10 text-[#C8A24F] animate-bounce" />
                ) : currentStepIndex === 2 ? (
                  <Wallet className="w-10 h-10 text-[#C8A24F] animate-pulse" />
                ) : (
                  <Fingerprint className="w-10 h-10 text-[#C8A24F] animate-pulse" />
                )}
              </div>
            </div>

            {/* Live Progress Meter */}
            {!error && (
              <div className="space-y-2 max-w-xs mx-auto font-mono">
                <div className="flex justify-between items-center text-xs font-bold text-[#75695C]">
                  <span>INITIALIZATION METER</span>
                  <span className="text-[#C8A24F]">{scanProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/80 rounded-full border border-[#EAE2D5] overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#C8A24F] to-[#9B7A2B] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Main Status Heading */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#9B7A2B]">
                {error ? 'REGISTRATION ERROR' : `STAGE 0${currentStepIndex + 1} OF 04`}
              </span>
              <h2 className="text-4xl sm:text-5xl font-normal text-[#1C1712] m-0">
                {error ? 'Initialization Interrupted' : REGISTRATION_STEPS[currentStepIndex].label}
              </h2>
              <p className="font-mono text-xs text-[#75695C] max-w-md mx-auto leading-relaxed m-0">
                {error ? error : REGISTRATION_STEPS[currentStepIndex].subtext}
              </p>
            </div>

            {/* Step-by-Step Progress Timeline */}
            {!error && (
              <div className="space-y-3 max-w-md mx-auto pt-2 font-mono">
                {REGISTRATION_STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className={`p-4 rounded-2xl border transition-all duration-700 flex items-center justify-between gap-4 ${
                        isDone
                          ? 'bg-[#1C1712] border-[#1C1712] text-white shadow-md'
                          : isCurrent
                          ? 'bg-white border-[#C8A24F] text-[#1C1712] shadow-xl shadow-[#C8A24F]/20 scale-105'
                          : 'bg-white/40 border-[#EAE2D5] text-[#75695C]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-[#C8A24F] text-white'
                            : isCurrent
                            ? 'bg-[#1C1712] text-[#C8A24F]'
                            : 'bg-[#EAE2D5] text-[#75695C]'
                        }`}>
                          {isDone ? '✓' : step.id}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider">{step.label}</span>
                      </div>

                      {isCurrent && (
                        <div className="w-4 h-4 border-2 border-[#C8A24F] border-t-transparent rounded-full animate-spin shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Error Retry Option */}
            {error && (
              <div className="pt-4">
                <button
                  onClick={cancelRegistration}
                  className="px-9 py-4 bg-[#1C1712] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-xl active:scale-95"
                >
                  Return to Signup & Retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center py-4 font-mono text-[10px] text-[#75695C] uppercase border-t border-[#EAE2D5]">
        © {new Date().getFullYear()} DOPACART®. ZERO REAL CASH. PURE CLOUT.
      </footer>
    </div>
  );
}