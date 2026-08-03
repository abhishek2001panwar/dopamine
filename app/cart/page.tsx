'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { CheckoutModal } from '../components/CheckoutModal';
import { useAppStore } from '@/src/lib/store';
import confetti from 'canvas-confetti';
import { Trash2, CreditCard, ShoppingBag, CheckCircle, ArrowUpRight, Lock } from 'lucide-react';
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
    <div className="min-h-screen bg-neutral-50 text-black font-sans selection:bg-black selection:text-white pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header Title */}
        <div className="border-b-2 border-black pb-4 flex justify-between items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-bold">
              Archive Holding Box
            </span>
            <h1 className="text-4xl font-black font-serif uppercase tracking-tight flex items-center gap-3 mt-1">
              <ShoppingBag className="w-8 h-8 text-black" /> Your Cart
            </h1>
          </div>
          <span className="font-mono text-xs font-bold uppercase bg-black text-white px-3 py-1">
            {currentCart.length} {currentCart.length === 1 ? 'ITEM' : 'ITEMS'}
          </span>
        </div>

        {purchased ? (
          /* Order Confirmation Screen */
          <div className="bg-white border-2 border-black p-10 text-center space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto border-2 border-black">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase font-bold tracking-widest text-neutral-500">
                Transaction Completed
              </span>
              <h2 className="text-3xl font-black font-serif uppercase tracking-tight">Acquisition Confirmed</h2>
              <p className="text-xs font-mono text-neutral-600 max-w-md mx-auto uppercase leading-relaxed">
                Items cleared and registered to HQ destination:{' '}
                <strong className="text-black underline">{userProfile?.deliveryAddress || 'Your Digital Wardrobe'}</strong>
              </p>
            </div>
            <button
              onClick={() => setPurchased(false)}
              className="px-8 py-4 bg-black hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-2"
            >
              Return to Catalog <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              {currentCart.length > 0 ? (
                currentCart.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="flex items-center justify-between bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-neutral-100 border border-black overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-serif font-bold text-lg uppercase tracking-tight line-clamp-1">{item.title}</h3>
                        <p className="font-mono text-sm font-black text-black">${item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-3 text-neutral-400 hover:text-black hover:bg-neutral-100 border border-transparent hover:border-black transition-all"
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                /* Empty Cart State */
                <div className="bg-white border-2 border-dashed border-black p-12 text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-black mx-auto" />
                  <div className="space-y-1">
                    <p className="font-serif font-bold text-xl uppercase">Cart is Empty</p>
                    <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                      Select items from the catalog to prepare for checkout.
                    </p>
                  </div>
                  <Link
                    href="/feed"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                  >
                    Browse Feed <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {currentCart.length > 0 && (
              <div className="lg:col-span-5">
                <div className="bg-white border-2 border-black p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-24">
                  <span className="font-mono text-xs uppercase font-bold tracking-widest text-neutral-500 border-b border-neutral-200 pb-2 block">
                    Financial Settlement
                  </span>

                  <div className="space-y-3 font-mono text-xs uppercase">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-black">${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Virtual Processing Fee</span>
                      <span className="font-bold text-black">$0.00</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Available Balance</span>
                      <span className="font-bold text-black">${fakeBalance.toLocaleString()}</span>
                    </div>

                    <div className="border-t-2 border-black pt-4 flex justify-between items-end text-sm">
                      <span className="font-serif font-black text-lg">Total</span>
                      <span className="font-mono text-2xl font-black text-black">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" /> Proceed to Express Checkout
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase text-neutral-500 font-bold pt-2 border-t border-neutral-200">
                    <Lock className="w-3 h-3" /> Zero Real Money • Instant Authorization
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