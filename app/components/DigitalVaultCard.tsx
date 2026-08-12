'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Wifi, 
  Lock, 
  CheckCircle2, 
  Mail, 
  KeyRound, 
  X, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '@/src/lib/store';

interface DigitalVaultCardProps {
  userName: string;
  email: string;
}

// Seeded generator to build unique 16-digit number, EXP, and CVV for each user email
const generateUniqueCardDetails = (seedEmail: string) => {
  if (!seedEmail) {
    return {
      number: '4890 1234 5678 9999',
      exp: '12/28',
      cvv: '888',
    };
  }

  let hash = 0;
  for (let i = 0; i < seedEmail.length; i++) {
    hash = seedEmail.charCodeAt(i) + ((hash << 5) - hash);
  }

  const positiveHash = Math.abs(hash);
  
  const p1 = String((positiveHash % 8999) + 1000);
  const p2 = String(((positiveHash * 7) % 8999) + 1000);
  const p3 = String(((positiveHash * 13) % 8999) + 1000);
  const p4 = String(((positiveHash * 23) % 8999) + 1000);

  const month = String((positiveHash % 12) + 1).padStart(2, '0');
  const year = String((positiveHash % 5) + 26); // EXP between 26-30
  const cvv = String((positiveHash % 899) + 100);

  return {
    number: `4890 ${p2} ${p3} ${p4}`,
    exp: `${month}/${year}`,
    cvv,
  };
};

export function DigitalVaultCard({ userName, email }: DigitalVaultCardProps) {
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const { fakeBalance } = useAppStore();

  const cardDetails = generateUniqueCardDetails(email);

  // Trigger Email OTP transmission
  const handleRequestOtp = async () => {
    setSendingOtp(true);
    setStatusNotice(null);

    try {
      const res = await fetch('/api/user/card/send-otp', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setShowOtpModal(true);
      } else {
        alert(data.error || 'Failed to send OTP email.');
      }
    } catch (err) {
      alert('Network error sending verification code.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify entered OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim() || verifyingOtp) return;

    setVerifyingOtp(true);
    setStatusNotice(null);

    try {
      const res = await fetch('/api/user/card/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ otp: otpInput }),
      });

      const data = await res.json();

      if (res.ok && data.authorized) {
        setIsDecrypted(true);
        setShowOtpModal(false);
        setOtpInput('');
      } else {
        setStatusNotice(data.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setStatusNotice('Failed to process authorization.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-sans selection:bg-[#C8A24F] selection:text-white">
      
      {/* 3D Glass Luxury Black & Gold Card */}
      <div className="relative group">
        <div className="w-full min-h-[220px] sm:h-72 rounded-[28px] sm:rounded-[40px] bg-gradient-to-tr from-[#0F0D0B] via-[#1C1712] to-[#2B231B] border border-[#C8A24F]/50 p-5 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_rgba(200,162,79,0.2)]">
          
          {/* Ambient Metallic Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A24F]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-[#9B7A2B]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top Row */}
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-3">
              {/* Metallic Golden EMV Chip */}
              <div className="w-10 h-8 sm:w-13 sm:h-10 bg-gradient-to-br from-[#EAE2D5] via-[#C8A24F] to-[#9B7A2B] rounded-lg border border-[#FAF7F2]/60 shadow-md relative overflow-hidden flex items-center justify-center">
                <div className="w-full h-[1px] bg-[#1C1712]/40 absolute top-3" />
                <div className="w-[1px] h-full bg-[#1C1712]/40 absolute left-4" />
              </div>
              <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A24F]/80 rotate-90" />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-[#C8A24F] bg-[#C8A24F]/10 px-2.5 py-1 rounded-full border border-[#C8A24F]/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 2FA Vault Protected
              </span>
            </div>
          </div>

          {/* Card Center: Capital Balance */}
          <div className="z-10 space-y-0.5 sm:space-y-1 my-3 sm:my-auto">
            <span className="font-mono text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#75695C] block">
              Available Capital Balance
            </span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl sm:text-5xl font-normal text-white font-serif-luxury tracking-tight m-0">
                ${(fakeBalance || 0).toLocaleString()}
              </h2>
              <span className="font-mono text-[9px] sm:text-[10px] text-[#C8A24F] font-bold uppercase">
                DOPA
              </span>
            </div>
          </div>

          {/* Card Bottom Row: Card Details & Decrypt Button */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-0 z-10 pt-2 border-t border-[#C8A24F]/20">
            <div className="space-y-1">
              <p className="font-mono text-[8px] sm:text-[9px] font-bold uppercase text-[#75695C] m-0">
                {userName || 'VERIFIED COLLECTOR'}
              </p>
              
              {/* Card Number */}
              <p className="font-mono text-xs sm:text-base text-white font-bold tracking-widest m-0">
                {isDecrypted ? cardDetails.number : '•••• •••• •••• ' + cardDetails.number.slice(-4)}
              </p>

              {/* Expiration Date & CVV */}
              <div className="flex items-center gap-4 font-mono text-[10px] sm:text-xs text-[#C8A24F] pt-0.5">
                <span>EXP: <strong className="text-white">{isDecrypted ? cardDetails.exp : '••/••'}</strong></span>
                <span>CVV: <strong className="text-white">{isDecrypted ? cardDetails.cvv : '•••'}</strong></span>
              </div>
            </div>

            {/* OTP Decrypt Action Button */}
            <button
              onClick={isDecrypted ? () => setIsDecrypted(false) : handleRequestOtp}
              disabled={sendingOtp}
              className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 bg-white/10 hover:bg-white/20 border border-[#C8A24F]/40 text-[#C8A24F] rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs font-bold uppercase shrink-0 disabled:opacity-50"
            >
              {sendingOtp ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Transmitting OTP...</span>
                </>
              ) : isDecrypted ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> <span>Lock Vault View</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> <span>Decrypt Access (2FA OTP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Email OTP Security Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1712]/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-white/90 p-6 sm:p-8 max-w-sm w-full space-y-6 rounded-[32px] shadow-2xl relative text-center animate-fadeIn">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 p-2 text-[#75695C] hover:text-[#1C1712] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-[#1C1712] text-[#C8A24F] rounded-full flex items-center justify-center mx-auto shadow-md">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-normal text-[#1C1712] m-0">Verify Identity</h3>
              <p className="font-mono text-xs text-[#75695C] m-0">
                A 6-digit authorization code was dispatched to <strong className="text-[#1C1712]">{email}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-Digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full py-3 px-4 bg-white border border-[#EAE2D5] rounded-2xl text-center font-mono text-xl font-bold tracking-[0.3em] text-[#1C1712] focus:outline-none focus:border-[#C8A24F]"
                autoFocus
              />

              {statusNotice && (
                <p className="font-mono text-xs font-bold text-red-600 m-0">{statusNotice}</p>
              )}

              <button
                type="submit"
                disabled={verifyingOtp || otpInput.length < 6}
                className="w-full py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {verifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Decrypt Card Details</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}