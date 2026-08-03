'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/src/lib/store';
import confetti from 'canvas-confetti';
import { Dices, Sparkles, Trophy, X , Zap} from 'lucide-react';

const WHEEL_SECTORS = [
  { label: '+$1,000', value: 1000, color: '#000000', text: '#FFFFFF' },
  { label: '+$2,500', value: 2500, color: '#FFFFFF', text: '#000000' },
  { label: '+$500', value: 500, color: '#E5E5E5', text: '#000000' },
  { label: '+$5,000', value: 5000, color: '#000000', text: '#FFFFFF' },
  { label: '+$1,500', value: 1500, color: '#FFFFFF', text: '#000000' },
  { label: '+$10,000', value: 10000, color: '#262626', text: '#FFFFFF' },
];

export function SpinWheelModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef(0);

  const { setBalance, fakeBalance } = useAppStore();

  // Draw High-Contrast Canvas Wheel
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
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Draw Label
      ctx.save();
      ctx.rotate(startAngle + sectorAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = sector.text;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(sector.label, radius - 20, 4);
      ctx.restore();
    }

    ctx.restore();

    // Outer Border Ring
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 2, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
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
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

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
      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black text-white border border-black shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base uppercase text-black">Daily Allowance Wheel</h4>
            <p className="text-xs text-neutral-500 uppercase">Spin once every 24 hours to claim instant bonus bucks.</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-black text-white hover:bg-neutral-800 font-mono text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <Zap className="w-4 h-4 fill-white" /> Open Wheel
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 selection:bg-black selection:text-white">
          <div className="bg-white border-2 border-black p-8 max-w-sm w-full space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative text-center">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-black hover:bg-neutral-100 border border-transparent hover:border-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Daily Capital Grant
              </span>
              <h3 className="text-2xl font-black font-serif uppercase tracking-tight">DopaWheel®</h3>
            </div>

            {/* Wheel Canvas & Pointer Container */}
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-4">
              {/* Pointer Arrow */}
              <div className="absolute -top-3 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-black drop-shadow-md" />

              {/* Canvas Wheel */}
              <canvas ref={canvasRef} width={256} height={256} className="w-64 h-64" />

              {/* Center Hub */}
              <div className="absolute w-12 h-12 bg-black text-white border-2 border-white rounded-full flex items-center justify-center font-serif font-black text-xs uppercase z-10 shadow-md">
                DOPA
              </div>
            </div>

            {/* Reward Notification */}
            {prize !== null && (
              <div className="p-3 bg-neutral-100 border-2 border-black font-mono text-xs uppercase font-bold text-black flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-black" />
                <span>Credited +${prize.toLocaleString()} Fake Bucks!</span>
              </div>
            )}

            {/* Action Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || hasSpun}
              className={`w-full py-4 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                hasSpun
                  ? 'bg-neutral-200 text-neutral-500 border-2 border-neutral-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-neutral-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5'
              }`}
            >
              {isSpinning ? 'Spinning Wheel...' : hasSpun ? 'Claimed For Today' : 'Spin Wheel Now'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}