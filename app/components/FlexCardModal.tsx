'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Sparkles, Flame, ShieldCheck, Trophy, X } from 'lucide-react';

interface FlexCardProps {
  user: {
    name: string;
    totalSpent: number;
    streakCount: number;
    badgeCount: number;
  };
  equippedItems: Array<{
    title: string;
    price: number;
    image: string;
    tag?: string;
  }>;
}

export function FlexCardModal({ user, equippedItems }: FlexCardProps) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${user.name.toLowerCase().replace(/\s+/g, '-')}-dopacart-flex.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Could not generate Flex Card image.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 shrink-0"
      >
        <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" /> Share Flex Card
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-black text-gray-900 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" /> Your Digital Flex Card
              </h2>
              <p className="text-xs text-gray-500">
                Preview your flex status and download it to share on X, IG, or Discord!
              </p>
            </div>

            {/* Printable Flex Card Node */}
            <div
              ref={cardRef}
              className="bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 rounded-2xl p-6 text-white space-y-6 shadow-2xl border border-purple-500/30 relative overflow-hidden"
            >
              {/* Card Ambient Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-purple-800/40 pb-4">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">
                    DopaCart Verified High Roller
                  </span>
                  <h3 className="text-2xl font-black text-white">{user.name}</h3>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl text-white shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              {/* Main Metric */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center space-y-1">
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Lifetime Virtual Cash Spent</p>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300">
                  ${user.totalSpent.toLocaleString()}
                </p>
              </div>

              {/* Sub Metrics */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400 fill-orange-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Daily Streak</p>
                    <p className="text-sm font-black text-white">{user.streakCount} Days</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Badges Unlocked</p>
                    <p className="text-sm font-black text-white">{user.badgeCount} Badges</p>
                  </div>
                </div>
              </div>

              {/* Equipped Items Display */}
              {equippedItems.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                    Equipped Fit ({equippedItems.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {equippedItems.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 border border-white/10 rounded-lg p-2 text-center space-y-1"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-md mx-auto bg-black/20"
                        />
                        <p className="text-[10px] font-bold text-gray-200 truncate">{item.title}</p>
                        <p className="text-[9px] font-black text-pink-400">${item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Footer Branding */}
              <div className="flex justify-between items-center pt-2 text-[10px] text-gray-400 font-semibold border-t border-purple-800/40">
                <span>✨ dopacart.com</span>
                <span>Zero Real Money. Pure Clout.</span>
              </div>
            </div>

            {/* Action Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Generating Image...' : 'Download PNG Flex Card'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}