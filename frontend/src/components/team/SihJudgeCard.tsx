"use client";

import { cn } from "@/lib/utils";

export interface Judge {
  id: number;
  name: string;
  designation: string;
  department: string;
  description: string;
  education?: string;
  experience?: string;
  interests?: string;
  photo_url: string;
  social_links: Record<string, string>;
}

export interface SihJudgeCardProps {
  judge: Judge;
  index: number;
  isActive: boolean;
}

export function SihJudgeCard({ judge, index, isActive }: SihJudgeCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col md:flex-row items-center w-[80vw] max-w-[320px] md:max-w-none md:w-[500px] shrink-0 select-none outline-none cursor-grab active:cursor-grabbing",
        "bg-[rgba(16,20,28,0.95)] border border-[rgba(52,217,166,0.15)] rounded-2xl overflow-hidden transition-all duration-500 ease-out p-6 md:p-7 gap-5 md:gap-6",
        isActive 
          ? "opacity-100 scale-100 shadow-[0_12px_40px_rgba(52,217,166,0.12)] z-10 hover:scale-[1.02] hover:-rotate-1 md:hover:-rotate-2" 
          : "opacity-40 scale-90 z-0"
      )}
      style={{
        transformOrigin: "center center"
      }}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--sih-mint)] opacity-[0.03] blur-[40px] rounded-full pointer-events-none" />

      {/* Image Section - Inset ID Photo */}
      <div className="w-full max-w-[260px] h-[300px] md:max-w-none md:w-[160px] md:h-[200px] shrink-0 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-xl bg-[#f0f0f0] relative z-10">
        {judge.photo_url ? (
          <img
            src={judge.photo_url}
            alt={judge.name}
            className="w-full h-full object-cover object-[center_15%] pointer-events-none"
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No Photo
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center min-w-0 text-center md:text-left w-full relative z-10">
        <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-[var(--sih-mint)] uppercase mb-2 line-clamp-2">
          {judge.department}
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight line-clamp-2">
          {judge.name}
        </h3>
        
        <p className="text-[13px] md:text-sm text-gray-400 mb-4 md:mb-5 line-clamp-1">
          {judge.designation}
        </p>
        
        {judge.education || judge.experience || judge.interests ? (
          <div className="flex flex-col gap-1.5 md:gap-2 text-[12px] md:text-[13px] text-left mt-2 border-t border-[rgba(255,255,255,0.05)] pt-3">
            {judge.education && (
              <div className="text-gray-300 leading-snug">
                <span className="font-semibold text-[var(--sih-mint)] mr-1.5 text-[10px] uppercase tracking-wider">EDU</span>
                {judge.education}
              </div>
            )}
            {judge.experience && (
              <div className="text-gray-300">
                <span className="font-semibold text-[var(--sih-mint)] mr-1.5 text-[10px] uppercase tracking-wider">EXP</span>
                {judge.experience}
              </div>
            )}
            {judge.interests && (
              <div className="text-gray-300 leading-snug">
                <span className="font-semibold text-[var(--sih-mint)] mr-1.5 text-[10px] uppercase tracking-wider">INT</span>
                {judge.interests}
              </div>
            )}
          </div>
        ) : (
          <div className="text-[12px] md:text-sm text-gray-300 leading-snug md:leading-relaxed text-left">
            {judge.description}
          </div>
        )}
      </div>
    </div>
  );
}
