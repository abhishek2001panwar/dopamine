'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/src/lib/store';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, X, Zap, ShieldCheck } from 'lucide-react';

// Warm Luxury Color Palette for Wheel Sectors
const WHEEL_SECTORS = [
  { label: '+$1,000', value: 1000, color: '#1C1712', text: '#FAF7F2' },
  { label: '+$2,500', value: 2500, color: '#C8A24F', text: '#FFFFFF' },
  { label: '+$500', value: 500, color: '#FAF7F2', text: '#1C1712' },
  { label: '+$5,000', value: 5000, color: '#9B7A2B', text: '#FFFFFF' },
  { label: '+$1,500', value: 1500, color: '#EAE2D5', text: '#1C1712' },
  { label: '+$10,000', value: 10000, color: '#1C1712', text: '#C8A24F' },
];

export function SpinWheelModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef(0);

  const { setBalance, fakeBalance } = useAppStore();

  // Draw Warm Luxury Canvas Wheel
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

      // Draw Sector
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 4, startAngle, endAngle);
      ctx.fillStyle = sector.color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#EAE2D5';
      ctx.stroke();

      // Draw Label
      ctx.save();
      ctx.rotate(startAngle + sectorAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = sector.text;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(sector.label, radius - 22, 4);
      ctx.restore();
    }

    ctx.restore();

    // Outer Border Ring
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

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setPrize(null);

    const numSectors = WHEEL_SECTORS.length;
    const sectorAngle = (2 * Math.PI) / numSectors;

    // Pick random target slice
    const winningIndex = Math.floor(Math.random() * numSectors);
    const selectedPrize = WHEEL_SECTORS[winningIndex];

    // Compute rotation angles
    const extraTurns = 5;
    const targetSectorCenter = winningIndex * sectorAngle + sectorAngle / 2;
    const finalAngle = extraTurns * (2 * Math.PI) + (3 * Math.PI) / 2 - targetSectorCenter;

    const duration = 4000;
    const startTime = performance.now();
    const startAngle = currentAngleRef.current;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic formula
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + (finalAngle - startAngle) * easeOut;

      currentAngleRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setHasSpun(true);
        setPrize(selectedPrize.value);
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });

        // Update Balance
        const newTotal = fakeBalance + selectedPrize.value;
        setBalance(newTotal);

        // Sync with database profile
        fetch('/api/user/allowance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: selectedPrize.value }),
        }).catch((err) => console.error('Failed to save spin reward:', err));
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <>
      {/* Floating Trigger Banner */}
      <div className="bg-white/70 backdrop-blur-2xl border border-white/90 p-6 rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-6 font-sans relative overflow-hidden">
        {/* Subtle Gold Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A24F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 z-10">
          <div className="p-3 bg-[#1C1712] text-[#F8F3EB] rounded-2xl border border-[#EAE2D5] shrink-0 shadow-md">
            <Trophy className="w-5 h-5 text-[#C8A24F]" />
          </div>
          <div>
            <h4 className="text-2xl font-normal text-[#1C1712] m-0">Daily Allowance Wheel</h4>
            <p className="font-mono text-xs text-[#75695C] m-0">Spin once every 24 hours to claim instant bonus bucks.</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto px-7 py-3.5 bg-[#C8A24F] hover:bg-[#B38C3B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-[#C8A24F]/20 flex items-center justify-center gap-2 shrink-0 active:scale-95 z-10"
        >
          <Zap className="w-4 h-4 fill-white" /> Open Wheel
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1712]/60 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-[#FAF7F2] border border-white/90 p-8 sm:p-10 max-w-sm w-full space-y-6 rounded-[44px] shadow-[0_30px_70px_rgba(0,0,0,0.2)] relative text-center overflow-hidden animate-fadeIn">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A24F]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-[#75695C] hover:text-[#1C1712] hover:bg-white/80 rounded-full transition-colors shadow-sm"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#9B7A2B]">
                Daily Capital Grant
              </span>
              <h3 className="text-3xl font-normal text-[#1C1712] m-0">DopaWheel®</h3>
            </div>

            {/* Wheel Canvas & Pointer Container */}
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-4">
              {/* Gold Pointer Arrow */}
              <div className="absolute -top-3 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-[#C8A24F] drop-shadow-md" />

              {/* Canvas Wheel */}
              <canvas ref={canvasRef} width={256} height={256} className="w-64 h-64 rounded-full shadow-xl" />

              {/* Center Hub */}
              <div className="absolute w-12 h-12 bg-[#1C1712] text-[#C8A24F] border-2 border-[#C8A24F] rounded-full flex items-center justify-center font-bold text-[10px] tracking-widest uppercase z-10 shadow-md">
                DOPA
              </div>
            </div>

            {/* Reward Notification */}
            {prize !== null && (
              <div className="p-3 bg-white/80 border border-[#C8A24F] rounded-2xl font-mono text-xs font-bold text-[#1C1712] flex items-center justify-center gap-2 shadow-sm animate-bounce">
                <Sparkles className="w-4 h-4 text-[#C8A24F]" />
                <span>Credited +${prize.toLocaleString()} Bonus Bucks!</span>
              </div>
            )}

            {/* Action Spin Button */}
            <div className="space-y-2">
              <button
                onClick={handleSpin}
                disabled={isSpinning || hasSpun}
                className={`w-full py-4 font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md ${
                  hasSpun
                    ? 'bg-[#EAE2D5] text-[#75695C] cursor-not-allowed border border-[#EAE2D5]'
                    : 'bg-[#C8A24F] hover:bg-[#B38C3B] text-white shadow-[#C8A24F]/25 active:scale-95'
                }`}
              >
                {isSpinning ? 'Spinning Wheel...' : hasSpun ? 'Claimed For Today' : 'Spin Wheel Now'}
              </button>

              <p className="font-mono text-[10px] text-center text-[#75695C] uppercase font-bold m-0 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24F]" /> 24-Hour Refill Available
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}