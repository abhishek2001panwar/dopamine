'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, Zap } from 'lucide-react';

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

          // Hide popup after 4 seconds
          setTimeout(() => setVisible(false), 4000);
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
    <div className="fixed bottom-6 left-6 z-40 transition-all duration-500 animate-slide-up">
      <div className="bg-zinc-900/90 backdrop-blur-md border border-purple-500/40 p-3.5 rounded-2xl shadow-xl flex items-center gap-3.5 max-w-sm">
        <div className="p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white">
          <Zap className="w-5 h-5 animate-pulse" />
        </div>
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 font-bold text-zinc-200">
            <span>{currentActivity.user}</span>
            <span className="text-zinc-500">• {currentActivity.location}</span>
          </div>
          <p className="text-zinc-400">
            Just fake-bought <span className="text-purple-300 font-semibold">{currentActivity.itemTitle}</span>
          </p>
          <p className="text-pink-400 font-bold">${currentActivity.amount} Fake Bucks</p>
        </div>
      </div>
    </div>
  );
}