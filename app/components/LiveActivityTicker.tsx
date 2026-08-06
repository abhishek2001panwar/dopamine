'use client';

import { useEffect, useState } from 'react';
import { Sparkles, ShoppingBag, MapPin } from 'lucide-react';

interface Activity {
  id: string;
  user: string;
  itemTitle: string;
  amount: number;
  location: string;
  timeAgo: string;
}

export function LiveActivityTicker() {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/activity');
        const data = await res.json();
        if (data.activities && data.activities.length > 0) {
          const latest = data.activities[Math.floor(Math.random() * data.activities.length)];
          setCurrentActivity(latest);
          setVisible(true);

          // Hide popup after 4.5 seconds
          setTimeout(() => setVisible(false), 4500);
        }
      } catch (err) {
        // Silently fail if offline
      }
    };

    // Trigger ticker every 12 seconds
    const interval = setInterval(fetchActivity, 12000);
    return () => clearInterval(interval);
  }, []);

  if (!visible || !currentActivity) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 transition-all duration-500 animate-fadeIn font-sans selection:bg-[#C8A24F] selection:text-white pointer-events-none">
      <div className="bg-[#FAF7F2]/90 backdrop-blur-2xl border border-white/90 p-4 rounded-[28px] shadow-[0_20px_50px_rgba(28,23,18,0.08)] flex items-center gap-4 max-w-sm border-[#EAE2D5] relative overflow-hidden pointer-events-auto group hover:scale-105 transition-transform duration-300">
        {/* Subtle Ambient Gold Glow Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A24F]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Left Icon Hub */}
        <div className="p-3 bg-[#1C1712] text-[#F8F3EB] rounded-2xl border border-[#C8A24F]/50 shrink-0 shadow-md relative">
          <Sparkles className="w-5 h-5 text-[#C8A24F] animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C8A24F] rounded-full animate-ping" />
        </div>

        {/* Activity Details */}
        <div className="space-y-0.5 z-10">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-[#75695C] tracking-wider">
            <span className="text-[#1C1712]">{currentActivity.user}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-[#9B7A2B]">
              <MapPin className="w-2.5 h-2.5" /> {currentActivity.location}
            </span>
          </div>

          <p className="text-xs font-normal text-[#1C1712] line-clamp-1 m-0">
            Acquired <span className="font-semibold text-[#1C1712] underline decoration-[#C8A24F]">{currentActivity.itemTitle}</span>
          </p>

          <p className="font-mono text-xs font-bold text-[#9B7A2B] m-0">
            ${currentActivity.amount?.toLocaleString()} <span className="text-[9px] text-[#75695C] font-normal uppercase">Bonus Bucks</span>
          </p>
        </div>
      </div>
    </div>
  );
}