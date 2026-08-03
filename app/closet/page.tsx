'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { FlexCardModal } from '../components/FlexCardModal';
import { Shirt, Sparkles, Tag, Check, ArrowUpRight, PackageCheck, DollarSign } from 'lucide-react';

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
    <div className="min-h-screen bg-neutral-50 text-black font-sans selection:bg-black selection:text-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 space-y-10">
        {/* Banner Header with Flex Card Trigger */}
        <div className="bg-black text-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="max-w-xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-black font-mono text-[10px] font-bold uppercase tracking-widest border border-white">
              <Sparkles className="w-3.5 h-3.5 text-black" /> Personal Vault Archive
            </span>
            <h1 className="text-4xl font-black font-serif uppercase tracking-tight">Your Digital Closet</h1>
            <p className="font-mono text-xs text-neutral-400 uppercase leading-relaxed">
              Equip your items to update your active drip status and export your verified high-roller flex card.
            </p>
          </div>

          <FlexCardModal user={userProfile} equippedItems={equippedItemsList} />
        </div>

        {/* Collection Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className="p-3 bg-black text-white border border-black shrink-0">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Collected Items</p>
              <p className="text-2xl font-black text-black">{stats.totalItems}</p>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className="p-3 bg-black text-white border border-black shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Wardrobe Valuation</p>
              <p className="text-2xl font-black text-black">${stats.totalValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className="p-3 bg-black text-white border border-black shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Receipts</p>
              <p className="text-2xl font-black text-black">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        {!loading && items.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 border-2 border-black text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Closet Grid */}
        {loading ? (
          <div className="bg-white border-2 border-black p-16 text-center space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-600">Opening Archive Vault...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const isEquipped = !!equippedIds[item._id];
              return (
                <div
                  key={item._id}
                  className={`bg-white border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between group ${
                    isEquipped ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <div className="h-56 bg-neutral-100 relative overflow-hidden border-b-2 border-black">
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        isEquipped ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
                      }`}
                    />

                    {item.tag && (
                      <span className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest border border-black flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {item.tag}
                      </span>
                    )}

                    {isEquipped && (
                      <span className="absolute top-3 right-3 bg-white text-black px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest border border-black flex items-center gap-1">
                        <Check className="w-3 h-3 text-black" /> EQUIPPED
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-black text-lg uppercase tracking-tight line-clamp-1">{item.title}</h3>
                      <p className="font-mono text-black font-black text-sm mt-1">${item.price?.toLocaleString()}</p>
                    </div>

                    <button
                      onClick={() => toggleEquip(item._id)}
                      className={`w-full py-3 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-black transition-all active:translate-y-0.5 ${
                        isEquipped
                          ? 'bg-neutral-100 text-black hover:bg-neutral-200'
                          : 'bg-black text-white hover:bg-neutral-800'
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
          <div className="bg-white border-2 border-dashed border-black p-16 text-center space-y-4">
            <Shirt className="w-12 h-12 text-black mx-auto" />
            <div className="space-y-1">
              <h2 className="font-serif font-black text-2xl uppercase tracking-tight">Your Wardrobe is Empty</h2>
              <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest max-w-sm mx-auto">
                Complete a purchase on the catalog feed using your Fake Bucks to populate your personal archive!
              </p>
            </div>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors border border-black"
            >
              Explore Feed & Shop <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}