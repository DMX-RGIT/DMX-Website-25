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

export function SihJudgeCard({ judge, isActive }: SihJudgeCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col md:flex-row shrink-0 select-none outline-none cursor-grab active:cursor-grabbing",
        "w-[85vw] md:w-[620px]",
        "bg-[rgba(10,13,18,0.97)] rounded-2xl overflow-hidden transition-all duration-500 ease-out",
        isActive
          ? "opacity-100 scale-100 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(52,217,166,0.07)]"
          : "opacity-30 scale-[0.92]"
      )}
      style={{ transformOrigin: "center center" }}
    >
      {/* Left brand accent bar (navy + teal split — the X motif) */}
      <div className="absolute top-0 left-0 bottom-0 w-[3px] flex flex-col pointer-events-none z-10">
        <div className="flex-1 bg-[#1E3A8A]" />
        <div className="flex-1 bg-[#34D9A6]" />
      </div>

      {/* Photo */}
      <div className="relative shrink-0 w-full md:w-[200px] h-[240px] md:h-auto overflow-hidden bg-[#0d1117]">
        {judge.photo_url ? (
          <img
            src={judge.photo_url}
            alt={judge.name}
            className="w-full h-full object-cover object-[center_12%] pointer-events-none"
            style={{ imageRendering: "auto", WebkitFontSmoothing: "antialiased" }}
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 font-mono text-xs tracking-widest">
            NO PHOTO
          </div>
        )}
        {/* Subtle gradient fade into card body — mobile only */}
        <div className="absolute inset-0 md:hidden bg-gradient-to-b from-transparent via-transparent to-[rgba(10,13,18,0.5)]" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(10,13,18,0.2)]" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-7 min-w-0 pl-8">

        {/* Department chip */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono tracking-[0.14em] text-[#34D9A6] uppercase">
            {judge.department}
          </span>
        </div>

        {/* Name + designation */}
        <div className="mb-4">
          <h3 className="text-2xl md:text-[26px] font-bold text-white leading-tight mb-1">
            {judge.name}
          </h3>
          <p className="text-sm text-gray-400 font-mono tracking-wide">
            {judge.designation}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-[rgba(52,217,166,0.25)] to-transparent mb-4" />

        {/* Info rows */}
        {(judge.education || judge.experience || judge.interests) ? (
          <div className="flex flex-col gap-2.5">
            {judge.education && (
              <div className="flex gap-3 text-sm">
                <span className="shrink-0 text-[10px] font-mono tracking-widest text-[#34D9A6] uppercase pt-0.5 w-20">Education</span>
                <span className="text-gray-300 leading-snug">{judge.education}</span>
              </div>
            )}
            {judge.experience && (
              <div className="flex gap-3 text-sm">
                <span className="shrink-0 text-[10px] font-mono tracking-widest text-[#34D9A6] uppercase pt-0.5 w-20">Experience</span>
                <span className="text-gray-300 leading-snug">{judge.experience}</span>
              </div>
            )}
            {judge.interests && (
              <div className="flex gap-3 text-sm">
                <span className="shrink-0 text-[10px] font-mono tracking-widest text-[#34D9A6] uppercase pt-0.5 w-20">Interests</span>
                <span className="text-gray-300 leading-snug">{judge.interests}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-300 leading-relaxed">
            {judge.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
            SIH 2026 / INTERNAL ROUND
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[rgba(52,217,166,0.5)]">
            #{String(judge.id).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
