'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { DailyRewardModal } from '../components/DailyRewardModal';
import { DropCountdownCard } from '../components/DropCountdownCard';
import { useAppStore } from '@/src/lib/store';
import { SpinWheelModal } from '../components/SpinWheelModal';
import { OnboardingModal } from '../components/OnboardingModal';
import Link from 'next/link';
import { 
  Plus, 
  ShoppingBag, 
  Lock, 
  LogIn, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  Loader2, 
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  RotateCcw,
  Flame,
  ArrowRight,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES = ['All', 'Footwear', 'Outerwear', 'Tops', 'Timepieces', 'Gear', 'Tailoring', 'Bottoms'];

const PRICE_PRESETS = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $1,000', min: 0, max: 1000 },
  { label: '$1K – $10K', min: 1000, max: 10000 },
  { label: '$10K+ Luxury Drops', min: 10000, max: Infinity },
];

function FeedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [drops, setDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Search & Deep Filtering State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState<number>(Number(searchParams.get('maxPrice')) || 250000);
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // High-Dopamine Button States & Floating Particle Feedback
  const [addingState, setAddingState] = useState<Record<string, 'idle' | 'loading' | 'added'>>({});
  const [floatingParticles, setFloatingParticles] = useState<{ id: string; x: number; y: number; text: string }[]>([]);

  const { onboarded, setUserData, addToCart, fakeBalance } = useAppStore();

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. Authenticate user & check once-per-day onboarding
  useEffect(() => {
    fetch('/api/user/profile', { credentials: 'include' })
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

  // 2. Fetch products & drops whenever filters change
  useEffect(() => {
    if (isAuthenticated === false) return;

    setLoading(true);

    const preset = PRICE_PRESETS[selectedPreset];
    const minP = preset.min;
    const maxP = preset.max === Infinity ? priceRange : Math.min(preset.max, priceRange);

    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    if (minP > 0) params.set('minPrice', minP.toString());
    if (maxP < 250000) params.set('maxPrice', maxP.toString());
    if (sortBy) params.set('sort', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.products || [];
        setProducts(allProducts.filter((p: any) => !p.isDrop));
        setDrops(allProducts.filter((p: any) => p.isDrop));
      })
      .catch((err) => console.error('Failed to load feed products:', err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, searchQuery, selectedCategory, priceRange, selectedPreset, sortBy]);

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
      await fetch('/api/user/onboarding', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Failed to save onboarding state:', err);
    }

    setShowOnboarding(false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange(250000);
    setSelectedPreset(0);
    setSortBy('newest');
    router.push('/feed');
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
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] font-sans flex flex-col items-center justify-center p-4 xs:p-6 selection:bg-[#C8A24F] selection:text-white">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl border border-white/90 p-5 xs:p-8 sm:p-10 text-center space-y-5 sm:space-y-8 rounded-[24px] xs:rounded-[32px] sm:rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.04)]">
          <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-[#1C1712] text-[#F8F3EB] rounded-full flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-[#C8A24F]" />
          </div>

          <div className="space-y-1.5 sm:space-y-3">
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-normal tracking-tight m-0 text-[#1C1712]">
              Access Restricted
            </h2>
            <p className="font-mono text-[10px] xs:text-[11px] sm:text-xs text-[#75695C] uppercase tracking-widest leading-relaxed m-0">
              Catalog access requires an active authenticated session.
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-3 pt-1 font-mono text-[11px] sm:text-xs font-bold uppercase">
            <Link
              href="/login"
              className="w-full py-3 sm:py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C8A24F]/20 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Log In to Your Account
            </Link>
            <Link
              href="/signup"
              className="w-full py-3 sm:py-4 bg-white hover:bg-[#FAF7F2] border border-[#EAE2D5] text-[#1C1712] rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white pb-20 xs:pb-24 antialiased overflow-x-hidden relative font-sans">
      <Navbar />

      {/* Floating Price Particles Layer */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {floatingParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute font-mono text-[10px] xs:text-xs sm:text-sm font-bold text-[#C8A24F] bg-[#1C1712] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#C8A24F] shadow-xl animate-floatUp"
            style={{ left: particle.x, top: particle.y }}
          >
            {particle.text}
          </div>
        ))}
      </div>

      {showOnboarding && !onboarded && (
        <OnboardingModal onComplete={handleCompleteOnboarding} />
      )}

      <main className="w-full px-3 xs:px-4 sm:px-8 md:px-16 pt-4 xs:pt-6 sm:pt-8 space-y-8 sm:space-y-16 max-w-8xl mx-auto">
        {/* Modals & Action Triggers */}
        <div className="space-y-3 sm:space-y-4">
          <DailyRewardModal />
          <SpinWheelModal />
        </div>

        {/* Live Countdown Drops Section */}
        {drops.length > 0 && (
          <section className="space-y-4 sm:space-y-8">
            <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-3 sm:pb-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="p-1 sm:p-2 bg-[#1C1712] text-white rounded-full shadow-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#C8A24F]" />
                </span>
                <h2 className="text-xl xs:text-2xl sm:text-4xl font-normal tracking-tight text-[#1C1712] m-0">
                  Limited Live Drops
                </h2>
              </div>
              <span className="font-mono text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase bg-[#1C1712] text-white px-2.5 py-0.5 sm:px-4 sm:py-1.5 rounded-full tracking-widest shadow-sm">
                {drops.length} ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
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

        {/* Catalog Dossier Header & Deep Filtering System */}
        <section className="space-y-4 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3 border-b border-[#EAE2D5] pb-3 sm:pb-6">
            <div>
              <span className="font-mono text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-widest text-[#9B7A2B]">
                Curated Dossier
              </span>
              <h2 className="text-2xl xs:text-3xl sm:text-5xl font-normal text-[#1C1712] mt-0.5 m-0">
                Curated Catalog
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto pt-1 sm:pt-0">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden px-3 py-1.5 xs:px-3.5 xs:py-2 bg-white border border-[#EAE2D5] rounded-full font-mono text-[10px] xs:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <SlidersHorizontal className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-[#C8A24F]" /> Filters
              </button>

              <span className="font-mono text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase bg-[#1C1712] text-white px-3 py-1.5 xs:px-3.5 xs:py-2 sm:px-4 sm:py-2.5 rounded-full tracking-widest shadow-sm">
                {products.length} ITEMS
              </span>
            </div>
          </div>

          {/* Deep Filtering Control Box */}
          <div className={`space-y-4 sm:space-y-6 bg-white/70 backdrop-blur-2xl border border-white/90 p-3.5 xs:p-4 sm:p-8 rounded-[20px] xs:rounded-[24px] sm:rounded-[36px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            
            {/* Row 1: Search Input & Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-4 items-center">
              {/* Search Input */}
              <div className="md:col-span-8 relative">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#75695C] absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, brand, or tag (e.g. Rolex, Jordan, Dior)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-11 pr-8 sm:pr-10 py-2.5 sm:py-3.5 bg-white border border-[#EAE2D5] rounded-full font-mono text-[11px] sm:text-xs text-[#1C1712] placeholder:text-[#75695C] focus:outline-none focus:border-[#C8A24F] transition-colors shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-[#75695C] hover:text-[#1C1712]"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>

              {/* Sort Select */}
              <div className="md:col-span-4 relative">
                <div className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:py-3 bg-white border border-[#EAE2D5] rounded-full shadow-sm">
                  <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8A24F] shrink-0" />
                  <span className="font-mono text-[9px] sm:text-[10px] text-[#75695C] uppercase font-bold shrink-0">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-transparent font-mono text-[11px] sm:text-xs text-[#1C1712] focus:outline-none font-bold uppercase cursor-pointer"
                  >
                    <option value="newest">Newest Drops</option>
                    <option value="dopamine">🔥 Dopamine Score</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 2: Category Badges */}
            <div className="space-y-1.5 sm:space-y-2">
              <span className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-[#9B7A2B] uppercase tracking-widest block">
                Categories
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full border transition-all whitespace-nowrap font-bold uppercase tracking-wider text-[9px] xs:text-[10px] sm:text-[11px] ${
                      selectedCategory === cat
                        ? 'bg-[#1C1712] text-[#C8A24F] border-[#1C1712] shadow-md'
                        : 'bg-white border-[#EAE2D5] text-[#1C1712] hover:border-[#C8A24F]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Price Tier Presets & Range Slider */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 pt-2.5 sm:pt-3 border-t border-[#EAE2D5]/60 items-center">
              
              {/* Quick Price Presets */}
              <div className="lg:col-span-7 space-y-1.5 sm:space-y-2">
                <span className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-[#9B7A2B] uppercase tracking-widest block">
                  Price Intervals
                </span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-xs">
                  {PRICE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPreset(idx)}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border font-bold uppercase text-[8px] xs:text-[9px] sm:text-[10px] transition-all ${
                        selectedPreset === idx
                          ? 'bg-[#C8A24F] text-white border-[#C8A24F] shadow-sm'
                          : 'bg-white border-[#EAE2D5] text-[#75695C] hover:text-[#1C1712]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Range Input */}
              <div className="lg:col-span-5 space-y-1 sm:space-y-2">
                <div className="flex justify-between items-center font-mono text-[8px] xs:text-[9px] sm:text-[10px] font-bold uppercase">
                  <span className="text-[#9B7A2B]">Max Price Cap</span>
                  <span className="text-[#1C1712] text-[11px] sm:text-xs font-bold">${priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={250000}
                  step={5000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#C8A24F] cursor-pointer"
                />
              </div>
            </div>

            {/* Reset Filters Pill */}
            {(searchQuery || selectedCategory !== 'All' || priceRange < 250000 || selectedPreset !== 0 || sortBy !== 'newest') && (
              <div className="pt-0.5 flex justify-end">
                <button
                  onClick={handleResetFilters}
                  className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-[#75695C] hover:text-red-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Main Product Catalog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[20px] xs:rounded-[28px] sm:rounded-[36px] h-72 xs:h-80 sm:h-96 animate-pulse shadow-sm"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
              {products.map((item) => {
                const isLiked = wishlist[item._id];
                const buttonState = addingState[item._id] || 'idle';

                return (
                  <div
                    key={item._id}
                    className={`bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[22px] xs:rounded-[28px] sm:rounded-[36px] overflow-hidden transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 group flex flex-col justify-between ${
                      buttonState === 'added'
                        ? 'shadow-[0_0_30px_rgba(200,162,79,0.35)] ring-2 ring-[#C8A24F]'
                        : 'shadow-[0_15px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(200,162,79,0.12)]'
                    }`}
                  >
                    <div>
                      {/* Image Container */}
                      <div className="h-52 xs:h-64 sm:h-72 bg-[#F8F3EB] relative overflow-hidden">
                        <Link href={`/products/${item._id}`}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </Link>
                        {item.tag && (
                          <span className="absolute top-2.5 left-2.5 xs:top-3.5 xs:left-3.5 sm:top-4 sm:left-4 bg-[#1C1712] text-white font-mono text-[8px] xs:text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 xs:px-3 xs:py-1 rounded-full uppercase tracking-widest shadow-sm">
                            {item.tag}
                          </span>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => toggleWishlist(item._id, e)}
                          className="absolute top-2.5 right-2.5 xs:top-3.5 xs:right-3.5 sm:top-4 sm:right-4 p-2 xs:p-2.5 sm:p-3 rounded-full bg-white/80 backdrop-blur-md text-[#1C1712] hover:text-[#C8A24F] transition-colors shadow-sm z-10 active:scale-90"
                        >
                          <Heart className={`w-3.5 h-3.5 xs:w-4 xs:h-4 ${isLiked ? 'fill-[#C8A24F] text-[#C8A24F]' : ''}`} />
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 xs:p-5 sm:p-7 space-y-1.5 sm:space-y-3">
                        <div className="flex justify-between items-center font-mono text-[9px] xs:text-[10px] font-bold uppercase tracking-widest text-[#75695C]">
                          <span>{item.category || 'Luxury Drop'}</span>
                          {item.dopamineScore && (
                            <span className="text-[#C8A24F] flex items-center gap-0.5 xs:gap-1">
                              <Flame className="w-2.5 h-2.5 xs:w-3 xs:h-3 fill-current" /> {item.dopamineScore} PTS
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg xs:text-xl sm:text-2xl font-normal text-[#1C1712] line-clamp-1 m-0">
                          {item.title}
                        </h3>
                        <p className="text-[11px] xs:text-xs text-[#75695C] line-clamp-2 font-normal leading-relaxed m-0">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer with Micro-Interactive Button */}
                    <div className="p-4 xs:p-5 sm:p-7 pt-2 xs:pt-2.5 sm:pt-3 flex flex-col xs:flex-row items-stretch xs:items-center justify-between border-t border-[#EAE2D5] gap-2 xs:gap-0 mt-2 sm:mt-4">
                      <h4 className="text-lg xs:text-xl sm:text-2xl font-normal text-[#1C1712] m-0">
                        ${item.price?.toLocaleString()}
                      </h4>

                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        disabled={buttonState === 'loading'}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 xs:px-4 xs:py-2.5 sm:px-6 sm:py-3 rounded-full font-mono text-[10px] xs:text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-all duration-300 shadow-md active:scale-95 ${
                          buttonState === 'added'
                            ? 'bg-[#1C1712] text-[#C8A24F] border border-[#C8A24F] shadow-lg shadow-[#C8A24F]/30 scale-102'
                            : buttonState === 'loading'
                            ? 'bg-[#B38C3B] text-white opacity-80 cursor-wait'
                            : 'bg-[#C8A24F] hover:bg-[#B38C3B] text-white shadow-[#C8A24F]/20'
                        }`}
                      >
                        {buttonState === 'loading' ? (
                          <>
                            <Loader2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 animate-spin text-white" />
                            <span>Processing...</span>
                          </>
                        ) : buttonState === 'added' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#C8A24F] animate-bounce" />
                            <span>Secured!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
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
            <div className="text-center py-12 xs:py-16 bg-white/60 backdrop-blur-2xl rounded-[24px] xs:rounded-[32px] border border-white/80 shadow-sm space-y-3 sm:space-y-4 px-4">
              <ShoppingBag className="w-10 h-10 xs:w-12 xs:h-12 text-[#9B7A2B] mx-auto" />
              <div className="space-y-1">
                <p className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#75695C] m-0">
                  Catalog Archive Empty
                </p>
                <p className="font-mono text-[9px] xs:text-[10px] text-[#75695C] uppercase tracking-wider m-0">
                  Try adjusting your search terms or clearing price interval sliders.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 xs:gap-2 px-5 py-2 xs:px-6 xs:py-2.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md active:scale-95"
              >
                <RotateCcw className="w-3 h-3 xs:w-3.5 xs:h-3.5" /> Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 xs:w-9 xs:h-9 border-2 border-[#C8A24F] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FeedContent />
    </Suspense>
  );
}