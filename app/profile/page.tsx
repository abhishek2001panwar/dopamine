'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { 
  User as UserIcon, 
  Flame, 
  DollarSign, 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Cloud, 
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Award,
  Zap
} from 'lucide-react';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProfileData(data);
        }
      })
      .catch((err) => console.error('Failed to load profile:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] font-sans">
        <Navbar />
        <main className="max-w-5xl mx-auto p-6 text-center py-32 space-y-4">
          <div className="w-10 h-10 border-2 border-[#C8A24F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-widest font-bold text-[#75695C] m-0">
            Retrieving High-Roller Dossier & Vault Receipts...
          </p>
        </main>
      </div>
    );
  }

  const user = profileData?.user || {
    name: 'Window Shopper',
    email: 'shopper@dopacart.com',
    streakCount: 0,
    totalSpent: 0,
  };

  const orders = Array.isArray(profileData?.orders) ? profileData.orders : [];

  const toggleOrder = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  // Calculate Gamified Tier Rank Progress
  const totalSpent = user.totalSpent || 0;
  const nextTierThreshold = totalSpent < 10000 ? 10000 : totalSpent < 50000 ? 50000 : 100000;
  const progressPercent = Math.min(Math.round((totalSpent / nextTierThreshold) * 100), 100);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white pb-24 antialiased overflow-x-hidden">
      <Navbar />

      <main className="w-full px-6 md:px-16 pt-8 space-y-12 max-w-7xl mx-auto">
        {/* Header Profile Info & VIP Card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/90 p-8 md:p-12 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-6 z-10">
            <div className="w-20 h-20 bg-[#1C1712] text-[#F8F3EB] rounded-full flex items-center justify-center border-2 border-[#C8A24F] shrink-0 shadow-lg">
              <UserIcon className="w-9 h-9 text-[#C8A24F]" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B]">
                Verified Collector Dossier
              </span>
              <h1 className="text-4xl font-normal text-[#1C1712] m-0 tracking-tight">
                {user.name}
              </h1>
              <p className="font-mono text-xs text-[#75695C] m-0">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 z-10">
            <div className="bg-[#FAF7F2] border border-[#EAE2D5] px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#C8A24F] animate-pulse" />
              <span className="text-[#1C1712]">High Roller Status</span>
            </div>
            <span className="font-mono text-[11px] text-[#75695C] uppercase tracking-wider">
              VIP Pass Enabled
            </span>
          </div>
        </div>

        {/* Gamified Tier Progress Bar */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/90 p-8 rounded-[36px] shadow-[0_20px_40px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex justify-between items-center font-mono text-xs uppercase tracking-wider">
            <span className="font-bold text-[#1C1712] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#C8A24F]" /> Collector Tier Level
            </span>
            <span className="font-bold text-[#9B7A2B]">
              ${totalSpent.toLocaleString()} / ${nextTierThreshold.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-3 bg-[#FAF7F2] rounded-full border border-[#EAE2D5] overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-[#C8A24F] to-[#9B7A2B] rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center font-mono text-[10px] text-[#75695C] uppercase tracking-widest">
            <span>Current: Executive Flex</span>
            <span>Next Rank: Billionaire Archive ({progressPercent}%)</span>
          </div>
        </div>

        {/* Stats Flex Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Active Streak */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-8 rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 flex items-center gap-5">
            <div className="p-4 bg-[#F8F3EB] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#75695C] m-0">Current Streak</p>
              <h3 className="text-3xl font-normal text-[#1C1712] m-0">{user.streakCount || 0} DAYS</h3>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-8 rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 flex items-center gap-5">
            <div className="p-4 bg-[#F8F3EB] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#75695C] m-0">Capital Deployed</p>
              <h3 className="text-3xl font-normal text-[#1C1712] m-0">${(user.totalSpent || 0).toLocaleString()}</h3>
            </div>
          </div>

          {/* Total Receipts */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-8 rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 flex items-center gap-5">
            <div className="p-4 bg-[#F8F3EB] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#75695C] m-0">Acquisitions</p>
              <h3 className="text-3xl font-normal text-[#1C1712] m-0">{orders.length} ORDERS</h3>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <section className="space-y-8">
          <div className="border-b border-[#EAE2D5] pb-5 flex justify-between items-end">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#9B7A2B]">
                Vault Transactions
              </span>
              <h2 className="text-4xl font-normal text-[#1C1712] flex items-center gap-3 mt-1 m-0">
                <Package className="w-8 h-8 text-[#C8A24F]" /> Acquisition Receipts
              </h2>
            </div>
            <span className="font-mono text-xs font-bold uppercase bg-[#1C1712] text-white px-4 py-1.5 rounded-full tracking-widest shadow-sm">
              {orders.length} TOTAL
            </span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-5">
              {orders.map((order: any) => {
                const isExpanded = expandedOrder === order._id;
                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div 
                    key={order._id}
                    className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300"
                  >
                    {/* Receipt Header Bar */}
                    <div 
                      onClick={() => toggleOrder(order._id)}
                      className={`p-6 sm:p-8 flex items-center justify-between cursor-pointer transition-colors ${
                        isExpanded ? 'bg-[#F8F3EB]/60' : 'hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-3.5 bg-[#1C1712] text-white rounded-2xl shrink-0 shadow-sm">
                          <Cloud className="w-5 h-5 text-[#C8A24F]" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-normal text-[#1C1712] m-0">
                              Receipt #{order._id.substring(0, 8)}
                            </h3>
                            <span className="font-mono text-[10px] bg-[#C8A24F] text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                              {order.deliveryStatus || 'DELIVERED TO VAULT'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-xs text-[#75695C] mt-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#9B7A2B]" />
                            <span>{formattedDate}</span>
                            <span>• {order.items?.length || 0} ITEMS</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <h4 className="text-2xl font-normal text-[#1C1712] m-0">
                          ${order.totalAmount?.toLocaleString()}
                        </h4>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[#1C1712]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#1C1712]" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Itemized List */}
                    {isExpanded && (
                      <div className="border-t border-[#EAE2D5] bg-[#FAF7F2]/60 p-6 sm:p-8 space-y-4">
                        <p className="font-mono text-[10px] font-bold text-[#9B7A2B] uppercase tracking-widest m-0">
                          Itemized Breakdown
                        </p>
                        <div className="space-y-3">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-white/80 p-4 rounded-2xl border border-[#EAE2D5] shadow-sm">
                              <div className="flex items-center gap-4">
                                {item.image && (
                                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-xl border border-[#EAE2D5]" />
                                )}
                                <h4 className="text-lg font-normal text-[#1C1712] m-0">{item.title}</h4>
                              </div>
                              <span className="font-mono font-bold text-base text-[#9B7A2B]">${item.price?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[40px] p-16 text-center space-y-5 shadow-sm">
              <div className="w-16 h-16 bg-[#F8F3EB] rounded-full flex items-center justify-center mx-auto border border-[#EAE2D5]">
                <Package className="w-8 h-8 text-[#9B7A2B]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-normal text-[#1C1712] m-0">No Receipts Found</h3>
                <p className="font-mono text-xs text-[#75695C] uppercase tracking-widest max-w-sm mx-auto m-0">
                  Head over to the catalog feed, add items to your bag, and complete a virtual checkout!
                </p>
              </div>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 active:scale-95"
              >
                Browse Catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}