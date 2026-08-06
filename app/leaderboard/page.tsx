'use client';

import { useEffect, useState } from 'react';
import { Trophy, Crown, Flame, Zap, ArrowRight, ShieldCheck, User, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1712] selection:bg-[#C8A24F] selection:text-white pb-24 antialiased overflow-x-hidden">
      <Navbar />

      <main className="w-full px-6 md:px-16 pt-8 space-y-12 max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="border-b border-[#EAE2D5] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9B7A2B]">
              Vol. 01 — Global Flex Standings
            </span>
            <h1 className="text-4xl sm:text-5xl font-normal text-[#1C1712] flex items-center gap-3 m-0">
              <Trophy className="w-9 h-9 text-[#C8A24F]" /> High Roller Board
            </h1>
          </div>
          <span className="font-mono text-xs font-bold uppercase bg-[#1C1712] text-white px-4 py-1.5 rounded-full tracking-widest shadow-sm self-start md:self-auto">
            LIVE RANKINGS • REFRESHED REAL-TIME
          </span>
        </div>

        {loading ? (
          <div className="py-32 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#C8A24F] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs uppercase tracking-widest font-bold text-[#75695C] m-0">
              Calculating Total Virtual Capital Deployed...
            </p>
          </div>
        ) : (
          <>
            {/* Podium Section: Top 3 High Rollers */}
            {topThree.length > 0 && (
              <section className="space-y-6">
                <span className="font-mono text-xs font-bold text-[#9B7A2B] uppercase tracking-widest block">
                  Top Capital Deployers
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                  {/* #2 Rank */}
                  {topThree[1] && (
                    <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[36px] p-8 shadow-[0_15px_35px_rgba(0,0,0,0.03)] space-y-5 hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 order-2 md:order-1">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-xl font-bold px-4 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE2D5] text-[#1C1712]">
                          #2
                        </span>
                        <Crown className="w-7 h-7 text-[#75695C]" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-normal text-[#1C1712] line-clamp-1 m-0">
                          {topThree[1].name}
                        </h3>
                        <p className="font-mono text-xs text-[#75695C] truncate m-0">{topThree[1].email}</p>
                      </div>
                      <div className="border-t border-[#EAE2D5] pt-4">
                        <span className="font-mono text-[10px] uppercase text-[#75695C] font-bold block">Total Deployed</span>
                        <p className="font-mono text-2xl font-bold text-[#9B7A2B] m-0">${(topThree[1].totalSpent || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* #1 Rank (Featured Highlight Gold Glass) */}
                  {topThree[0] && (
                    <div className="bg-[#1C1712] text-[#F8F3EB] border border-[#C8A24F]/40 rounded-[44px] p-10 shadow-[0_25px_60px_rgba(0,0,0,0.12)] space-y-6 order-1 md:order-2 md:-translate-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A24F]/20 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex justify-between items-start z-10 relative">
                        <span className="font-mono text-2xl font-bold px-4 py-1.5 rounded-full bg-[#C8A24F] text-white shadow-sm">
                          #1
                        </span>
                        <Crown className="w-9 h-9 text-[#C8A24F] fill-[#C8A24F]" />
                      </div>
                      <div className="space-y-1 z-10 relative">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#C8A24F] tracking-widest block">
                          Undisputed High Roller
                        </span>
                        <h3 className="text-3xl font-normal text-white line-clamp-1 m-0">
                          {topThree[0].name}
                        </h3>
                        <p className="font-mono text-xs text-[#75695C] truncate m-0">{topThree[0].email}</p>
                      </div>
                      <div className="border-t border-[#75695C]/30 pt-4 z-10 relative">
                        <span className="font-mono text-[10px] uppercase text-[#75695C] font-bold block">Peak Deployed Capital</span>
                        <p className="font-mono text-3xl font-bold text-[#C8A24F] m-0">${(topThree[0].totalSpent || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* #3 Rank */}
                  {topThree[2] && (
                    <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[36px] p-8 shadow-[0_15px_35px_rgba(0,0,0,0.03)] space-y-5 hover:shadow-[0_20px_50px_rgba(200,162,79,0.12)] transition-all duration-300 order-3">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-xl font-bold px-4 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE2D5] text-[#1C1712]">
                          #3
                        </span>
                        <Crown className="w-7 h-7 text-[#75695C]" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-normal text-[#1C1712] line-clamp-1 m-0">
                          {topThree[2].name}
                        </h3>
                        <p className="font-mono text-xs text-[#75695C] truncate m-0">{topThree[2].email}</p>
                      </div>
                      <div className="border-t border-[#EAE2D5] pt-4">
                        <span className="font-mono text-[10px] uppercase text-[#75695C] font-bold block">Total Deployed</span>
                        <p className="font-mono text-2xl font-bold text-[#9B7A2B] m-0">${(topThree[2].totalSpent || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Remaining Rankings Table */}
            <section className="space-y-6">
              <span className="font-mono text-xs font-bold text-[#9B7A2B] uppercase tracking-widest block">
                Rankings #4 and Beyond
              </span>

              {remainingRankings.length > 0 ? (
                <div className="bg-white/70 backdrop-blur-2xl border border-white/90 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-[#EAE2D5]">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 p-6 font-mono text-xs font-bold uppercase tracking-widest bg-[#F8F3EB] text-[#75695C]">
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
                        className={`grid grid-cols-12 p-6 items-center transition-colors ${
                          isCurrentUser ? 'bg-[#FAF7F2] font-bold' : 'hover:bg-white/90'
                        }`}
                      >
                        <div className="col-span-2 md:col-span-1 font-mono text-base font-bold text-[#1C1712]">
                          #{rank}
                        </div>
                        <div className="col-span-6 md:col-span-7 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl font-normal text-[#1C1712] m-0">
                              {user.name || 'Anonymous Roller'}
                            </h4>
                            {isCurrentUser && (
                              <span className="font-mono text-[9px] bg-[#C8A24F] text-white px-2.5 py-0.5 rounded-full font-bold uppercase">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-xs text-[#75695C] truncate m-0">{user.email}</p>
                        </div>
                        <div className="col-span-4 md:col-span-4 text-right font-mono text-lg font-bold text-[#9B7A2B]">
                          ${(user.totalSpent || 0).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                leaderboard.length <= 3 && (
                  <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[36px] p-12 text-center space-y-3 shadow-sm">
                    <ShieldCheck className="w-10 h-10 text-[#C8A24F] mx-auto" />
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#75695C] m-0">
                      Top 3 currently command the global board.
                    </p>
                  </div>
                )
              )}
            </section>
          </>
        )}

        {/* CTA Banner */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/90 rounded-[40px] p-10 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-3xl font-normal text-[#1C1712] m-0">Climb the Standings</h3>
            <p className="font-mono text-xs text-[#75695C] uppercase tracking-widest m-0">
              Deploy your virtual balance in the feed to boost your rank on the global board.
            </p>
          </div>
          <Link
            href="/feed"
            className="px-8 py-4 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 inline-flex items-center gap-2 shrink-0 active:scale-95"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}