'use client';

import React, { use, useEffect, useState } from 'react';
import { Navbar } from '@/app/components/Navbar';
import Link from 'next/link';
import { useAppStore } from '@/src/lib/store';
import { 
  Star, 
  ShoppingBag, 
  ArrowLeft, 
  Minus, 
  Plus, 
  Sparkles,
  CheckCircle2,
  Lock,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

interface ProductData {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
  category?: string;
  sizes?: string[];
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const { addToCart, setUserData } = useAppStore();

  const DEFAULT_REVIEWS: Review[] = [
    {
      author: 'Julian V.',
      rating: 5,
      comment: 'Extremely high quality craftsmanship. The clout levels on this piece are insane.',
      date: '2 days ago',
      verifiedPurchase: true,
    },
    {
      author: 'Aria K.',
      rating: 5,
      comment: 'Fits true to size. Arrived in signature DopaCart luxury vault packaging.',
      date: '1 week ago',
      verifiedPurchase: true,
    },
    {
      author: 'Marcus S.',
      rating: 4,
      comment: 'Super dope aesthetic. Instant dopamine hit when opening the box.',
      date: '2 weeks ago',
      verifiedPurchase: true,
    },
  ];

  // 1. Check Authentication Status
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
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, [setUserData]);

  // 2. Fetch Product data ONLY if authenticated
  useEffect(() => {
    if (isAuthenticated !== true) return;

    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
        }
      })
      .catch((err) => console.error('Error loading product details:', err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, productId]);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...product,
        selectedSize: selectedSize || 'Standard',
      });
    }

    setAdded(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#C8A24F', '#9B7A2B', '#FFFFFF'],
    });

    setTimeout(() => setAdded(false), 2000);
  };

  // Loading Screen while verifying auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-[#C8A24F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Unauthenticated Lock Screen (Without Login Access Guard)
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] font-sans flex flex-col items-center justify-center p-6 selection:bg-[#C8A24F] selection:text-white">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl border border-white/90 p-10 text-center space-y-8 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.04)]">
          <div className="w-16 h-16 bg-[#1C1712] text-[#F8F3EB] rounded-full flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7 text-[#C8A24F]" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-normal tracking-tight m-0 text-[#1C1712]">
              Vault Access Restricted
            </h2>
            <p className="font-mono text-xs text-[#75695C] uppercase tracking-widest leading-relaxed m-0">
              Viewing product specs and initiating acquisitions requires an authenticated session.
            </p>
          </div>

          <div className="space-y-3 pt-2 font-mono text-xs font-bold uppercase">
            <Link
              href="/login"
              className="w-full py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C8A24F]/20"
            >
              <LogIn className="w-4 h-4" /> Log In to View Item
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

  // Loading product data
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="w-10 h-10 border-2 border-[#C8A24F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#75695C] mt-4">
            Decrypting Dossier Telemetry...
          </p>
        </div>
      </div>
    );
  }

  // Product not found in database
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4">
          <h2 className="text-3xl font-normal text-[#1C1712]">Product Not Found</h2>
          <Link href="/feed" className="font-mono text-xs text-[#C8A24F] uppercase font-bold">
            ← Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const sizesList = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
  const reviewsList = product.reviews && product.reviews.length > 0 ? product.reviews : DEFAULT_REVIEWS;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] font-sans selection:bg-[#C8A24F] selection:text-white pb-24">
      <Navbar />

      <main className="max-w-8xl mx-auto px-6 md:px-12 pt-8 space-y-16">
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#75695C] hover:text-[#1C1712] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dossier Catalog
        </Link>

        {/* Hero Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Image Column */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-2xl border border-white/90 p-4 rounded-[40px] shadow-sm relative overflow-hidden">
            <div className="h-[480px] sm:h-[560px] rounded-[32px] overflow-hidden bg-[#FAF7F2] relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.tag && (
                <span className="absolute top-6 left-6 bg-[#1C1712] text-white font-mono text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* Purchasing Controls */}
          <div className="lg:col-span-5 space-y-8 bg-white/70 backdrop-blur-2xl border border-white/90 p-8 rounded-[40px] shadow-sm">
            <div className="space-y-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {product.category || 'Luxury Collection'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-normal text-[#1C1712] m-0">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 font-mono text-xs">
                <div className="flex items-center text-[#C8A24F]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C8A24F]" />
                  ))}
                </div>
                <span className="font-bold text-[#1C1712]">{product.rating || 4.9}</span>
                <span className="text-[#75695C]">({product.reviewsCount || reviewsList.length} reviews)</span>
              </div>

              <div className="font-mono text-3xl font-bold text-[#9B7A2B] pt-2">
                ${product.price?.toLocaleString()}
              </div>
            </div>

            <p className="text-sm text-[#75695C] leading-relaxed font-normal m-0 border-t border-[#EAE2D5] pt-4">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-xs uppercase">
                <span className="font-bold text-[#1C1712]">Select Size</span>
                <span className="text-[#75695C]">Fits True To Size</span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                {sizesList.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-2xl font-bold border transition-all ${
                      selectedSize === size
                        ? 'bg-[#1C1712] text-[#C8A24F] border-[#1C1712] shadow-sm'
                        : 'bg-white border-[#EAE2D5] text-[#1C1712] hover:border-[#C8A24F]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold uppercase text-[#1C1712]">Quantity</span>
              <div className="flex items-center gap-4 bg-white border border-[#EAE2D5] p-2 rounded-2xl w-max">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-[#FAF7F2] rounded-xl text-[#1C1712]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono font-bold text-sm w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-[#FAF7F2] rounded-xl text-[#1C1712]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-full font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
                added
                  ? 'bg-[#1C1712] text-[#C8A24F] border border-[#C8A24F]'
                  : 'bg-[#C8A24F] hover:bg-[#B38C3B] text-white shadow-[#C8A24F]/25 active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#C8A24F]" />
                  <span>Added To Quick Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag • ${(product.price * quantity).toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="bg-white/70 backdrop-blur-2xl border border-white/90 p-8 md:p-12 rounded-[40px] shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-[#EAE2D5] pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#9B7A2B]">Verified Feedback</span>
              <h2 className="text-3xl font-normal text-[#1C1712] m-0 mt-1">Customer Reviews</h2>
            </div>
            <div className="font-mono text-xs font-bold bg-[#FAF7F2] border border-[#EAE2D5] px-4 py-2 rounded-full">
              ★ {product.rating || 4.9} / 5.0 Rating
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviewsList.map((rev, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-[#EAE2D5] space-y-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[#1C1712]">{rev.author}</span>
                  <span className="font-mono text-[10px] text-[#75695C]">{rev.date}</span>
                </div>
                <div className="flex text-[#C8A24F]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#C8A24F]" />
                  ))}
                </div>
                <p className="text-xs text-[#75695C] leading-relaxed m-0">{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}