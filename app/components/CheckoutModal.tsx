'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Loader2, 
  KeyRound,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/src/lib/store';

interface CheckoutModalProps {
  totalAmount: number;
  savedAddress?: string;
  userId?: string;
  userName?: string;
  onConfirm: (checkoutData: { address: string; cardName: string; cardNumber: string; otp: string }) => Promise<void>;
  onClose: () => void;
}

// Deterministic generator to get the unique 16-digit number, EXP, and CVV matching DigitalVaultCard
const getCardDetailsForEmail = (email: string) => {
  if (!email) {
    return {
      number: '4890 8920 4410 9999',
      exp: '12/28',
      cvv: '888',
    };
  }

  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }

  const positiveHash = Math.abs(hash);

  const p2 = String(((positiveHash * 7) % 8999) + 1000);
  const p3 = String(((positiveHash * 13) % 8999) + 1000);
  const p4 = String(((positiveHash * 23) % 8999) + 1000);

  const month = String((positiveHash % 12) + 1).padStart(2, '0');
  const year = String((positiveHash % 5) + 26); // Years 26-30
  const cvv = String((positiveHash % 899) + 100);

  return {
    number: `4890 ${p2} ${p3} ${p4}`,
    exp: `${month}/${year}`,
    cvv,
  };
};

export function CheckoutModal({ totalAmount, onConfirm, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<'CARD_FORM' | 'OTP_VERIFICATION'>('CARD_FORM');
  const [address, setAddress] = useState("Mom's Basement, Room 2B");
  const [expDateInput, setExpDateInput] = useState('');
  const [cvvInput, setCvvInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { fakeBalance } = useAppStore();

  useEffect(() => {
    fetch('/api/user/profile', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUserEmail(data.user.email || '');
          setUserName(data.user.name || 'High Roller');
        }
      })
      .catch((e) => console.error('Failed to load profile:', e));
  }, []);

  // Retrieve matching card credentials
  const actualCard = getCardDetailsForEmail(userEmail);

  // Validate EXP and CVV local inputs against user card profile
  const handleProceedToOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanExpInput = expDateInput.trim();
    const cleanCvvInput = cvvInput.trim();

    // 1. Check empty inputs
    if (!cleanExpInput || !cleanCvvInput) {
      setErrorMessage('Please enter both Expiration Date (MM/YY) and CVV.');
      return;
    }

    // 2. Strict EXP & CVV matching check
    if (cleanExpInput !== actualCard.exp || cleanCvvInput !== actualCard.cvv) {
      setErrorMessage(
        `Invalid Security Credentials! EXP (${cleanExpInput || 'empty'}) or CVV (${cleanCvvInput || 'empty'}) does not match your assigned Infinite Black Card.`
      );
      return;
    }

    // 3. Fund Check
    if (totalAmount > fakeBalance) {
      setErrorMessage('Insufficient card capital balance available on your account.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: totalAmount }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep('OTP_VERIFICATION');
      } else {
        setErrorMessage(data.error || 'Failed to dispatch payment authorization OTP.');
      }
    } catch (err) {
      setErrorMessage('Network error sending payment authorization code.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Final OTP & Confirm Order
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpInput.trim().replace(/\s+/g, '');

    if (cleanOtp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await onConfirm({
        address,
        cardName: userName,
        cardNumber: actualCard.number,
        otp: cleanOtp,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1712]/70 backdrop-blur-md flex items-center justify-center p-4 font-sans selection:bg-[#C8A24F] selection:text-white">
      <div className="bg-[#FAF7F2] border border-white/90 p-6 sm:p-8 max-w-md w-full space-y-6 rounded-[36px] shadow-2xl relative overflow-hidden animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#75695C] hover:text-[#1C1712] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B] flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5" /> 2FA Vault Settlement
          </span>
          <h3 className="text-2xl sm:text-3xl font-normal text-[#1C1712] m-0">
            {step === 'CARD_FORM' ? 'Authorize Payment' : 'Confirm Security OTP'}
          </h3>
        </div>

        {step === 'CARD_FORM' ? (
          /* STEP 1: PRE-FILLED CARD & VALIDATED EXP/CVV INPUT */
          <form onSubmit={handleProceedToOtp} className="space-y-4">
            
            {/* Delivery Address */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] font-bold uppercase text-[#75695C] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C8A24F]" /> Vault Delivery Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-[#EAE2D5] rounded-xl font-mono text-xs text-[#1C1712] focus:outline-none focus:border-[#C8A24F]"
              />
            </div>

            {/* Infinite Black Card Payment Display */}
            <div className="bg-gradient-to-tr from-[#0F0D0B] via-[#1C1712] to-[#2B231B] text-white p-4 rounded-2xl border border-[#C8A24F]/50 shadow-md space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="font-serif-luxury text-xs text-[#C8A24F] font-bold">Infinite Black Card</span>
                <span className="font-mono text-[9px] bg-[#C8A24F]/20 text-[#C8A24F] px-2 py-0.5 rounded-full border border-[#C8A24F]/30">MATCHED</span>
              </div>

              <div className="space-y-0.5">
                <p className="font-mono text-[9px] uppercase text-[#75695C] m-0">{userName}</p>
                {/* PRE-FILLED 16-DIGIT CARD NUMBER */}
                <p className="font-mono text-base font-bold tracking-widest text-white m-0">
                  {actualCard.number}
                </p>
              </div>

              {/* USER INPUTS EXP & CVV */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div>
                  <label className="font-mono text-[9px] uppercase text-[#C8A24F] block">Exp Date (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={expDateInput}
                    onChange={(e) => setExpDateInput(e.target.value)}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 font-mono text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8A24F]"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] uppercase text-[#C8A24F] block">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={3}
                    value={cvvInput}
                    onChange={(e) => setCvvInput(e.target.value)}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 font-mono text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8A24F]"
                  />
                </div>
              </div>
            </div>

            {/* Total Required */}
            <div className="flex justify-between items-center font-mono text-xs border-t border-[#EAE2D5] pt-3">
              <span className="text-[#75695C] uppercase font-bold">Total Capital Required:</span>
              <span className="text-xl font-bold text-[#9B7A2B]">${totalAmount.toLocaleString()}</span>
            </div>

            {/* Validation Error Banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-600 font-mono text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="m-0 font-semibold">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating Credentials...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Validate & Send Payment OTP</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: 6-DIGIT PAYMENT AUTHORIZATION OTP */
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="w-12 h-12 bg-[#1C1712] text-[#C8A24F] rounded-full flex items-center justify-center mx-auto shadow-md">
              <Mail className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <p className="font-mono text-xs text-[#75695C] m-0">
                A 6-digit authorization code was dispatched to <strong className="text-[#1C1712]">{userEmail}</strong>.
              </p>
            </div>

            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-Digit OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full py-3 px-4 bg-white border border-[#EAE2D5] rounded-2xl text-center font-mono text-2xl font-bold tracking-[0.3em] text-[#1C1712] focus:outline-none focus:border-[#C8A24F]"
              autoFocus
            />

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-600 font-mono text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="m-0 font-semibold">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otpInput.length < 6}
              className="w-full py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Settling Transaction...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Confirm Order (${totalAmount.toLocaleString()})</span>
                </>
              )}
            </button>
          </form>
        )}

        <p className="font-mono text-[10px] text-center text-[#75695C] uppercase m-0 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24F]" /> Protected 2FA Vault Settlement Protocol
        </p>
      </div>
    </div>
  );
}