'use client';

import { use, useEffect, useState } from 'react';
import { Navbar } from '@/app/components/Navbar';
import Link from 'next/link';
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Box, 
  Copy, 
  Check
} from 'lucide-react';

interface OrderItem {
  _id: string;
  title: string;
  price: number;
  image?: string;
}

interface OrderData {
  _id: string;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
  deliveryStatus?: string;
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch user profile or specific order history
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          const found = data.orders.find((o: any) => o._id === orderId || o._id.substring(0, 8) === orderId);
          if (found) {
            setOrder(found);
          }
        }
      })
      .catch((err) => console.error('Failed to load order telemetry:', err))
      .finally(() => setLoading(false));
  }, [orderId]);

  const copyTrackingId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock calculated tracking milestone steps based on order creation date
  const orderDate = order ? new Date(order.createdAt) : new Date();
  
  const step1Time = new Date(orderDate.getTime() + 5 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const step2Time = new Date(orderDate.getTime() + 45 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const step3Time = new Date(orderDate.getTime() + 120 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Estimated Arrival Date (+2 days from order)
  const estArrival = new Date(orderDate.getTime() + 48 * 3600000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] font-sans">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6 text-center py-32 space-y-4">
          <div className="w-10 h-10 border-2 border-[#C8A24F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-widest font-bold text-[#75695C]">
            Connecting to Telemetry Drone Satellite...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white pb-24 antialiased font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-8 space-y-10">
        {/* Navigation back */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#75695C] hover:text-[#1C1712] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Vault Dossier
        </Link>

        {/* Hero Order Status Header */}
        <div className="bg-[#1C1712] text-[#F8F3EB] border border-[#C8A24F]/40 p-8 md:p-12 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.12)] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 border-b border-[#75695C]/30 pb-6">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#C8A24F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Drone Telemetry Active
              </span>
              <h1 className="text-3xl sm:text-4xl font-normal text-white m-0">
                Acquisition #{orderId.substring(0, 8).toUpperCase()}
              </h1>
            </div>

            <button
              onClick={copyTrackingId}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 font-mono text-xs font-bold uppercase tracking-widest text-white transition-all active:scale-95 self-start sm:self-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#C8A24F]" /> : <Copy className="w-3.5 h-3.5 text-[#C8A24F]" />}
              {copied ? 'ID Copied' : 'Copy Tracking ID'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 pt-2 font-mono text-xs uppercase">
            <div className="space-y-1">
              <span className="text-[#75695C] block text-[10px]">Estimated Delivery</span>
              <p className="text-xl font-normal text-white m-0">{estArrival}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[#75695C] block text-[10px]">Current Status</span>
              <p className="text-xl font-normal text-[#C8A24F] m-0">In Transit to Vault</p>
            </div>
            <div className="space-y-1">
              <span className="text-[#75695C] block text-[10px]">Grant Capital Debited</span>
              <p className="text-xl font-normal text-white m-0">${(order?.totalAmount || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Live Step Progress Timeline */}
        <section className="bg-white/70 backdrop-blur-2xl border border-white/90 p-8 md:p-10 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-8">
          <div className="border-b border-[#EAE2D5] pb-4 flex justify-between items-center">
            <h2 className="text-2xl font-normal text-[#1C1712] m-0 flex items-center gap-2">
              <Truck className="w-6 h-6 text-[#C8A24F]" /> Courier Dispatch Log
            </h2>
            <span className="font-mono text-[10px] font-bold uppercase bg-[#FAF7F2] text-[#9B7A2B] px-3 py-1 rounded-full border border-[#EAE2D5]">
              Real-Time Sync
            </span>
          </div>

          {/* Timeline Visual */}
          <div className="space-y-8 font-mono text-xs relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EAE2D5] pl-10">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-[#1C1712] text-white flex items-center justify-center border-2 border-[#C8A24F] shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#C8A24F]" />
              </span>
              <div className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-[#1C1712] uppercase m-0">Order Authorized & Debited</h3>
                  <span className="text-[#75695C]">{step1Time}</span>
                </div>
                <p className="text-[#75695C] m-0">Virtual funds approved. Receipt dossier generated and dispatched to inbox.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-[#1C1712] text-white flex items-center justify-center border-2 border-[#C8A24F] shadow-sm">
                <Box className="w-4 h-4 text-[#C8A24F]" />
              </span>
              <div className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-[#1C1712] uppercase m-0">Prepared at Central Vault</h3>
                  <span className="text-[#75695C]">{step2Time}</span>
                </div>
                <p className="text-[#75695C] m-0">Items packaged in high-roller protective casing and verified by quality AI.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-[#C8A24F] text-white flex items-center justify-center border-2 border-[#1C1712] shadow-sm animate-pulse">
                <Truck className="w-4 h-4 text-white" />
              </span>
              <div className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-[#9B7A2B] uppercase m-0">Autonomous Drone Delivery In Progress</h3>
                  <span className="text-[#75695C]">{step3Time}</span>
                </div>
                <p className="text-[#75695C] m-0">En route to location: <strong className="text-[#1C1712]">{order?.deliveryAddress || "Mom's Basement, Room 2B"}</strong></p>
              </div>
            </div>

            {/* Step 4 (Future) */}
            <div className="relative opacity-50">
              <span className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-[#FAF7F2] text-[#75695C] flex items-center justify-center border border-[#EAE2D5]">
                <MapPin className="w-4 h-4" />
              </span>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-[#75695C] uppercase m-0">Registered in Personal Closet Archive</h3>
                <p className="text-[#75695C] m-0">Awaiting final drop signature.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Itemized Order Breakdown */}
        {order?.items && order.items.length > 0 && (
          <section className="bg-white/70 backdrop-blur-2xl border border-white/90 p-8 md:p-10 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6">
            <h2 className="text-2xl font-normal text-[#1C1712] m-0 border-b border-[#EAE2D5] pb-4">
              Acquired Package Contents
            </h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#EAE2D5] shadow-sm">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-[#EAE2D5]" />
                    )}
                    <h3 className="text-lg font-normal text-[#1C1712] m-0">{item.title}</h3>
                  </div>
                  <span className="font-mono font-bold text-base text-[#9B7A2B]">
                    ${(item.price || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Guarantee */}
        <div className="text-center font-mono text-xs text-[#75695C] uppercase space-y-1">
          <p className="m-0 flex items-center justify-center gap-1 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#C8A24F]" /> 100% Virtual Drone Protocol • Zero Real Dollars Required
          </p>
        </div>
      </main>
    </div>
  );
}