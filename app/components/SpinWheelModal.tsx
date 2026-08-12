'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/src/lib/store';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, X, Zap, ShieldCheck } from 'lucide-react';

const WHEEL_SECTORS = [
  { label: '+$1,000', value: 1000, color: '#1C1712', text: '#FAF7F2' },
  { label: '+$5,000', value: 5000, color: '#C8A24F', text: '#FFFFFF' },
  { label: '+$10,000', value: 10000, color: '#FAF7F2', text: '#1C1712' },
  { label: '+$25,000', value: 25000, color: '#9B7A2B', text: '#FFFFFF' },
  { label: '+$50,000', value: 50000, color: '#EAE2D5', text: '#1C1712' },
  { label: '+$100,000', value: 100000, color: '#1C1712', text: '#C8A24F' },
];

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function SpinWheelModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [lockNotice, setLockNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef(0);

  const { setBalance } = useAppStore();

  useEffect(() => {
    const todayStr = getLocalDateString();
    const lastSpinLocal = localStorage.getItem('dopacart_daily_spin_date');

    // 1. Instant check via localStorage
    if (lastSpinLocal === todayStr) {
      setHasSpun(true);
      setLockNotice('Claimed For Today');
    }

    // 2. Double-check MongoDB profile telemetry
    fetch('/api/user/profile', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user && data.user.lastSpinDate) {
          const lastSpin = new Date(data.user.lastSpinDate);
          const now = new Date();
          const diffHours = Math.abs(now.getTime() - lastSpin.getTime()) / (1000 * 60 * 60);

          if (diffHours < 24) {
            setHasSpun(true);
            setLockNotice(`Locked (~${Math.ceil(24 - diffHours)}h left)`);
            localStorage.setItem('dopacart_daily_spin_date', todayStr);
          } else {
            // Unlocked after 24h
            setHasSpun(false);
            setLockNotice(null);
          }
        }
      })
      .catch((err) => console.error('Error verifying wheel lock:', err));
  }, []);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numSectors = WHEEL_SECTORS.length;
    const sectorAngle = (2 * Math.PI) / numSectors;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle);

    for (let i = 0; i < numSectors; i++) {
      const sector = WHEEL_SECTORS[i];
      const startAngle = i * sectorAngle;
      const endAngle = startAngle + sectorAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 4, startAngle, endAngle);
      ctx.fillStyle = sector.color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#EAE2D5';
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + sectorAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = sector.text;
      ctx.font = 'bold 10px monospace';
      ctx.fillText(sector.label, radius - 16, 4);
      ctx.restore();
    }

    ctx.restore();

    ctx.beginPath();
    ctx.arc(radius, radius, radius - 2, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#C8A24F';
    ctx.stroke();
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => drawWheel(currentAngleRef.current), 50);
    }
  }, [isOpen]);

  const handleSpin = async () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setWonAmount(null);

    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const todayStr = getLocalDateString();
        localStorage.setItem('dopacart_daily_spin_date', todayStr);
        setHasSpun(true);
        setLockNotice(data.error || 'Claimed For Today');
        alert(data.error || 'Wheel is currently locked!');
        setIsSpinning(false);
        return;
      }

      const winningIndex = data.prizeIndex ?? 0;
      const numSectors = WHEEL_SECTORS.length;
      const sectorAngle = (2 * Math.PI) / numSectors;

      const extraTurns = 5;
      const targetSectorCenter = winningIndex * sectorAngle + sectorAngle / 2;
      const finalAngle = extraTurns * (2 * Math.PI) + (3 * Math.PI) / 2 - targetSectorCenter;

      const duration = 4000;
      const startTime = performance.now();
      const startAngle = currentAngleRef.current;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentAngle = startAngle + (finalAngle - startAngle) * easeOut;

        currentAngleRef.current = currentAngle;
        drawWheel(currentAngle);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsSpinning(false);
          setHasSpun(true);
          setLockNotice('Claimed For Today');

          // --- PERSIST DAILY LOCK IN LOCALSTORAGE IMMEDIATELY ---
          const todayStr = getLocalDateString();
          localStorage.setItem('dopacart_daily_spin_date', todayStr);

          setWonAmount(data.wonPrize.amount);
          setBalance(data.newBalance);

          confetti({
            particleCount: 160,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#C8A24F', '#9B7A2B', '#FFFFFF', '#1C1712'],
          });
        }
      };

      requestAnimationFrame(animate);
    } catch (err) {
      console.error('Spin execution error:', err);
      setIsSpinning(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Banner */}
      <div className="bg-white/70 backdrop-blur-2xl border border-white/90 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 font-sans relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 sm:w-48 h-36 sm:h-48 bg-[#C8A24F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 z-10 w-full sm:w-auto">
          <div className="p-2.5 sm:p-3 bg-[#1C1712] text-[#F8F3EB] rounded-2xl border border-[#EAE2D5] shrink-0 shadow-md">
            <Trophy className="w-5 h-5 text-[#C8A24F]" />
          </div>
          <div>
            <h4 className="text-lg sm:text-2xl font-normal text-[#1C1712] m-0">Daily Allowance Wheel</h4>
            <p className="font-mono text-[11px] sm:text-xs text-[#75695C] m-0 pt-0.5">
              {hasSpun ? 'Daily spin claimed! Refills in 24 hours.' : 'Spin every 24 hours to claim instant bonus bucks.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className={`w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95 z-10 ${
            hasSpun
              ? 'bg-[#1C1712] text-[#C8A24F] border border-[#C8A24F]/40'
              : 'bg-[#C8A24F] hover:bg-[#B38C3B] text-white shadow-[#C8A24F]/20'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{hasSpun ? 'Wheel Locked' : 'Open Wheel'}</span>
        </button>
      </div>

      {/* Wheel Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1712]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
          <div className="bg-[#FAF7F2] border border-white/90 p-5 sm:p-8 md:p-10 max-w-sm w-full space-y-4 sm:space-y-6 rounded-[32px] sm:rounded-[44px] shadow-[0_30px_70px_rgba(0,0,0,0.2)] relative text-center overflow-y-auto max-h-[90vh] animate-fadeIn">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-[#75695C] hover:text-[#1C1712] hover:bg-white/80 rounded-full transition-colors shadow-sm z-20"
              aria-label="Close Modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="space-y-0.5 sm:space-y-1 pt-2 sm:pt-0">
              <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B]">
                Daily Capital Grant
              </span>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#1C1712] m-0">DopaWheel®</h3>
            </div>

            {/* Responsive Canvas Container */}
            <div className="relative w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center my-2 sm:my-4">
              <div className="absolute -top-2.5 sm:-top-3 z-20 w-0 h-0 border-l-[8px] sm:border-l-[10px] border-l-transparent border-r-[8px] sm:border-r-[10px] border-r-transparent border-t-[14px] sm:border-t-[18px] border-t-[#C8A24F] drop-shadow-md" />

              <canvas ref={canvasRef} width={256} height={256} className="w-full h-full rounded-full shadow-xl" />

              <div className="absolute w-10 h-10 sm:w-12 sm:h-12 bg-[#1C1712] text-[#C8A24F] border-2 border-[#C8A24F] rounded-full flex items-center justify-center font-bold text-[9px] sm:text-[10px] tracking-widest uppercase z-10 shadow-md">
                DOPA
              </div>
            </div>

            {wonAmount !== null && (
              <div className="p-2.5 sm:p-3 bg-white/80 border border-[#C8A24F] rounded-2xl font-mono text-[11px] sm:text-xs font-bold text-[#1C1712] flex items-center justify-center gap-2 shadow-sm animate-bounce">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8A24F]" />
                <span>Credited +${wonAmount.toLocaleString()} Bonus Bucks!</span>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={handleSpin}
                disabled={isSpinning || hasSpun}
                className={`w-full py-3.5 sm:py-4 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md ${
                  hasSpun
                    ? 'bg-[#EAE2D5] text-[#75695C] cursor-not-allowed border border-[#EAE2D5]'
                    : 'bg-[#C8A24F] hover:bg-[#B38C3B] text-white shadow-[#C8A24F]/25 active:scale-95'
                }`}
              >
                {isSpinning
                  ? 'Spinning Wheel...'
                  : hasSpun
                  ? lockNotice || 'Claimed For Today'
                  : 'Spin Wheel Now'}
              </button>

              <p className="font-mono text-[9px] sm:text-[10px] text-center text-[#75695C] uppercase font-bold m-0 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C8A24F]" /> 24-Hour Refill Available
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}