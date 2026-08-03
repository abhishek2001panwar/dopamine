'use client';

import { useState } from 'react';
import { X, CreditCard, ShieldCheck, MapPin, User, ArrowUpRight, Lock } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 selection:bg-black selection:text-white">
      <div className="bg-white border-2 border-black p-8 max-w-lg w-full space-y-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-black hover:bg-neutral-100 border border-transparent hover:border-black transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b-2 border-black pb-6">
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            <Lock className="w-3 h-3 text-black" /> Express Settlement Protocol
          </div>
          <h2 className="text-3xl font-black font-serif uppercase tracking-tight">Checkout Authorization</h2>
        </div>

        {/* Financial Summary Box */}
        <div className="bg-neutral-100 border-2 border-black p-5 space-y-2 font-mono">
          <div className="flex justify-between items-center text-xs uppercase font-bold text-neutral-600">
            <span>Total Virtual Acquisition</span>
            <span className="text-black font-black text-base">${totalAmount.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-neutral-500 uppercase">
            * Debited directly from your allocated Fake Bucks account.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination Address */}
          <div className="space-y-2">
            <label className="font-mono text-xs font-bold uppercase tracking-wider block text-neutral-700">
              Vault Destination Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black font-mono text-xs uppercase font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-0 focus:bg-neutral-50 transition-colors"
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <label className="font-mono text-xs font-bold uppercase tracking-wider block text-neutral-700">
              Account Holder Alias
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black font-mono text-xs uppercase font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-0 focus:bg-neutral-50 transition-colors"
              />
            </div>
          </div>

          {/* Fake Card Number */}
          <div className="space-y-2">
            <label className="font-mono text-xs font-bold uppercase tracking-wider block text-neutral-700">
              Virtual Black Card Identifier
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black font-mono text-xs uppercase font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-0 focus:bg-neutral-50 transition-colors"
              />
            </div>
          </div>

          {/* Authorization Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors active:translate-y-0.5 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <ShieldCheck className="w-4 h-4" />
            {loading ? 'Authorizing Transaction...' : `Confirm & Pay $${totalAmount.toLocaleString()}`}
          </button>
        </form>

        {/* Footer Guarantee */}
        <div className="text-center pt-2 border-t border-neutral-200">
          <p className="font-mono text-[10px] text-neutral-400 uppercase font-bold">
            100% Risk-Free Virtual Simulator • Zero Credit Cards Charged
          </p>
        </div>
      </div>
    </div>
  );
}