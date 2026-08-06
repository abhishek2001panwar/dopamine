'use client';

import { useState } from 'react';
import { X, CreditCard, ShieldCheck, MapPin, User, Lock, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  totalAmount: number;
  savedAddress?: string;
  userId?: string;
  userName?: string;
  onConfirm: (checkoutData: { address: string; cardName: string; cardNumber: string }) => void;
  onClose: () => void;
}

export function CheckoutModal({
  totalAmount,
  savedAddress,
  userName,
  onConfirm,
  onClose,
}: CheckoutModalProps) {
  const [address, setAddress] = useState(savedAddress || "Mom's Basement, Room 2B");
  const [cardName, setCardName] = useState(userName || 'HIGH ROLLER');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 9999');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onConfirm({ address, cardName, cardNumber });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1712]/60 backdrop-blur-md flex items-center justify-center p-4 font-sans selection:bg-[#C8A24F] selection:text-white">
      <div className="bg-[#FAF7F2] border border-white/90 p-8 sm:p-10 max-w-lg w-full space-y-8 rounded-[44px] shadow-[0_30px_70px_rgba(0,0,0,0.2)] relative overflow-hidden animate-fadeIn">
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#75695C] hover:text-[#1C1712] hover:bg-white/80 rounded-full transition-colors shadow-sm"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 border-b border-[#EAE2D5] pb-5">
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B]">
            <Lock className="w-3.5 h-3.5 text-[#C8A24F]" /> Express Settlement Protocol
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#1C1712] m-0">
            Checkout Authorization
          </h2>
        </div>

        {/* Financial Summary Box */}
        <div className="bg-white/80 border border-[#EAE2D5] rounded-3xl p-6 space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center font-mono text-xs uppercase font-bold text-[#75695C]">
            <span>Total Virtual Acquisition</span>
            <span className="text-[#9B7A2B] font-serif text-2xl font-normal">${totalAmount.toLocaleString()}</span>
          </div>
          <p className="font-mono text-[10px] text-[#75695C]/80 uppercase m-0">
            * Debited directly from your allocated Fake Bucks account.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Destination Address */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold uppercase tracking-wider block text-[#75695C]">
              Vault Destination Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-4 top-4 text-[#C8A24F]" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#EAE2D5] rounded-2xl font-mono text-xs uppercase font-bold text-[#1C1712] placeholder:text-[#75695C]/50 focus:outline-none focus:border-[#C8A24F] transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold uppercase tracking-wider block text-[#75695C]">
              Account Holder Alias
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-4 top-4 text-[#C8A24F]" />
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#EAE2D5] rounded-2xl font-mono text-xs uppercase font-bold text-[#1C1712] placeholder:text-[#75695C]/50 focus:outline-none focus:border-[#C8A24F] transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Fake Card Number */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold uppercase tracking-wider block text-[#75695C]">
              Virtual Black Card Identifier
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 absolute left-4 top-4 text-[#C8A24F]" />
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#EAE2D5] rounded-2xl font-mono text-xs uppercase font-bold text-[#1C1712] placeholder:text-[#75695C]/50 focus:outline-none focus:border-[#C8A24F] transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Authorization Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C8A24F]/25 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Authorizing Transaction...' : `Confirm & Pay $${totalAmount.toLocaleString()}`}
            </button>
          </div>
        </form>

        {/* Footer Guarantee */}
        <div className="text-center pt-2 border-t border-[#EAE2D5]">
          <p className="font-mono text-[10px] text-[#75695C] uppercase font-bold m-0 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C8A24F]" /> 100% Risk-Free Virtual Simulator • Zero Credit Cards Charged
          </p>
        </div>
      </div>
    </div>
  );
}