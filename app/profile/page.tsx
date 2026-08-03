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
  ArrowUpRight
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
      <div className="min-h-screen bg-neutral-50 text-black font-sans">
        <Navbar />
        <main className="max-w-5xl mx-auto p-6 text-center py-24">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest font-bold">Retrieving Dossier & Acquisition Receipts...</p>
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

  return (
    <div className="min-h-screen bg-neutral-50 text-black font-sans selection:bg-black selection:text-white pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Header Profile Info */}
        <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center border-2 border-black shrink-0">
              <UserIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Verified Account Dossier
              </span>
              <h1 className="text-3xl font-black font-serif uppercase tracking-tight">{user.name}</h1>
              <p className="font-mono text-xs text-neutral-600">{user.email}</p>
            </div>
          </div>

          <div className="bg-neutral-100 border-2 border-black px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" />
            <span>High Roller Status</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Streak */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className="p-3 bg-black text-white border border-black shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">Current Streak</p>
              <h3 className="text-2xl font-black font-mono">{user.streakCount || 0} DAYS</h3>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className="p-3 bg-black text-white border border-black shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">Total Spent</p>
              <h3 className="text-2xl font-black font-mono">${(user.totalSpent || 0).toLocaleString()}</h3>
            </div>
          </div>

          {/* Total Receipts */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className="p-3 bg-black text-white border border-black shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">Total Receipts</p>
              <h3 className="text-2xl font-black font-mono">{orders.length} ORDERS</h3>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <section className="space-y-6">
          <div className="border-b-2 border-black pb-3 flex justify-between items-end">
            <h2 className="text-2xl font-black font-serif uppercase tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-black" /> Order Receipts
            </h2>
            <span className="font-mono text-xs font-bold uppercase bg-black text-white px-3 py-1">
              {orders.length} TOTAL
            </span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
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
                    className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all"
                  >
                    {/* Receipt Header Bar */}
                    <div 
                      onClick={() => toggleOrder(order._id)}
                      className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${
                        isExpanded ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-black text-white border border-black">
                          <Cloud className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-base uppercase">Receipt #{order._id.substring(0, 8)}</span>
                            <span className="font-mono text-[10px] bg-white text-black px-2 py-0.5 font-bold uppercase border border-black">
                              {order.deliveryStatus || 'DELIVERED TO VAULT'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formattedDate}</span>
                            <span>• {order.items?.length || 0} ITEMS</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xl font-black text-black">${order.totalAmount?.toLocaleString()}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-black" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-black" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Itemized List */}
                    {isExpanded && (
                      <div className="border-t-2 border-black bg-neutral-50 p-5 space-y-3">
                        <p className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                          Itemized Breakdown
                        </p>
                        <div className="space-y-2">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-3 border border-black">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img src={item.image} alt={item.title} className="w-10 h-10 object-cover border border-black" />
                                )}
                                <span className="font-serif font-bold text-sm uppercase">{item.title}</span>
                              </div>
                              <span className="font-mono font-bold text-sm text-black">${item.price?.toLocaleString()}</span>
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
            <div className="bg-white border-2 border-dashed border-black p-12 text-center space-y-4">
              <Package className="w-12 h-12 text-black mx-auto" />
              <div className="space-y-1">
                <p className="font-serif font-bold text-xl uppercase">No Receipts Found</p>
                <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                  Head over to the catalog feed, add items to your bag, and complete a fake checkout!
                </p>
              </div>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
              >
                Browse Catalog <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}