'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import Link from 'next/link';
import { 
  Shirt, 
  Sparkles, 
  Share2, 
  Plus, 
  X, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WardrobeItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  category?: string;
  selectedSize?: string;
  purchasedAt?: string;
  orderId?: string;
}

const CATEGORIES = ['All Archives', 'Outerwear', 'Tops', 'Bottoms', 'Footwear', 'Timepieces', 'General'];

export default function ClosetPage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Archives');
  const [activeCapsule, setActiveCapsule] = useState<WardrobeItem[]>([]);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    fetch('/api/user/closet', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setItems(data.items);
        }
      })
      .catch((err) => console.error('Error loading closet:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter items by category
  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'All Archives') return true;
    const cat = item.category || 'General';
    return cat.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Toggle item inside outfit capsule (Max 4 items)
  const toggleCapsuleItem = (item: WardrobeItem) => {
    const exists = activeCapsule.some((i) => i._id === item._id);
    if (exists) {
      setActiveCapsule(activeCapsule.filter((i) => i._id !== item._id));
    } else {
      if (activeCapsule.length >= 4) {
        alert('Outfit capsule limit reached! Maximum 4 pieces per outfit flex.');
        return;
      }
      setActiveCapsule([...activeCapsule, item]);
    }
  };

  const handleShareOutfit = () => {
    if (activeCapsule.length === 0) return;

    const capsuleTotal = activeCapsule.reduce((sum, item) => sum + (item.price || 0), 0);
    const text = `🔥 DopaCart Outfit Capsule Flex — Total Value: $${capsuleTotal.toLocaleString()} \n\nFeaturing: ${activeCapsule.map(i => i.title).join(', ')}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C8A24F', '#1C1712', '#FFFFFF'],
      });
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] font-sans">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-32 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#C8A24F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-widest font-bold text-[#75695C] m-0">
            Unlocking Digital Vault Wardrobe Archive...
          </p>
        </main>
      </div>
    );
  }

  const capsuleTotalVal = activeCapsule.reduce((sum, i) => sum + (i.price || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white pb-24 antialiased overflow-x-hidden font-sans">
      <Navbar />

      <main className="w-full px-4 sm:px-8 md:px-16 pt-6 sm:pt-8 space-y-8 sm:space-y-12 max-w-7xl mx-auto">
        {/* Header Header */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/90 p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1.5 z-10">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#9B7A2B] flex items-center gap-1.5">
              <Shirt className="w-4 h-4 text-[#C8A24F]" /> Personal Vault Archive
            </span>
            <h1 className="text-3xl sm:text-5xl font-normal text-[#1C1712] m-0 tracking-tight">
              Wardrobe Closet
            </h1>
            <p className="font-mono text-xs text-[#75695C] m-0">
              {items.length} Acquired Pieces • ${items.reduce((s, i) => s + (i.price || 0), 0).toLocaleString()} Total Asset Value
            </p>
          </div>

          <div className="font-mono text-xs bg-[#1C1712] text-white px-5 py-2.5 rounded-full font-bold uppercase tracking-widest shadow-sm">
            {items.length} ARCHIVED PIECES
          </div>
        </div>

        {/* Outfit Flex Capsule Builder Banner */}
        <section className="bg-[#1C1712] text-[#F8F3EB] border border-[#C8A24F]/40 p-6 sm:p-8 rounded-[32px] shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C8A24F]/20 pb-4 z-10 relative">
            <div>
              <span className="font-mono text-[10px] text-[#C8A24F] font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Outfit Flex Capsule Builder
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal text-white m-0 mt-0.5">
                Assemble Outfit Outfit (Max 4 Pieces)
              </h2>
            </div>

            {activeCapsule.length > 0 && (
              <button
                onClick={handleShareOutfit}
                className="px-6 py-3 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-lg flex items-center gap-2 shrink-0 active:scale-95"
              >
                {copiedShare ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Flex Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Copy Flex Capsule (${capsuleTotalVal.toLocaleString()})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Selected Capsule Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 z-10 relative">
            {[0, 1, 2, 3].map((slotIndex) => {
              const slotItem = activeCapsule[slotIndex];
              return (
                <div
                  key={slotIndex}
                  className="bg-white/5 border border-white/10 rounded-2xl p-3 h-36 flex flex-col items-center justify-center text-center relative overflow-hidden"
                >
                  {slotItem ? (
                    <>
                    <img
  src={slotItem.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85'}
  alt={slotItem.title}
  className="w-full h-full object-cover"
  onError={(e) => {
    // If external Unsplash image link breaks, set fallback
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85';
  }}
/>
                      <span className="font-mono text-[10px] text-white font-bold truncate w-full">
                        {slotItem.title}
                      </span>
                      <button
                        onClick={() => toggleCapsuleItem(slotItem)}
                        className="absolute top-2 right-2 p-1 bg-[#1C1712]/80 text-white hover:text-red-400 rounded-full"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-white/40 space-y-1 font-mono text-[10px] uppercase">
                      <Plus className="w-5 h-5 mx-auto" />
                      <span>Select Piece Below</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full border transition-all whitespace-nowrap font-bold uppercase tracking-wider ${
                selectedCategory === cat
                  ? 'bg-[#1C1712] text-[#C8A24F] border-[#1C1712] shadow-md'
                  : 'bg-white border-[#EAE2D5] text-[#1C1712] hover:border-[#C8A24F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Archive Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => {
              const inCapsule = activeCapsule.some((i) => i._id === item._id);

              return (
                <div
                  key={idx}
                  className={`bg-white/70 backdrop-blur-2xl border rounded-[28px] overflow-hidden shadow-sm transition-all duration-300 flex flex-col justify-between ${
                    inCapsule ? 'border-[#C8A24F] ring-2 ring-[#C8A24F]/50' : 'border-white/90 hover:border-[#C8A24F]'
                  }`}
                >
                  <div className="h-60 bg-[#F8F3EB] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#1C1712] text-white font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      {item.category || 'Luxury'}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-normal text-xl text-[#1C1712] m-0 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex justify-between items-center font-mono text-xs text-[#75695C] mt-1">
                        <span>Size: {item.selectedSize || 'Standard'}</span>
                        <span className="font-bold text-[#9B7A2B]">${item.price?.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCapsuleItem(item)}
                      className={`w-full py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                        inCapsule
                          ? 'bg-[#1C1712] text-[#C8A24F]'
                          : 'bg-[#FAF7F2] hover:bg-[#C8A24F] hover:text-white border border-[#EAE2D5] text-[#1C1712]'
                      }`}
                    >
                      {inCapsule ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#C8A24F]" /> Added to Flex
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Add to Capsule
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[36px] p-16 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-[#F8F3EB] rounded-full flex items-center justify-center mx-auto border border-[#EAE2D5]">
              <Layers className="w-8 h-8 text-[#9B7A2B]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-normal text-[#1C1712] m-0">No Archive Items Found</h3>
              <p className="font-mono text-xs text-[#75695C] uppercase tracking-widest max-w-sm mx-auto m-0">
                You haven't acquired any pieces in this category yet.
              </p>
            </div>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 active:scale-95"
            >
              Acquire Pieces <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}