"use client";

import { useCountdown } from "@/hooks/useCountdown";

export function Countdown({ targetDate }: { targetDate: string }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) return null;

  return (
    <div className="flex items-center gap-4 text-center mt-6 justify-center">
      <div className="flex flex-col">
        <span className="text-3xl md:text-4xl font-mono font-bold text-text-primary">{String(days).padStart(2, '0')}</span>
        <span className="text-xs text-text-secondary uppercase tracking-wider mt-1">Days</span>
      </div>
      <span className="text-3xl md:text-4xl font-mono font-bold text-brand-teal/50 mb-5">:</span>
      <div className="flex flex-col">
        <span className="text-3xl md:text-4xl font-mono font-bold text-text-primary">{String(hours).padStart(2, '0')}</span>
        <span className="text-xs text-text-secondary uppercase tracking-wider mt-1">Hours</span>
      </div>
      <span className="text-3xl md:text-4xl font-mono font-bold text-brand-teal/50 mb-5">:</span>
      <div className="flex flex-col">
        <span className="text-3xl md:text-4xl font-mono font-bold text-text-primary">{String(minutes).padStart(2, '0')}</span>
        <span className="text-xs text-text-secondary uppercase tracking-wider mt-1">Mins</span>
      </div>
      <span className="text-3xl md:text-4xl font-mono font-bold text-brand-teal/50 mb-5">:</span>
      <div className="flex flex-col">
        <span className="text-3xl md:text-4xl font-mono font-bold text-text-primary">{String(seconds).padStart(2, '0')}</span>
        <span className="text-xs text-text-secondary uppercase tracking-wider mt-1">Secs</span>
      </div>
    </div>
  );
}
