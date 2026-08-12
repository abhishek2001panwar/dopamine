'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/src/lib/store';
import { CheckoutModal } from './CheckoutModal';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  CreditCard, 
  ShieldCheck, 
  Sparkles,
  Wifi,
  Lock
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, clearCart, fakeBalance, setBalance } = useAppStore();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const currentCart = Array.isArray(cart) ? cart : [];
  
  // Calculate total price
  const total = currentCart.reduce((acc, i) => acc + (Number(i.price) || 0), 0);

const handleCheckoutConfirm = async (checkoutData: { address: string; cardName: string; cardNumber: string; otp: string }) => {
  if (total > fakeBalance) {
    alert('Insufficient virtual funds available on your Infinite Black Card.');
    return;
  }

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        items: currentCart,
        totalAmount: total,
        deliveryAddress: checkoutData.address,
        paymentCard: `${checkoutData.cardName || 'DopaCart Infinite Black Card'} (${checkoutData.cardNumber || '•••• 4890'})`,
        otp: checkoutData.otp, // 👈 PASS THE 6-DIGIT OTP HERE!
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      setBalance(data.newBalance ?? fakeBalance - total);
      clearCart();
      setShowCheckoutModal(false);
      setPurchased(true);
    } else {
      alert(`Checkout Failed: ${data.error || 'Unknown error'}`);
    }
  } catch {
    alert('Network error during transaction processing.');
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans selection:bg-[#C8A24F] selection:text-white">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1C1712]/50 backdrop-blur-md"
          />

          {/* Slide-over Panel Container */}
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#FAF7F2] border-l border-white/80 shadow-2xl flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle Ambient Gold Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-[#EAE2D5] flex items-center justify-between relative z-10 bg-white/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1C1712] text-white rounded-full">
                    <ShoppingBag className="w-5 h-5 text-[#C8A24F]" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-normal text-[#1C1712] m-0">Quick Bag</h2>
                    <span className="font-mono text-[10px] text-[#9B7A2B] font-bold uppercase tracking-widest">
                      {currentCart.length} {currentCart.length === 1 ? 'ITEM' : 'ITEMS'} RESERVED
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 text-[#75695C] hover:text-[#1C1712] hover:bg-white rounded-full transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body - Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative z-10">
                {purchased ? (
                  /* Order Confirmation State */
                  <div className="py-12 text-center space-y-5 bg-white/70 backdrop-blur-2xl border border-white rounded-[32px] p-8 shadow-sm">
                    <div className="w-16 h-16 bg-[#1C1712] text-[#C8A24F] rounded-full flex items-center justify-center mx-auto shadow-md">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-normal text-[#1C1712] m-0">Acquisition Complete</h3>
                      <p className="font-mono text-xs text-[#75695C] uppercase tracking-widest m-0">
                        Items cleared & shipped to your vault.
                      </p>
                    </div>
                    <button
                      onClick={() => setPurchased(false)}
                      className="px-6 py-3 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md active:scale-95"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : currentCart.length > 0 ? (
                  currentCart.map((item, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      key={item._id || idx}
                      className="bg-white/80 backdrop-blur-2xl border border-[#EAE2D5] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F8F3EB] rounded-xl border border-[#EAE2D5] overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="space-y-0.5 truncate">
                          <h4 className="text-base sm:text-lg font-normal text-[#1C1712] truncate m-0">
                            {item.title}
                          </h4>
                          <p className="font-mono text-xs font-bold text-[#9B7A2B] m-0">
                            ${item.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 sm:p-2.5 text-[#75695C] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  /* Empty State */
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto border border-[#EAE2D5] text-[#9B7A2B]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-normal text-[#1C1712] m-0">Bag is Empty</h3>
                      <p className="font-mono text-xs text-[#75695C] uppercase tracking-widest m-0">
                        Select items from the catalog feed to populate your bag.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer / Quick Checkout Settlement */}
              {currentCart.length > 0 && !purchased && (
                <div className="p-5 sm:p-6 bg-white/80 backdrop-blur-2xl border-t border-[#EAE2D5] space-y-4 relative z-10 shadow-lg">
                  
                  {/* --- PRIMARY PAYMENT METHOD: DIGITAL INFINITE BLACK CARD --- */}
                  <div className="bg-gradient-to-r from-[#0F0D0B] via-[#1C1712] to-[#2B231B] text-[#F8F3EB] p-3.5 rounded-2xl border border-[#C8A24F]/40 shadow-sm space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A24F]/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[#C8A24F] font-bold">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#C8A24F]" /> Protected Vault Payment
                      </span>
                      <span className="bg-[#C8A24F]/20 text-[#C8A24F] px-2 py-0.5 rounded-full border border-[#C8A24F]/30">
                        PRIMARY
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {/* Golden Chip Icon */}
                        <div className="w-6 h-4.5 bg-gradient-to-br from-[#EAE2D5] via-[#C8A24F] to-[#9B7A2B] rounded border border-[#FAF7F2]/60 shadow-sm shrink-0" />
                        <div>
                          <p className="font-serif-luxury text-xs text-white m-0 font-bold tracking-tight">
                            Infinite Black Card
                          </p>
                          <span className="font-mono text-[10px] text-[#75695C] block">
                            4890 •••• •••• 9999
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[9px] text-[#75695C] uppercase block">Card Balance</span>
                        <span className="text-xs font-bold text-[#C8A24F]">
                          ${(fakeBalance || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 font-mono text-xs uppercase">
                    <div className="flex justify-between items-end border-t border-[#EAE2D5] pt-2 text-sm">
                      <span className="font-sans text-lg font-normal text-[#1C1712]">Total Required</span>
                      <span className="font-mono text-2xl font-bold text-[#9B7A2B]">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowCheckoutModal(true)}
                      className="w-full py-3.5 sm:py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C8A24F]/20 active:scale-95"
                    >
                      <CreditCard className="w-4 h-4" /> Authorize Checkout
                    </button>

                    <Link
                      href="/feed"
                      onClick={onClose}
                      className="w-full py-1.5 text-center font-mono text-[10px] sm:text-[11px] font-bold text-[#75695C] hover:text-[#1C1712] uppercase tracking-widest block transition-colors"
                    >
                      Keep Browsing Catalog →
                    </Link>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] font-mono uppercase text-[#75695C]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24F]" /> Zero Real Money • Instant Card Authorization
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Integrated Checkout Modal Trigger */}
          {showCheckoutModal && (
            <CheckoutModal
              totalAmount={total}
              onConfirm={handleCheckoutConfirm}
              onClose={() => setShowCheckoutModal(false)}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}