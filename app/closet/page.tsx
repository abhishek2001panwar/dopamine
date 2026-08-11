'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { FlexCardModal } from '../components/FlexCardModal';
import { Shirt, Sparkles, Tag, Check, ArrowRight, PackageCheck, DollarSign } from 'lucide-react';

interface ClosetItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  tag?: string;
}

export default function ClosetPage() {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [userProfile, setUserProfile] = useState<{ name: string; totalSpent: number; streakCount: number; badgeCount: number }>({
    name: 'Baller',
    totalSpent: 0,
    streakCount: 0,
    badgeCount: 0,
  });
  const [stats, setStats] = useState({ totalItems: 0, totalValue: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [equippedIds, setEquippedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/closet')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.items || []);
          setStats(data.stats || { totalItems: 0, totalValue: 0, totalOrders: 0 });
          if (data.user) {
            setUserProfile({
              name: data.user.name || 'Anonymous Baller',
              totalSpent: data.user.totalSpent || 0,
              streakCount: data.user.streakCount || 0,
              badgeCount: Array.isArray(data.user.unlockedBadges) ? data.user.unlockedBadges.length : 0,
            });
          }
        }
      })
      .catch((err) => console.error('Failed to load closet:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.tag || 'General')))];

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter((i) => (i.tag || 'General') === activeCategory);

  const toggleEquip = (id: string) => {
    setEquippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const equippedItemsList = items.filter((i) => equippedIds[i._id]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white pb-24 antialiased overflow-x-hidden">
      <Navbar />

      <main className="w-full px-6 md:px-16 pt-8 space-y-12 max-w-8xl mx-auto font-sans">
        {/* Banner Header with Flex Card Trigger */}
        <div className="bg-[#1C1712] text-[#F8F3EB] border border-[#C8A24F]/40 p-8 md:p-12 rounded-[44px] shadow-[0_25px_60px_rgba(0,0,0,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-[#C8A24F] border border-[#C8A24F]/30 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A24F]" /> Personal Vault Archive
            </span>
            <h1 className="text-4xl md:text-5xl font-normal text-white m-0 tracking-tight">
              Your Digital Closet
            </h1>
            <p className="font-mono text-xs text-[#75695C] uppercase leading-relaxed m-0">
              Equip your items to update your active drip status and export your verified high-roller flex card.
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <FlexCardModal user={userProfile} equippedItems={equippedItemsList} />
          </div>
        </div>

        {/* Collection Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-8 rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 flex items-center gap-5">
            <div className="p-4 bg-[#F8F3EB] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <Shirt className="w-7 h-7" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold text-[#75695C] uppercase tracking-widest m-0">Collected Items</p>
              <h3 className="text-3xl font-normal text-[#1C1712] m-0">{stats.totalItems}</h3>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-8 rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 flex items-center gap-5">
            <div className="p-4 bg-[#F8F3EB] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold text-[#75695C] uppercase tracking-widest m-0">Wardrobe Valuation</p>
              <h3 className="text-3xl font-normal text-[#1C1712] m-0">${stats.totalValue.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-8 rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 flex items-center gap-5">
            <div className="p-4 bg-[#F8F3EB] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <PackageCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold text-[#75695C] uppercase tracking-widest m-0">Total Receipts</p>
              <h3 className="text-3xl font-normal text-[#1C1712] m-0">{stats.totalOrders}</h3>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        {!loading && items.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none ">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#C8A24F] text-white shadow-md shadow-[#C8A24F]/20'
                    : 'bg-white/80 text-[#1C1712] border border-[#EAE2D5] hover:border-[#C8A24F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Closet Grid */}
        {loading ? (
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[40px] p-16 text-center space-y-4 shadow-sm">
            <div className="w-10 h-10 border-2 border-[#C8A24F] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs uppercase tracking-widest font-bold text-[#75695C] m-0">Opening Archive Vault...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const isEquipped = !!equippedIds[item._id];
              return (
                <div
                  key={item._id}
                  className={`bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[36px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(200,162,79,0.12)] transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between group ${
                    isEquipped ? 'border-[#C8A24F] ring-2 ring-[#C8A24F]/30' : ''
                  }`}
                >
                  <div>
                    {/* Image Header */}
                    <div className="h-64 bg-[#F8F3EB] relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      {item.tag && (
                        <span className="absolute top-4 left-4 bg-[#1C1712] text-white px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                          <Tag className="w-3 h-3 text-[#C8A24F]" /> {item.tag}
                        </span>
                      )}

                      {isEquipped && (
                        <span className="absolute top-4 right-4 bg-[#C8A24F] text-white px-3.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-md">
                          <Check className="w-3 h-3 text-white" /> EQUIPPED
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-1">
                      <h3 className="text-2xl font-normal text-[#1C1712] line-clamp-1 m-0">{item.title}</h3>
                      <p className="font-mono text-base font-bold text-[#9B7A2B] m-0">${item.price?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => toggleEquip(item._id)}
                      className={`w-full py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        isEquipped
                          ? 'bg-white text-[#1C1712] border border-[#EAE2D5] hover:bg-[#FAF7F2] shadow-sm'
                          : 'bg-[#C8A24F] hover:bg-[#B38C3B] text-white shadow-md shadow-[#C8A24F]/20'
                      }`}
                    >
                      {isEquipped ? 'Unequip Item' : 'Equip / Wear'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[40px] p-16 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 bg-[#F8F3EB] rounded-full flex items-center justify-center mx-auto border border-[#EAE2D5]">
              <Shirt className="w-8 h-8 text-[#9B7A2B]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-normal text-[#1C1712] m-0">Your Wardrobe is Empty</h3>
              <p className="font-mono text-xs text-[#75695C] uppercase tracking-widest max-w-sm mx-auto m-0">
                Complete a purchase on the catalog feed using your Fake Bucks to populate your personal archive!
              </p>
            </div>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 active:scale-95"
            >
              Explore Feed & Shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}