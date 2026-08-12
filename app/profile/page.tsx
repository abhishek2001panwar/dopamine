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
  Trophy,
  Download
} from 'lucide-react';
import { OrderTracker } from '../components/OrderTracker';
import { DigitalVaultCard } from '../components/DigitalVaultCard';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/profile', { credentials: 'include' })
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
        <main className="max-w-5xl mx-auto px-4 text-center py-24 sm:py-32 space-y-4">
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

  // Gamified Tier Progress
  const totalSpent = user.totalSpent || 0;
  const nextTierThreshold = totalSpent < 10000 ? 10000 : totalSpent < 50000 ? 50000 : 100000;
  const progressPercent = Math.min(Math.round((totalSpent / nextTierThreshold) * 100), 100);

  // PDF Receipt Print Helper
  const handleDownloadReceipt = (order: any, e: React.MouseEvent) => {
    e.stopPropagation();

    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>DopaCart Receipt #${order._id.substring(0, 8)}</title>

          <style>
            body { font-family: monospace; background: #FAF7F2; color: #1C1712; padding: 20px; margin: 0; }
            .container { max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 20px; border: 1px solid #EAE2D5; }
            .header { border-bottom: 2px solid #C8A24F; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 20px; font-weight: bold; }
            .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #FAF7F2; font-size: 14px; }
            .total { border-top: 2px solid #1C1712; margin-top: 20px; padding-top: 15px; font-size: 16px; font-weight: bold; display: flex; justify-content: space-between; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #75695C; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                <div class="title">DopaCart® Vault Receipt</div>
                <div>ID: #${order._id}</div>
              </div>
              <div>Date: ${formattedDate}</div>
            </div>
            
            <h3>Itemized Breakdown</h3>
            ${order.items?.map((item: any) => `
              <div class="item-row">
                <span>${item.title} (${item.selectedSize || 'Std'})</span>
                <span>$${(item.price || 0).toLocaleString()}</span>
              </div>
            `).join('')}

            <div class="total">
              <span>Total Deployed Capital</span>
              <span>$${(order.totalAmount || 0).toLocaleString()}</span>
            </div>

            <div class="footer">
              <p>Simulated Digital Transaction • Zero Real Money Exchanged</p>
              <p>DopaCart Luxury Vault Protocol</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white pb-24 antialiased overflow-x-hidden font-sans">
      <Navbar />

      <main className="w-full px-4 sm:px-8 md:px-16 pt-6 sm:pt-8 space-y-8 sm:space-y-12 max-w-7xl mx-auto">
        {/* Header Profile Info */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/90 p-6 sm:p-10 md:p-12 rounded-[28px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#C8A24F]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 sm:gap-6 z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1C1712] text-[#F8F3EB] rounded-full flex items-center justify-center border-2 border-[#C8A24F] shrink-0 shadow-lg">
              <UserIcon className="w-7 h-7 sm:w-9 sm:h-9 text-[#C8A24F]" />
            </div>
            <div className="space-y-0.5 sm:space-y-1 min-w-0">
              <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B]">
                Verified Collector Dossier
              </span>
              <h1 className="text-2xl sm:text-4xl font-normal text-[#1C1712] m-0 tracking-tight truncate">
                {user.name}
              </h1>
              <p className="font-mono text-[11px] sm:text-xs text-[#75695C] m-0 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2.5 z-10 pt-2 md:pt-0 border-t md:border-t-0 border-[#EAE2D5]/60">
            <div className="bg-[#FAF7F2] border border-[#EAE2D5] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8A24F] animate-pulse" />
              <span className="text-[#1C1712]">High Roller</span>
            </div>
            <span className="font-mono text-[10px] sm:text-[11px] text-[#75695C] uppercase tracking-wider">
              VIP Pass Enabled
            </span>
          </div>
        </div>

        <DigitalVaultCard 
    userName={user.name} 
    email={user.email} 
  />

        {/* Gamified Tier Progress Bar */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/90 p-5 sm:p-8 rounded-[24px] sm:rounded-[36px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center font-mono text-[11px] sm:text-xs uppercase tracking-wider">
            <span className="font-bold text-[#1C1712] flex items-center gap-1.5 sm:gap-2">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8A24F]" /> Collector Tier Level
            </span>
            <span className="font-bold text-[#9B7A2B]">
              ${totalSpent.toLocaleString()} / ${nextTierThreshold.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2.5 sm:h-3 bg-[#FAF7F2] rounded-full border border-[#EAE2D5] overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-[#C8A24F] to-[#9B7A2B] rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-[#75695C] uppercase tracking-widest">
            <span>Executive Flex</span>
            <span>Billionaire Archive ({progressPercent}%)</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-[0_10px_25px_rgba(0,0,0,0.02)] sm:hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 flex items-center gap-4 sm:gap-5">
            <div className="p-3 sm:p-4 bg-[#F8F3EB] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#75695C] m-0">Current Streak</p>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#1C1712] m-0">{user.streakCount || 0} DAYS</h3>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-[0_10px_25px_rgba(0,0,0,0.02)] sm:hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 flex items-center gap-4 sm:gap-5">
            <div className="p-3 sm:p-4 bg-[#F8F3EB] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <DollarSign className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#75695C] m-0">Capital Deployed</p>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#1C1712] m-0">${(user.totalSpent || 0).toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-[0_10px_25px_rgba(0,0,0,0.02)] sm:hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 flex items-center gap-4 sm:gap-5">
            <div className="p-3 sm:p-4 bg-[#F8F3EB] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <Package className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#75695C] m-0">Acquisitions</p>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#1C1712] m-0">{orders.length} ORDERS</h3>
            </div>
          </div>
        </div>

        {/* Order History & Tracking Section */}
        <section className="space-y-6 sm:space-y-8">
          <div className="border-b border-[#EAE2D5] pb-4 sm:pb-5 flex justify-between items-end">
            <div>
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#9B7A2B]">
                Vault Transactions & Tracking
              </span>
              <h2 className="text-2xl sm:text-4xl font-normal text-[#1C1712] flex items-center gap-2.5 mt-0.5 m-0">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-[#C8A24F]" /> Acquisition Receipts
              </h2>
            </div>
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase bg-[#1C1712] text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full tracking-widest shadow-sm">
              {orders.length} TOTAL
            </span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4 sm:space-y-5">
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
                    className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[24px] sm:rounded-[32px] shadow-[0_10px_25px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300"
                  >
                    {/* Header Bar */}
                    <div 
                      onClick={() => toggleOrder(order._id)}
                      className={`p-4 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors ${
                        isExpanded ? 'bg-[#F8F3EB]/60' : 'hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 sm:gap-5">
                        <div className="p-2.5 sm:p-3.5 bg-[#1C1712] text-white rounded-xl sm:rounded-2xl shrink-0 shadow-sm">
                          <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A24F]" />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <h3 className="text-lg sm:text-xl font-normal text-[#1C1712] m-0">
                              Receipt #{order._id.substring(0, 8)}
                            </h3>
                            <span className="font-mono text-[9px] sm:text-[10px] bg-[#C8A24F] text-white px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold uppercase tracking-wider">
                              {order.deliveryStatus || 'DELIVERED TO VAULT'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-[#75695C]">
                            <Clock className="w-3 h-3 text-[#9B7A2B]" />
                            <span>{formattedDate}</span>
                            <span>• {order.items?.length || 0} ITEMS</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE2D5]/60">
                        <button
                          onClick={(e) => handleDownloadReceipt(order, e)}
                          className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-white hover:bg-[#FAF7F2] border border-[#EAE2D5] text-[#1C1712] font-mono text-[10px] sm:text-xs font-bold uppercase rounded-full shadow-sm transition-all"
                        >
                          <Download className="w-3 h-3 text-[#C8A24F]" /> PDF Receipt
                        </button>

                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-normal text-[#1C1712] m-0">
                            ${order.totalAmount?.toLocaleString()}
                          </h4>

                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C1712]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C1712]" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Receipt Details & Shipping Timeline */}
                    {isExpanded && (
                      <div className="border-t border-[#EAE2D5] bg-[#FAF7F2]/60 p-4 sm:p-8 space-y-6 sm:space-y-8 animate-fadeIn">
                        {/* Real Carrier Shipping Tracker */}
                        <OrderTracker
                          orderId={order._id}
                          createdAt={order.createdAt}
                          itemsCount={order.items?.length || 0}
                        />

                        {/* Itemized Breakdown */}
                        <div className="space-y-2.5 sm:space-y-3">
                          <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#9B7A2B] uppercase tracking-widest block">
                            Itemized Acquisition Breakdown
                          </span>

                          <div className="space-y-2.5 sm:space-y-3">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#EAE2D5] shadow-sm">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                  {item.image && (
                                    <img src={item.image} alt={item.title} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg sm:rounded-xl border border-[#EAE2D5] shrink-0" />
                                  )}
                                  <div className="min-w-0">
                                    <h4 className="text-sm sm:text-lg font-normal text-[#1C1712] m-0 truncate">{item.title}</h4>
                                    <span className="font-mono text-[9px] sm:text-[10px] text-[#75695C] block">
                                      Size: {item.selectedSize || 'Standard'}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-mono font-bold text-sm sm:text-base text-[#9B7A2B] shrink-0 pl-2">
                                  ${item.price?.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[28px] sm:rounded-[40px] p-8 sm:p-16 text-center space-y-4 sm:space-y-5 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#F8F3EB] rounded-full flex items-center justify-center mx-auto border border-[#EAE2D5]">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-[#9B7A2B]" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="text-2xl sm:text-3xl font-normal text-[#1C1712] m-0">No Receipts Found</h3>
                <p className="font-mono text-[11px] sm:text-xs text-[#75695C] uppercase tracking-widest max-w-sm mx-auto m-0">
                  Head over to the catalog feed, add items to your bag, and complete a virtual checkout!
                </p>
              </div>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-7 py-3 sm:px-8 sm:py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 active:scale-95"
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