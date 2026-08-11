'use client';

import { useEffect, useState } from 'react';
import { Sparkles, MapPin, X } from 'lucide-react';

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

    // Initial check + trigger ticker every 12 seconds
    const interval = setInterval(fetchActivity, 12000);
    return () => clearInterval(interval);
  }, []);

  if (!visible || !currentActivity) return null;

  return (
    <div 
      /* Positioned TOP on mobile (top-4 left-4 right-4) to prevent covering bottom CTAs, 
         and BOTTOM-LEFT on desktop (sm:bottom-6 sm:left-6 sm:top-auto sm:right-auto) */
      className="hidden sm:block fixed top-4 left-4 right-4 sm:top-auto sm:right-auto sm:bottom-6 sm:left-6 z-50 transition-all duration-500 animate-fadeIn font-sans selection:bg-[#C8A24F] selection:text-white pointer-events-none"
    >
      <div className="bg-[#FAF7F2]/95 backdrop-blur-2xl border border-white/90 p-3.5 sm:p-4 rounded-[24px] sm:rounded-[28px] shadow-[0_20px_50px_rgba(28,23,18,0.12)] flex items-center justify-between gap-3 max-w-md sm:max-w-sm border-[#EAE2D5] relative overflow-hidden pointer-events-auto group hover:scale-102 transition-transform duration-300">
        {/* Subtle Ambient Gold Glow Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A24F]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 z-10 min-w-0">
          {/* Left Icon Hub */}
          <div className="p-2.5 sm:p-3 bg-[#1C1712] text-[#F8F3EB] rounded-2xl border border-[#C8A24F]/50 shrink-0 shadow-md relative">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A24F] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C8A24F] rounded-full animate-ping" />
          </div>

          {/* Activity Details */}
          <div className="space-y-0.5 z-10 min-w-0">
            <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] uppercase font-bold text-[#75695C] tracking-wider truncate">
              <span className="text-[#1C1712] truncate">{currentActivity.user}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-[#9B7A2B] shrink-0">
                <MapPin className="w-2.5 h-2.5" /> {currentActivity.location}
              </span>
            </div>

            <p className="text-xs font-normal text-[#1C1712] truncate m-0">
              Acquired <span className="font-semibold text-[#1C1712] underline decoration-[#C8A24F]">{currentActivity.itemTitle}</span>
            </p>

            <p className="font-mono text-xs font-bold text-[#9B7A2B] m-0">
              ${currentActivity.amount?.toLocaleString()} <span className="text-[9px] text-[#75695C] font-normal uppercase">Bonus Bucks</span>
            </p>
          </div>
        </div>

        {/* Mobile Manual Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="p-1 text-[#75695C] hover:text-[#1C1712] shrink-0 rounded-full transition-colors z-20"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}