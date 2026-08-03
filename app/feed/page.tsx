'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { DailyRewardModal } from '../components/DailyRewardModal';
import { DropCountdownCard } from '../components/DropCountdownCard';
import { useAppStore } from '@/src/lib/store';
import { SpinWheelModal } from '../components/SpinWheelModal';
import { OnboardingModal } from '../components/OnboardingModal';
import Link from 'next/link';
import { Plus, ShoppingBag, Lock, LogIn, Sparkles, ArrowUpRight } from 'lucide-react';

export default function FeedPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [drops, setDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { onboarded, setUserData, addToCart } = useAppStore();

  // 1. Session Auth Check: Verify token validity immediately on page load
  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => {
        if (!res.ok) {
          setIsAuthenticated(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setIsAuthenticated(true);
          setUserData({
            fakeBalance: data.user.fakeBalance,
            streakCount: data.user.streakCount,
            onboarded: data.user.onboarded,
          });

          if (!data.user.onboarded && !onboarded) {
            setShowOnboarding(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, [onboarded, setUserData]);

  // 2. Fetch products if authenticated
  useEffect(() => {
    if (isAuthenticated === false) return;

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.products || [];
        setProducts(allProducts.filter((p: any) => !p.isDrop));
        setDrops(allProducts.filter((p: any) => p.isDrop));
      })
      .catch((err) => console.error('Failed to load feed products:', err))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Unauthenticated State — Editorial Lock Screen
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
        <div className="max-w-md w-full bg-white border-2 border-black p-8 text-center space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black font-serif uppercase tracking-tight">Access Restricted</h1>
            <p className="text-xs font-mono text-neutral-600 uppercase tracking-widest">
              Catalog access requires an active authenticated session.
            </p>
          </div>

          <div className="space-y-3 pt-2 font-mono text-xs font-bold uppercase">
            <Link
              href="/login"
              className="w-full py-4 bg-black text-white flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
            >
              <LogIn className="w-4 h-4" /> Log In to Your Account
            </Link>
            <Link
              href="/signup"
              className="w-full py-4 border-2 border-black text-black flex items-center justify-center hover:bg-neutral-100 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleClaimSuccess = (product: any) => {
    addToCart(product);
    alert(`Secured ${product.title}! Added to your bag.`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-black font-sans selection:bg-black selection:text-white pb-20">
      <Navbar />

      {showOnboarding && !onboarded && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}

      <main className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Modals & Action Triggers */}
        <div className="space-y-4">
          <DailyRewardModal />
          <SpinWheelModal />
        </div>

        {/* Live Countdown Drops Section */}
        {drops.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-3">
                <span className="p-1 bg-black text-white">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h2 className="text-2xl font-black font-serif uppercase tracking-tight">
                  Limited Live Drops
                </h2>
              </div>
              <span className="font-mono text-xs font-bold uppercase bg-black text-white px-3 py-1">
                {drops.length} ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {drops.map((drop) => (
                <DropCountdownCard
                  key={drop._id}
                  product={drop}
                  onClaimSuccess={handleClaimSuccess}
                />
              ))}
            </div>
          </section>
        )}

        {/* Main Product Catalog */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="text-2xl font-black font-serif uppercase tracking-tight">
              Curated Catalog
            </h2>
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest font-semibold">
              Vol. 01 — Instant Acquisition
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white border-2 border-black h-96 animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border-2 border-black overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header */}
                    <div className="h-72 overflow-hidden relative bg-neutral-100 border-b-2 border-black">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500  group-hover:grayscale-0"
                      />
                      {item.tag && (
                        <span className="absolute top-4 left-4 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-black">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold font-serif uppercase tracking-tight text-black line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-2 font-normal leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-neutral-200 mt-4">
                    <span className="font-mono text-2xl font-black text-black">
                      ${item.price?.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all active:translate-y-0.5"
                    >
                      <Plus className="w-4 h-4" /> Add to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border-2 border-dashed border-black space-y-3">
              <ShoppingBag className="w-12 h-12 text-black mx-auto" />
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600">
                Catalog Archive Empty
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}