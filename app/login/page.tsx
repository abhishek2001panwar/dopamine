'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, ArrowUpRight, Lock, Mail, Key } from 'lucide-react';
import { useAppStore } from '@/src/lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = '/feed';
      } else {
        setError(data.error || 'Invalid authentication credentials.');
      }
    } catch {
      setError('Network error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-black font-sans selection:bg-black selection:text-white flex flex-col justify-between p-6">
      {/* Top Header Navigation */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center py-4 border-b-2 border-black">
        <Link href="/" className="font-black text-2xl tracking-tighter uppercase font-serif">
          DOPACART<span className="text-xs font-sans font-normal align-top ml-1">®</span>
        </Link>
        <Link
          href="/signup"
          className="font-mono text-xs font-bold uppercase tracking-widest hover:underline underline-offset-4"
        >
          Create Account <ArrowUpRight className="w-3.5 h-3.5 inline ml-0.5" />
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="my-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border-2 border-black p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
          <div className="space-y-2 border-b-2 border-black pb-6">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Identity Verification
            </span>
            <h1 className="text-3xl font-black font-serif uppercase tracking-tight">System Login</h1>
          </div>

          {error && (
            <div className="p-4 bg-black text-white font-mono text-xs uppercase font-bold border-2 border-black">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-bold uppercase tracking-wider block text-neutral-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="USER@DOPACART.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black font-mono text-xs uppercase font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-0 focus:bg-neutral-50 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-bold uppercase tracking-wider block text-neutral-700">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black font-mono text-xs uppercase font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-0 focus:bg-neutral-50 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors active:translate-y-0.5"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Authenticate & Access'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-4 border-t border-neutral-200 text-center">
            <p className="font-mono text-xs text-neutral-500 uppercase">
              First time here?{' '}
              <Link href="/signup" className="text-black font-bold underline underline-offset-4 hover:bg-black hover:text-white px-1 py-0.5 transition-colors">
                Register New Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center py-4 font-mono text-[10px] text-neutral-400 uppercase border-t border-neutral-200">
        © {new Date().getFullYear()} DOPACART. ENCRYPTED AUTHENTICATION PROTOCOL.
      </footer>
    </div>
  );
}