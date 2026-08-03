'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag } from 'lucide-react';

export default function PublicMoodboardPage({ params }: { params: { userId: string } }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/closet/${params.userId}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [params.userId]);

  if (!data || data.error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-500">Moodboard not found or private.</p>
      </div>
    );
  }

  const { owner, closetItems } = data;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="max-w-6xl mx-auto flex justify-between items-center py-4 border-b border-zinc-800 mb-8">
        <Link href="/feed" className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          DopaCart 🛍️
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Create Your Closet
        </Link>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs px-3.5 py-1 rounded-full font-bold">
            Public Digital Moodboard
          </span>
          <h1 className="text-4xl font-black text-white">{owner.name}&apos;s Digital Closet</h1>
          <p className="text-xs text-zinc-400">
            ${owner.totalSpent?.toLocaleString()} spent on zero physical clutter.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {closetItems.map((item: any, idx: number) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all"
            >
              <div className="h-56 overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-pink-300">
                  ${item.price}
                </span>
              </div>
              <div className="p-3.5">
                <h3 className="font-bold text-sm truncate">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}