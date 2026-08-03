'use client';

import { useEffect, useState } from 'react';
import { Trophy, Crown, Flame, Zap, ArrowUpRight, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch current user session to highlight user rank
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUserEmail(data.user.email);
        }
      })
      .catch((err) => console.error('Failed to load user profile:', err));

    // 2. Fetch global leaderboard rankings
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data.leaderboard || []);
      })
      .catch((err) => console.error('Failed to load leaderboard:', err))
      .finally(() => setLoading(false));
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const remainingRankings = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-neutral-50 text-black font-sans selection:bg-black selection:text-white pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Editorial Header */}
        <div className="border-b-2 border-black pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-bold">
              Vol. 01 — Global Flex Standings
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-tight flex items-center gap-3 mt-1">
              <Trophy className="w-9 h-9 text-black" /> High Roller Board
            </h1>
          </div>
          <div className="font-mono text-xs font-bold uppercase bg-black text-white px-4 py-2 self-start md:self-auto border border-black">
            LIVE RANKINGS • REFRESHED REAL-TIME
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-600">
              Calculating Total Virtual Capital Deployed...
            </p>
          </div>
        ) : (
          <>
            {/* Podium Section: Top 3 Spenders */}
            {topThree.length > 0 && (
              <section className="space-y-4">
                <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                  Top Capital Deployers
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  {/* #2 Rank */}
                  {topThree[1] && (
                    <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 order-2 md:order-1">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-2xl font-black px-3 py-1 bg-neutral-100 border border-black">
                          #2
                        </span>
                        <Crown className="w-6 h-6 text-neutral-400" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-xl uppercase tracking-tight line-clamp-1">
                          {topThree[1].name}
                        </h3>
                        <p className="font-mono text-xs text-neutral-500 truncate">{topThree[1].email}</p>
                      </div>
                      <div className="border-t border-neutral-200 pt-3">
                        <p className="font-mono text-[10px] uppercase text-neutral-400 font-bold">Total Deployed</p>
                        <p className="font-mono text-xl font-black">${(topThree[1].totalSpent || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* #1 Rank (Featured Highlight) */}
                  {topThree[0] && (
                    <div className="bg-black text-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4 order-1 md:order-2 md:-translate-y-4">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-3xl font-black px-4 py-1 bg-white text-black border border-white">
                          #1
                        </span>
                        <Crown className="w-8 h-8 text-white fill-white" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 tracking-widest">
                          Undisputed High Roller
                        </span>
                        <h3 className="font-serif font-black text-2xl uppercase tracking-tight line-clamp-1">
                          {topThree[0].name}
                        </h3>
                        <p className="font-mono text-xs text-neutral-400 truncate">{topThree[0].email}</p>
                      </div>
                      <div className="border-t border-neutral-800 pt-3">
                        <p className="font-mono text-[10px] uppercase text-neutral-400 font-bold">Peak Deployed Capital</p>
                        <p className="font-mono text-2xl font-black">${(topThree[0].totalSpent || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* #3 Rank */}
                  {topThree[2] && (
                    <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 order-3">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-2xl font-black px-3 py-1 bg-neutral-100 border border-black">
                          #3
                        </span>
                        <Crown className="w-6 h-6 text-neutral-400" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-xl uppercase tracking-tight line-clamp-1">
                          {topThree[2].name}
                        </h3>
                        <p className="font-mono text-xs text-neutral-500 truncate">{topThree[2].email}</p>
                      </div>
                      <div className="border-t border-neutral-200 pt-3">
                        <p className="font-mono text-[10px] uppercase text-neutral-400 font-bold">Total Deployed</p>
                        <p className="font-mono text-xl font-black">${(topThree[2].totalSpent || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Remaining Global Rankings Table */}
            <section className="space-y-4">
              <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                Rankings #4 and Beyond
              </span>

              {remainingRankings.length > 0 ? (
                <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] divide-y-2 divide-black">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 p-4 font-mono text-xs font-bold uppercase tracking-wider bg-neutral-100 border-b-2 border-black text-neutral-600">
                    <div className="col-span-2 md:col-span-1">Rank</div>
                    <div className="col-span-6 md:col-span-7">User / Alias</div>
                    <div className="col-span-4 md:col-span-4 text-right">Total Spent</div>
                  </div>

                  {/* Table Rows */}
                  {remainingRankings.map((user, idx) => {
                    const rank = idx + 4;
                    const isCurrentUser = currentUserEmail && user.email === currentUserEmail;

                    return (
                      <div
                        key={user._id || idx}
                        className={`grid grid-cols-12 p-4 items-center transition-colors ${
                          isCurrentUser ? 'bg-neutral-100 font-bold' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <div className="col-span-2 md:col-span-1 font-mono text-sm font-black">
                          #{rank}
                        </div>
                        <div className="col-span-6 md:col-span-7 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-base uppercase tracking-tight">
                              {user.name || 'Anonymous Roller'}
                            </span>
                            {isCurrentUser && (
                              <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 font-bold uppercase">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-xs text-neutral-500 truncate">{user.email}</p>
                        </div>
                        <div className="col-span-4 md:col-span-4 text-right font-mono text-base font-black">
                          ${(user.totalSpent || 0).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                leaderboard.length <= 3 && (
                  <div className="bg-white border-2 border-dashed border-black p-8 text-center space-y-2">
                    <ShieldCheck className="w-8 h-8 text-black mx-auto" />
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600">
                      Top 3 currently command the global board.
                    </p>
                  </div>
                )
              )}
            </section>
          </>
        )}

        {/* Call to Action Banner */}
        <div className="bg-black text-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-2xl font-black uppercase tracking-tight">Climb the Standings</h3>
            <p className="font-mono text-xs text-neutral-400 uppercase">
              Deploy your virtual balance in the feed to boost your rank on the global board.
            </p>
          </div>
          <Link
            href="/feed"
            className="px-6 py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 shrink-0"
          >
            Start Shopping <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}