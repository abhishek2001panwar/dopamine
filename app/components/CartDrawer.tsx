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
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  Minus,
  Sparkles
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

  const handleCheckoutConfirm = async (checkoutData: { address: string; cardName: string; cardNumber: string }) => {
    if (total > fakeBalance) {
      alert('Insufficient virtual funds available.');
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: currentCart,
          totalAmount: total,
          deliveryAddress: checkoutData.address,
          paymentCard: `${checkoutData.cardName} (${checkoutData.cardNumber})`,
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
              <div className="p-6 border-b border-[#EAE2D5] flex items-center justify-between relative z-10 bg-white/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1C1712] text-white rounded-full">
                    <ShoppingBag className="w-5 h-5 text-[#C8A24F]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-normal text-[#1C1712] m-0">Quick Bag</h2>
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
              <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
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
                      className="bg-white/80 backdrop-blur-2xl border border-[#EAE2D5] rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-16 bg-[#F8F3EB] rounded-xl border border-[#EAE2D5] overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="space-y-0.5 truncate">
                          <h4 className="text-lg font-normal text-[#1C1712] truncate m-0">
                            {item.title}
                          </h4>
                          <p className="font-mono text-xs font-bold text-[#9B7A2B] m-0">
                            ${item.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2.5 text-[#75695C] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
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
                <div className="p-6 bg-white/70 backdrop-blur-2xl border-t border-[#EAE2D5] space-y-4 relative z-10 shadow-lg">
                  <div className="space-y-2 font-mono text-xs uppercase">
                    <div className="flex justify-between text-[#75695C]">
                      <span>Virtual Balance</span>
                      <span className="font-bold text-[#1C1712]">${fakeBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end border-t border-[#EAE2D5] pt-2 text-sm">
                      <span className="font-sans text-xl font-normal text-[#1C1712]">Total</span>
                      <span className="font-mono text-2xl font-bold text-[#9B7A2B]">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setShowCheckoutModal(true)}
                      className="w-full py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C8A24F]/20 active:scale-95"
                    >
                      <CreditCard className="w-4 h-4" /> Quick Checkout
                    </button>

                    <Link
                      href="/cart"
                      onClick={onClose}
                      className="w-full py-2.5 text-center font-mono text-[11px] font-bold text-[#75695C] hover:text-[#1C1712] uppercase tracking-widest block transition-colors"
                    >
                      View Full Bag Page →
                    </Link>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase text-[#75695C] pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24F]" /> Zero Real Money • Instant Authorization
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