'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  MapPin, 
  Clock, 
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';

interface OrderTrackerProps {
  orderId: string;
  createdAt: string;
  itemsCount: number;
}

export function OrderTracker({ orderId, createdAt }: OrderTrackerProps) {
  const orderDate = new Date(createdAt);
  const now = new Date();

  // Calculate elapsed time in milliseconds and days
  const elapsedMs = now.getTime() - orderDate.getTime();
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);

  // Delivery takes 5 days total from order date
  const totalDeliveryDays = 5;
  const isDelivered = elapsedDays >= totalDeliveryDays;
  const daysRemaining = Math.max(0, Math.ceil(totalDeliveryDays - elapsedDays));

  // Estimated Delivery Date (Order Date + 5 Days)
  const estimatedDeliveryDate = new Date(orderDate.getTime() + totalDeliveryDays * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Planned Milestones Timeline (Days 0, 1, 3, 5)
  const t0_OrderPlaced = new Date(orderDate.getTime());
  const t1_Dispatched = new Date(orderDate.getTime() + 1 * 24 * 60 * 60 * 1000); // Day 1
  const t2_InTransit = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);  // Day 3
  const t3_Delivered = estimatedDeliveryDate;                                     // Day 5

  const steps = [
    {
      title: 'Order Verified & Processing',
      location: 'DopaCart Vault Operations — Zurich, CH',
      time: formatDate(t0_OrderPlaced),
      isDone: elapsedDays >= 0,
      isCurrent: elapsedDays >= 0 && elapsedDays < 1,
      icon: CheckCircle2,
    },
    {
      title: 'Dispatched to Carrier Hub',
      location: 'DHL Express Hub — Frankfurt, DE',
      time: formatDate(t1_Dispatched),
      isDone: elapsedDays >= 1,
      isCurrent: elapsedDays >= 1 && elapsedDays < 3,
      icon: Building2,
    },
    {
      title: 'In Transit / Custom Clearance',
      location: 'Regional Logistics Airport Facility',
      time: formatDate(t2_InTransit),
      isDone: elapsedDays >= 3,
      isCurrent: elapsedDays >= 3 && elapsedDays < 5,
      icon: Truck,
    },
    {
      title: 'Final Delivery to Vault',
      location: 'Destination Collector Address',
      time: formatDate(t3_Delivered),
      isDone: isDelivered,
      isCurrent: isDelivered,
      icon: PackageCheck,
    },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm font-sans">
      {/* Tracking Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D5] pb-5">
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-bold text-[#9B7A2B] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A24F]" /> DHL Express Priority Vault
          </span>
          <h4 className="text-lg font-normal text-[#1C1712] m-0 flex items-center gap-2">
            Waybill: <span className="font-mono font-bold text-[#C8A24F]">DOPA-{orderId.substring(0, 10).toUpperCase()}</span>
          </h4>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 font-mono text-xs bg-[#FAF7F2] border border-[#EAE2D5] px-4 py-2 rounded-full self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-[#C8A24F] animate-pulse" />
          {isDelivered ? (
            <span>Status: <strong className="text-[#9B7A2B]">DELIVERED TO VAULT</strong></span>
          ) : (
            <span>
              Status: <strong className="text-[#C8A24F]">IN TRANSIT</strong> • Arriving in {daysRemaining} {daysRemaining === 1 ? 'Day' : 'Days'}
            </span>
          )}
        </div>
      </div>

      {/* Delivery Estimate Box */}
      {!isDelivered && (
        <div className="p-4 bg-[#FAF7F2] border border-[#EAE2D5] rounded-2xl flex items-center justify-between font-mono text-xs">
          <span className="text-[#75695C] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C8A24F]" /> Estimated Delivery Date
          </span>
          <span className="font-bold text-[#1C1712]">
            {formatDate(estimatedDeliveryDate)}
          </span>
        </div>
      )}

      {/* Progress Line Tracker */}
      <div className="relative pt-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`flex md:flex-col items-start md:items-center gap-4 md:gap-2 text-left md:text-center transition-opacity ${
                  step.isDone ? 'opacity-100' : 'opacity-40'
                }`}
              >
                {/* Node Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md border-2 ${
                    step.isDone
                      ? 'bg-[#1C1712] text-[#C8A24F] border-[#C8A24F]'
                      : 'bg-[#FAF7F2] text-[#75695C] border-[#EAE2D5]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step Details */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold text-[#75695C] uppercase block">
                    {step.isDone ? step.time : `Est. ${step.time}`}
                  </span>
                  <h5 className="font-normal text-sm text-[#1C1712] m-0 leading-snug">
                    {step.title}
                  </h5>
                  <p className="font-mono text-[10px] text-[#75695C] m-0 flex items-center md:justify-center gap-1">
                    <MapPin className="w-3 h-3 text-[#9B7A2B] shrink-0" />
                    <span className="truncate">{step.location}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}