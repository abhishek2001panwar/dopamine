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
import { Plus, ShoppingBag, Lock, LogIn, Sparkles, Heart, CheckCircle2, Loader2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FeedPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [drops, setDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // High-Dopamine Button States & Floating Particle Feedback
  const [addingState, setAddingState] = useState<Record<string, 'idle' | 'loading' | 'added'>>({});
  const [floatingParticles, setFloatingParticles] = useState<{ id: string; x: number; y: number; text: string }[]>([]);

  const { onboarded, setUserData, addToCart, fakeBalance, setBalance } = useAppStore();

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. Authenticate user & check once-per-day onboarding
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

          // --- ONCE-PER-DAY ONBOARDING CHECK ---
          const todayStr = new Date().toISOString().split('T')[0];
          const lastSeenLocal = localStorage.getItem('dopacart_last_onboarded_date');

          if (!data.user.onboarded && lastSeenLocal !== todayStr) {
            setShowOnboarding(true);
          } else {
            setShowOnboarding(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, [setUserData]);

  // 2. Fetch products & drops if authenticated
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

  // Handle High-Dopamine Animated Add-To-Cart Action
  const handleAddToCart = (item: any, e: React.MouseEvent) => {
    const productId = item._id;

    if (addingState[productId] === 'loading' || addingState[productId] === 'added') return;

    setAddingState((prev) => ({ ...prev, [productId]: 'loading' }));

    const rect = e.currentTarget.getBoundingClientRect();
    const particleId = `${productId}-${Date.now()}`;
    setFloatingParticles((prev) => [
      ...prev,
      { id: particleId, x: rect.left + rect.width / 2, y: rect.top, text: `+$${item.price?.toLocaleString()}` },
    ]);

    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 1000);

    setTimeout(() => {
      addToCart(item);
      setAddingState((prev) => ({ ...prev, [productId]: 'added' }));

      confetti({
        particleCount: 25,
        spread: 50,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#C8A24F', '#9B7A2B', '#FFFFFF'],
      });

      setTimeout(() => {
        setAddingState((prev) => ({ ...prev, [productId]: 'idle' }));
      }, 1800);
    }, 450);
  };

  // Connected Drop Claim Handler
  const handleClaimSuccess = async (product: any) => {
    if (fakeBalance < product.price) {
      alert('Insufficient grant balance to claim this drop!');
      return;
    }

    try {
      addToCart(product);
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#C8A24F', '#9B7A2B', '#FFFFFF'],
      });
    } catch (err) {
      console.error('Failed to process drop claim:', err);
    }
  };

  // Onboarding Completion Handler
  const handleCompleteOnboarding = async () => {
    const todayStr = new Date().toISOString().split('T')[0];

    localStorage.setItem('dopacart_last_onboarded_date', todayStr);
    useAppStore.getState().setUserData({ onboarded: true });

    try {
      await fetch('/api/user/onboarding', { method: 'POST' });
    } catch (err) {
      console.error('Failed to save onboarding state:', err);
    }

    setShowOnboarding(false);
  };

  // Loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-[#C8A24F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Unauthenticated Lock Screen
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] font-sans flex flex-col items-center justify-center p-6 selection:bg-[#C8A24F] selection:text-white">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl border border-white/90 p-10 text-center space-y-8 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.04)]">
          <div className="w-16 h-16 bg-[#1C1712] text-[#F8F3EB] rounded-full flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7 text-[#C8A24F]" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-normal tracking-tight m-0 text-[#1C1712]">
              Access Restricted
            </h2>
            <p className="font-mono text-xs text-[#75695C] uppercase tracking-widest leading-relaxed m-0">
              Catalog access requires an active authenticated session.
            </p>
          </div>

          <div className="space-y-3 pt-2 font-mono text-xs font-bold uppercase">
            <Link
              href="/login"
              className="w-full py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C8A24F]/20"
            >
              <LogIn className="w-4 h-4" /> Log In to Your Account
            </Link>
            <Link
              href="/signup"
              className="w-full py-4 bg-white hover:bg-[#FAF7F2] border border-[#EAE2D5] text-[#1C1712] rounded-full flex items-center justify-center transition-all shadow-sm"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white pb-24 antialiased overflow-x-hidden relative">
      <Navbar />

      {/* Floating Price Particles Layer */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {floatingParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute font-mono text-sm font-bold text-[#C8A24F] bg-[#1C1712] px-3 py-1 rounded-full border border-[#C8A24F] shadow-xl animate-floatUp"
            style={{ left: particle.x, top: particle.y }}
          >
            {particle.text}
          </div>
        ))}
      </div>

      {showOnboarding && !onboarded && (
        <OnboardingModal onComplete={handleCompleteOnboarding} />
      )}

      <main className="w-full px-6 md:px-16 pt-8 space-y-16">
        {/* Modals & Action Triggers */}
        <div className="space-y-4">
          <DailyRewardModal />
          <SpinWheelModal />
        </div>

        {/* Live Countdown Drops Section */}
        {drops.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-5">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-[#1C1712] text-white rounded-full shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#C8A24F]" />
                </span>
                <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1712] m-0">
                  Limited Live Drops
                </h2>
              </div>
              <span className="font-mono text-xs font-bold uppercase bg-[#1C1712] text-white px-4 py-1.5 rounded-full tracking-widest shadow-sm">
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
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE2D5] pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#9B7A2B]">
                Curated Dossier
              </span>
              <h2 className="text-4xl sm:text-5xl font-normal text-[#1C1712] mt-1 m-0">
                Curated Catalog
              </h2>
            </div>
            <span className="font-mono text-xs text-[#75695C] uppercase tracking-widest font-semibold">
              Vol. 01 — Instant Acquisition
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[36px] h-96 animate-pulse shadow-sm"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((item) => {
                const isLiked = wishlist[item._id];
                const buttonState = addingState[item._id] || 'idle';

                return (
                  <div
                    key={item._id}
                    className={`bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[36px] overflow-hidden transition-all duration-500 hover:-translate-y-2 group flex flex-col justify-between ${
                      buttonState === 'added'
                        ? 'shadow-[0_0_30px_rgba(200,162,79,0.35)] ring-2 ring-[#C8A24F]'
                        : 'shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(200,162,79,0.12)]'
                    }`}
                  >
                    <div>
                      {/* Image Container */}
                      <div className="h-72 bg-[#F8F3EB] relative overflow-hidden">
                        <Link href={`/products/${item._id}`}>
 
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        </Link>
                        {item.tag && (
                          <span className="absolute top-4 left-4 bg-[#1C1712] text-white font-mono text-[10px] font-bold px-3.5 py-1 rounded-full uppercase tracking-widest">
                            {item.tag}
                          </span>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => toggleWishlist(item._id, e)}
                          className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md text-[#1C1712] hover:text-[#C8A24F] transition-colors shadow-sm"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#C8A24F] text-[#C8A24F]' : ''}`} />
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="p-7 space-y-3">
                        <h3 className="text-2xl font-normal text-[#1C1712] line-clamp-1 m-0">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#75695C] line-clamp-2 font-normal leading-relaxed m-0">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer with Micro-Interactive Button */}
                    <div className="p-7 pt-3 flex items-center justify-between border-t border-[#EAE2D5] mt-4">
                      <h4 className="text-2xl font-normal text-[#1C1712] m-0">
                        ${item.price?.toLocaleString()}
                      </h4>

                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        disabled={buttonState === 'loading'}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md active:scale-95 ${
                          buttonState === 'added'
                            ? 'bg-[#1C1712] text-[#C8A24F] border border-[#C8A24F] shadow-lg shadow-[#C8A24F]/30 scale-105'
                            : buttonState === 'loading'
                            ? 'bg-[#B38C3B] text-white opacity-80 cursor-wait'
                            : 'bg-[#C8A24F] hover:bg-[#B38C3B] text-white shadow-[#C8A24F]/20'
                        }`}
                      >
                        {buttonState === 'loading' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Processing...</span>
                          </>
                        ) : buttonState === 'added' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#C8A24F] animate-bounce" />
                            <span>Secured to Bag!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/60 backdrop-blur-2xl rounded-[36px] border border-white/80 shadow-sm space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#9B7A2B] mx-auto" />
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#75695C] m-0">
                Catalog Archive Empty
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}