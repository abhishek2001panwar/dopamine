'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { CheckoutModal } from '../components/CheckoutModal';
import { useAppStore } from '@/src/lib/store';
import confetti from 'canvas-confetti';
import { Trash2, CreditCard, ShoppingBag, CheckCircle2, ArrowRight, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, fakeBalance, setBalance, setUserData } = useAppStore();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [userProfile, setUserProfile] = useState<{ id: string; name: string; email: string; deliveryAddress: string } | null>(null);

  const currentCart = Array.isArray(cart) ? cart : [];
  const total = currentCart.reduce((acc, i) => acc + (Number(i.price) || 0), 0);

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserProfile({
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            deliveryAddress: data.user.deliveryAddress,
          });
          setUserData({
            fakeBalance: data.user.fakeBalance,
            streakCount: data.user.streakCount,
          });
        }
      })
      .catch((err) => console.error('Failed to load profile:', err));
  }, [setUserData]);

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
          userId: userProfile?.id,
          userEmail: userProfile?.email,
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white pb-24 antialiased overflow-x-hidden">
      <Navbar />

      <main className="w-full px-6 md:px-16 pt-8 space-y-12">
        {/* Page Title & Item Telemetry */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAE2D5] pb-6">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9B7A2B]">
              Archive Holding Box
            </span>
            <h1 className="text-4xl sm:text-5xl font-normal text-[#1C1712] flex items-center gap-3 m-0">
              <ShoppingBag className="w-9 h-9 text-[#C8A24F]" /> Your Cart
            </h1>
          </div>
          <span className="font-mono text-xs font-bold uppercase bg-[#1C1712] text-white px-4 py-1.5 rounded-full tracking-widest shadow-sm self-start sm:self-auto">
            {currentCart.length} {currentCart.length === 1 ? 'ITEM' : 'ITEMS'}
          </span>
        </div>

        {purchased ? (
          /* Order Confirmation Card */
          <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-2xl border border-white/90 p-12 text-center space-y-8 rounded-[44px] shadow-[0_25px_60px_rgba(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-[#1C1712] text-[#F8F3EB] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 text-[#C8A24F]" />
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs uppercase font-bold tracking-widest text-[#9B7A2B]">
                Transaction Completed
              </span>
              <h2 className="text-4xl font-normal tracking-tight text-[#1C1712] m-0">
                Acquisition Confirmed
              </h2>
              <p className="font-mono text-xs text-[#75695C] max-w-md mx-auto uppercase leading-relaxed m-0">
                Items cleared and registered to HQ destination:{' '}
                <strong className="text-[#1C1712] underline decoration-[#C8A24F]">
                  {userProfile?.deliveryAddress || 'Your Digital Wardrobe'}
                </strong>
              </p>
            </div>

            <button
              onClick={() => setPurchased(false)}
              className="px-9 py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 inline-flex items-center gap-2 active:scale-95"
            >
              Return to Catalog <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-5">
              {currentCart.length > 0 ? (
                currentCart.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="flex items-center justify-between bg-white/60 backdrop-blur-2xl p-5 border border-white/80 rounded-[28px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(200,162,79,0.1)] transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-24 h-24 bg-[#F8F3EB] rounded-2xl border border-[#EAE2D5] overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-normal text-[#1C1712] line-clamp-1 m-0">
                          {item.title}
                        </h3>
                        <p className="font-mono text-base font-bold text-[#9B7A2B] m-0">
                          ${item.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-3.5 text-[#75695C] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors border border-transparent"
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                /* Empty Cart State */
                <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-16 rounded-[40px] text-center space-y-5 shadow-sm">
                  <div className="w-16 h-16 bg-[#F8F3EB] rounded-full flex items-center justify-center mx-auto border border-[#EAE2D5]">
                    <ShoppingBag className="w-8 h-8 text-[#9B7A2B]" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-normal text-[#1C1712] m-0">
                      Your Cart is Empty
                    </h2>
                    <p className="font-mono text-xs text-[#75695C] uppercase tracking-widest m-0">
                      Select items from the catalog to prepare for virtual checkout.
                    </p>
                  </div>
                  <Link
                    href="/feed"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 active:scale-95"
                  >
                    Browse Feed <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {currentCart.length > 0 && (
              <div className="lg:col-span-5">
                <div className="bg-white/70 backdrop-blur-2xl border border-white/90 rounded-[36px] p-8 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.04)] sticky top-28">
                  <div className="border-b border-[#EAE2D5] pb-4">
                    <span className="font-mono text-xs uppercase font-bold tracking-widest text-[#9B7A2B] block">
                      Financial Settlement
                    </span>
                    <h3 className="text-2xl font-normal text-[#1C1712] mt-1 m-0">
                      Order Summary
                    </h3>
                  </div>

                  <div className="space-y-3.5 font-mono text-xs uppercase">
                    <div className="flex justify-between text-[#75695C]">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#1C1712]">${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#75695C]">
                      <span>Virtual Processing Fee</span>
                      <span className="font-bold text-[#C8A24F]">$0.00</span>
                    </div>
                    <div className="flex justify-between text-[#75695C]">
                      <span>Available Balance</span>
                      <span className="font-bold text-[#1C1712]">${fakeBalance.toLocaleString()}</span>
                    </div>

                    <div className="border-t border-[#EAE2D5] pt-5 flex justify-between items-end text-sm">
                      <h4 className="text-2xl font-normal text-[#1C1712] m-0">Total</h4>
                      <span className="font-mono text-3xl font-bold text-[#9B7A2B]">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C8A24F]/25 active:scale-95"
                  >
                    <CreditCard className="w-4 h-4" /> Proceed to Express Checkout
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase text-[#75695C] font-bold pt-2 border-t border-[#EAE2D5]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24F]" /> Zero Real Money • Instant Authorization
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Dynamic Express Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          totalAmount={total}
          savedAddress={userProfile?.deliveryAddress}
          userId={userProfile?.id}
          userName={userProfile?.name}
          onConfirm={handleCheckoutConfirm}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}
    </div>
  );
}