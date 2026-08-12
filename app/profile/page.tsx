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
  Clock,
  Sparkles,
  ArrowRight,
  Trophy,
  Download,
  ShieldCheck,
  CheckCircle2
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
            Retrieving Collector Dossier & Receipts...
          </p>
        </main>
      </div>
    );
  }

  const user = profileData?.user || {
    name: 'Verified Collector',
    email: 'collector@dopacart.com',
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
            body { font-family: monospace; background: #FAF7F2; color: #1C1712; padding: 30px; margin: 0; }
            .container { max-width: 600px; margin: auto; background: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid #EAE2D5; shadow: 0 10px 30px rgba(0,0,0,0.05); }
            .header { border-bottom: 2px solid #C8A24F; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 22px; font-weight: bold; }
            .item-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #FAF7F2; font-size: 14px; }
            .total { border-top: 2px solid #1C1712; margin-top: 25px; padding-top: 18px; font-size: 18px; font-weight: bold; display: flex; justify-content: space-between; }
            .footer { margin-top: 35px; text-align: center; font-size: 11px; color: #75695C; }
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
              <span>Total Capital Deployed</span>
              <span>$${(order.totalAmount || 0).toLocaleString()}</span>
            </div>

            <div class="footer">
              <p>Simulated Digital Transaction • Zero Real Dollars Required</p>
              <p>DopaCart Infinite Black Card Settlement</p>
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

      <main className="w-full px-4 sm:px-8 md:px-16 pt-8 space-y-10 max-w-6xl mx-auto">
        
        {/* --- HEADER PROFILE CARD --- */}
        <div className="bg-white border border-[#EAE2D5] p-6 sm:p-10 rounded-[32px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1C1712] text-[#F8F3EB] rounded-full flex items-center justify-center border-2 border-[#C8A24F] shrink-0 shadow-md">
              <UserIcon className="w-8 h-8 text-[#C8A24F]" />
            </div>
            <div className="space-y-1 min-w-0">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B] block">
                Verified Collector Dossier
              </span>
              <h1 className="text-2xl sm:text-4xl font-normal text-[#1C1712] m-0 tracking-tight truncate">
                {user.name}
              </h1>
              <p className="font-mono text-xs text-[#75695C] m-0 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EAE2D5]">
            <div className="bg-[#FAF7F2] border border-[#EAE2D5] px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A24F]" />
              <span className="text-[#1C1712]">High Roller</span>
            </div>
            <span className="font-mono text-[10px] text-[#75695C] uppercase tracking-wider">
              2FA Vault Active
            </span>
          </div>
        </div>

        {/* --- PROTECTED DIGITAL VAULT CARD --- */}
        <DigitalVaultCard 
          userName={user.name} 
          email={user.email} 
        />

        {/* --- TIER PROGRESS BAR --- */}
        <div className="bg-white border border-[#EAE2D5] p-6 sm:p-8 rounded-[28px] shadow-sm space-y-3">
          <div className="flex justify-between items-center font-mono text-xs uppercase">
            <span className="font-bold text-[#1C1712] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#C8A24F]" /> Collector Tier Level
            </span>
            <span className="font-bold text-[#9B7A2B]">
              ${totalSpent.toLocaleString()} / ${nextTierThreshold.toLocaleString()}
            </span>
          </div>
          
          <div className="w-full h-2.5 bg-[#FAF7F2] rounded-full border border-[#EAE2D5] overflow-hidden p-0.5">
            <div 
              className="h-full bg-[#C8A24F] rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center font-mono text-[10px] text-[#75695C] uppercase tracking-widest">
            <span>Executive Flex</span>
            <span>Billionaire Archive ({progressPercent}%)</span>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white border border-[#EAE2D5] p-6 rounded-[24px] shadow-sm flex items-center gap-4">
            <div className="p-3 bg-[#FAF7F2] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#75695C] m-0">Current Streak</p>
              <h3 className="text-2xl font-normal text-[#1C1712] m-0">{user.streakCount || 0} DAYS</h3>
            </div>
          </div>

          <div className="bg-white border border-[#EAE2D5] p-6 rounded-[24px] shadow-sm flex items-center gap-4">
            <div className="p-3 bg-[#FAF7F2] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#75695C] m-0">Capital Deployed</p>
              <h3 className="text-2xl font-normal text-[#1C1712] m-0">${(user.totalSpent || 0).toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white border border-[#EAE2D5] p-6 rounded-[24px] shadow-sm flex items-center gap-4">
            <div className="p-3 bg-[#FAF7F2] text-[#C8A24F] rounded-2xl border border-[#EAE2D5] shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#75695C] m-0">Total Acquisitions</p>
              <h3 className="text-2xl font-normal text-[#1C1712] m-0">{orders.length} ORDERS</h3>
            </div>
          </div>
        </div>

        {/* --- CLEAN ACQUISITION RECEIPTS SECTION --- */}
        <section className="space-y-6 pt-4">
          <div className="border-b border-[#EAE2D5] pb-4 flex justify-between items-end">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#9B7A2B] block">
                Vault Receipts & Tracking
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#1C1712] flex items-center gap-2 m-0 mt-0.5">
                <Package className="w-6 h-6 text-[#C8A24F]" /> Acquisition Archive
              </h2>
            </div>
            <span className="font-mono text-xs font-bold uppercase bg-[#1C1712] text-white px-3.5 py-1.5 rounded-full tracking-widest">
              {orders.length} TOTAL
            </span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-3">
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
                    className="bg-white border border-[#EAE2D5] rounded-[24px] overflow-hidden shadow-sm transition-all duration-300 hover:border-[#C8A24F]"
                  >
                    {/* Header Bar */}
                    <div 
                      onClick={() => toggleOrder(order._id)}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F2]/60 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#1C1712] text-[#C8A24F] rounded-2xl shrink-0 shadow-sm">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-lg font-normal text-[#1C1712] m-0">
                              Receipt #{order._id.substring(0, 8).toUpperCase()}
                            </h3>
                            <span className="font-mono text-[9px] bg-[#C8A24F]/10 text-[#9B7A2B] border border-[#C8A24F]/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {order.deliveryStatus || 'DELIVERED TO VAULT'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-xs text-[#75695C]">
                            <Clock className="w-3 h-3 text-[#C8A24F]" />
                            <span>{formattedDate}</span>
                            <span>• {order.items?.length || 0} Items</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-[#EAE2D5] pt-3 sm:pt-0">
                        <h4 className="text-xl font-mono font-bold text-[#1C1712] m-0">
                          ${order.totalAmount?.toLocaleString()}
                        </h4>

                        <div className="p-2 rounded-full bg-[#FAF7F2] border border-[#EAE2D5] text-[#1C1712]">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Receipt Details */}
                    {isExpanded && (
                      <div className="border-t border-[#EAE2D5] bg-[#FAF7F2] p-5 sm:p-8 space-y-6 animate-fadeIn">
                        
                        {/* Order Shipping Tracker Component */}
                        <OrderTracker
                          orderId={order._id}
                          createdAt={order.createdAt}
                          itemsCount={order.items?.length || 0}
                        />

                        {/* Itemized Breakdown Table */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[10px] font-bold text-[#9B7A2B] uppercase tracking-widest block">
                              Itemized Breakdown
                            </span>

                            <button
                              onClick={(e) => handleDownloadReceipt(order, e)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EAE2D5] text-[#1C1712] font-mono text-[10px] font-bold uppercase rounded-full shadow-sm hover:border-[#C8A24F] transition-all active:scale-95"
                            >
                              <Download className="w-3 h-3 text-[#C8A24F]" /> Print PDF Receipt
                            </button>
                          </div>

                          <div className="space-y-2">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#EAE2D5] shadow-sm">
                                <div className="flex items-center gap-3.5 min-w-0">
                                  {item.image && (
                                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-xl border border-[#EAE2D5] shrink-0" />
                                  )}
                                  <div className="min-w-0">
                                    <h4 className="text-base font-normal text-[#1C1712] m-0 truncate">{item.title}</h4>
                                    <span className="font-mono text-[10px] text-[#75695C] block">
                                      Size: {item.selectedSize || 'Standard'}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-mono font-bold text-base text-[#9B7A2B] shrink-0 pl-2">
                                  ${item.price?.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#EAE2D5] font-mono text-[10px] text-[#75695C] uppercase">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24F]" /> Settled via Infinite Black Card
                          </span>
                          <span>Zero Real Money Required</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#EAE2D5] rounded-[32px] p-12 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 bg-[#FAF7F2] rounded-full flex items-center justify-center mx-auto border border-[#EAE2D5]">
                <Package className="w-7 h-7 text-[#9B7A2B]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-normal text-[#1C1712] m-0">No Acquisitions Found</h3>
                <p className="font-mono text-xs text-[#75695C] uppercase tracking-widest max-w-sm mx-auto m-0">
                  Select drops from the catalog feed and authorize your first virtual checkout!
                </p>
              </div>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 active:scale-95"
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