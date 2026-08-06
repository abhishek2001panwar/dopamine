'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  LogIn, 
  ArrowRight, 
  Lock, 
  Mail, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  Fingerprint,
  X,
  Database,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthStep {
  id: number;
  label: string;
  subtext: string;
}

const STEPS: AuthStep[] = [
  { id: 1, label: 'Decrypting Dossier Credentials', subtext: 'Opening secure 256-bit encrypted handshake protocol...' },
  { id: 2, label: 'Searching High-Roller Database', subtext: 'Querying global vault standings & user record...' },
  { id: 3, label: 'Identity Matched & Active Streak Verified', subtext: 'Found account profile! Synchronizing daily grant multiplier...' },
  { id: 4, label: 'Vault Clearance Granted! Opening Feed...', subtext: 'High-roller pass active. Welcome back to DopaCart®!' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setCurrentStepIndex(0);
    setScanProgress(10);

    try {
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      // --- STEP 1: Decrypting Credentials ---
      setCurrentStepIndex(0);
      setScanProgress(25);
      await delay(1600);

      // Execute actual login API call
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // --- STEP 2: Database Query & Identity Match ---
        setCurrentStepIndex(1);
        setScanProgress(55);
        await delay(1800);

        // --- STEP 3: Streak Verification ---
        setCurrentStepIndex(2);
        setScanProgress(85);
        await delay(1600);

        // --- STEP 4: Success, Confetti & Feed Launch ---
        setCurrentStepIndex(3);
        setScanProgress(100);
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
        await delay(1500);

        // Final Redirect
        window.location.href = '/feed';
      } else {
        await delay(800);
        setError(data.error || 'Invalid authentication credentials. Please check your details.');
      }
    } catch {
      setError('Network connection interrupted during vault clearance.');
    }
  };

  const cancelScanner = () => {
    setLoading(false);
    setError(null);
    setCurrentStepIndex(0);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] font-sans selection:bg-[#C8A24F] selection:text-white flex flex-col justify-between p-6 antialiased overflow-x-hidden">
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center py-4 border-b border-[#EAE2D5]">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif font-black text-2xl tracking-tight text-[#1C1712]">
            Dopa<span className="text-[#C8A24F] italic">Cart</span>
            <span className="text-[9px] font-sans text-[#9B7A2B] align-top ml-0.5 font-bold">®</span>
          </span>
        </Link>
        <Link
          href="/signup"
          className="font-mono text-xs font-bold uppercase tracking-widest text-[#1C1712] hover:text-[#C8A24F] transition-colors flex items-center gap-1"
        >
          Create Account <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Login Form */}
      <main className="my-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl border border-white/90 p-8 sm:p-12 rounded-[44px] shadow-[0_30px_70px_rgba(0,0,0,0.04)] space-y-8 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-1.5 border-b border-[#EAE2D5] pb-6 relative z-10">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B] flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#C8A24F]" /> Identity Verification
            </span>
            <h1 className="text-3xl sm:text-4xl font-normal text-[#1C1712] m-0">
              System Access
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
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
                Password
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
                <LogIn className="w-4 h-4" /> Authenticate & Access
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="pt-4 border-t border-[#EAE2D5] text-center relative z-10">
            <p className="font-mono text-xs text-[#75695C] uppercase m-0">
              First time here?{' '}
              <Link href="/signup" className="text-[#1C1712] font-bold underline underline-offset-4 hover:text-[#C8A24F] transition-colors">
                Register New Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* EXTENDED SLOW-MOTION FULL-SCREEN SCANNER OVERLAY */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-[#FAF7F2]/85 backdrop-blur-3xl flex flex-col items-center justify-center p-6 animate-fadeIn font-sans">
          {/* Cancel Scanner Button */}
          <button
            onClick={cancelScanner}
            className="absolute top-8 right-8 p-3 text-[#75695C] hover:text-[#1C1712] bg-white/90 rounded-full border border-[#EAE2D5] shadow-sm transition-colors"
            title="Cancel Verification"
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
                  <CheckCircle2 className="w-10 h-10 text-[#C8A24F] animate-scaleIn" />
                ) : (
                  <Fingerprint className="w-10 h-10 text-[#C8A24F] animate-pulse" />
                )}
              </div>
            </div>

            {/* Live Scan Progress Indicator */}
            {!error && (
              <div className="space-y-2 max-w-xs mx-auto font-mono">
                <div className="flex justify-between items-center text-xs font-bold text-[#75695C]">
                  <span>SCANNER PROGRESS</span>
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
                {error ? 'VERIFICATION ERROR' : `STAGE 0${currentStepIndex + 1} OF 04`}
              </span>
              <h2 className="text-4xl sm:text-5xl font-normal text-[#1C1712] m-0">
                {error ? 'Access Denied' : STEPS[currentStepIndex].label}
              </h2>
              <p className="font-mono text-xs text-[#75695C] max-w-md mx-auto leading-relaxed m-0">
                {error ? error : STEPS[currentStepIndex].subtext}
              </p>
            </div>

            {/* Step-by-Step Progress Timeline */}
            {!error && (
              <div className="space-y-3 max-w-md mx-auto pt-2 font-mono">
                {STEPS.map((step, idx) => {
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
                  onClick={cancelScanner}
                  className="px-9 py-4 bg-[#1C1712] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-xl active:scale-95"
                >
                  Return to Login & Retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center py-4 font-mono text-[10px] text-[#75695C] uppercase border-t border-[#EAE2D5]">
        © {new Date().getFullYear()} DOPACART®. ENCRYPTED AUTHENTICATION PROTOCOL.
      </footer>
    </div>
  );
}