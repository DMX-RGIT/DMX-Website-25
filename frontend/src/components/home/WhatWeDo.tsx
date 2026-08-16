"use client";

import { motion } from "framer-motion";
import { Code2, Layers, BookOpen, Mic, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ACCENT = "var(--brand-teal)";

const featuresMeta = [
  { id: "hackathons", realTitle: "Hackathons", icon: Code2 },
  { id: "projects", realTitle: "Projects", icon: Layers },
  { id: "workshops", realTitle: "Workshops", icon: BookOpen },
  { id: "seminars", realTitle: "Seminars", icon: Mic },
];

const contentData: Record<string, { tagline: string, desc: string, href: string }> = {
  hackathons: {
    tagline: "Build under pressure. Ship something real.",
    desc: "Our flagship Hack2Infinity gathers students from across Mumbai to compete, collaborate, and build working products in a single weekend. Open to all streams — CS, IT, EXTC, and more.",
    href: "/events?category=hackathon"
  },
  projects: {
    tagline: "From idea to deployed product.",
    desc: "DMX members collaborate on real software projects — web apps, tools, dashboards, and more. Projects are open source, team-driven, and documented so anyone can contribute or learn from them.",
    href: "/projects"
  },
  workshops: {
    tagline: "Learn by doing, not just watching.",
    desc: "Hands-on technical sessions where you build something by the end. Topics span web development, data science, cloud, DevOps, and more — run by seniors, alumni, and invited experts.",
    href: "/events?category=workshop"
  },
  seminars: {
    tagline: "Real talk from people in the industry.",
    desc: "Guest speakers — working professionals, alumni, and researchers — share their journeys, insights, and the things no textbook covers. Followed by open Q&A so you can ask what actually matters.",
    href: "/events?category=seminar"
  }
};

/* ─── Premium Graphic Components ─── */

function AbstractGraphic({ id }: { id: string }) {
  if (id === "hackathons") {
    return (
      <div className="absolute inset-0 flex items-end justify-center gap-3 opacity-15 pb-8 pointer-events-none">
        {[40, 70, 30, 90, 50, 80, 60].map((h, i) => (
          <motion.div
            key={i}
            className="w-4 sm:w-6 rounded-t-md"
            style={{ backgroundColor: ACCENT, height: `${h}%` }}
            animate={{ height: [`${h}%`, `${h * 0.8}%`, `${h}%`] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    );
  }
  if (id === "projects") {
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.4] pointer-events-none">
        <svg className="w-full h-full scale-[1.2]" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={ACCENT} stopOpacity="0.6" />
              <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
            </radialGradient>
          </defs>
          <g stroke={ACCENT} strokeWidth="1" opacity="0.3">
            <line x1="200" y1="100" x2="100" y2="50" />
            <line x1="200" y1="100" x2="90" y2="150" />
            <line x1="200" y1="100" x2="300" y2="40" />
            <line x1="200" y1="100" x2="310" y2="160" />
            <line x1="100" y1="50" x2="90" y2="150" />
            <line x1="300" y1="40" x2="310" y2="160" />
          </g>
          <motion.g stroke={ACCENT} strokeWidth="2" strokeDasharray="6 40" fill="none">
            <motion.line x1="200" y1="100" x2="100" y2="50" animate={{ strokeDashoffset: [0, -111] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
            <motion.line x1="200" y1="100" x2="300" y2="40" animate={{ strokeDashoffset: [0, -116] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
            <motion.line x1="90" y1="150" x2="200" y2="100" animate={{ strokeDashoffset: [0, -120] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} />
            <motion.line x1="310" y1="160" x2="200" y2="100" animate={{ strokeDashoffset: [0, -125] }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }} />
          </motion.g>
          {[
            { x: 200, y: 100, r: 5 }, { x: 100, y: 50, r: 4 }, { x: 90, y: 150, r: 4 },  
            { x: 300, y: 40, r: 4 }, { x: 310, y: 160, r: 4 }
          ].map((node, i) => (
            <g key={i}>
              <motion.circle cx={node.x} cy={node.y} r={node.r * 3.5} fill="url(#nodeGlow)" animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }} />
              <circle cx={node.x} cy={node.y} r={node.r} fill={ACCENT} />
            </g>
          ))}
        </svg>
      </div>
    );
  }
  if (id === "workshops") {
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none scale-90">
        <motion.div className="absolute w-40 h-40 sm:w-64 sm:h-64 rounded-full border-2 border-dashed" style={{ borderColor: ACCENT }} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full border-2 border-dotted" style={{ borderColor: ACCENT }} animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
      </div>
    );
  }
  if (id === "seminars") {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2 opacity-15 pointer-events-none scale-110">
        {[...Array(24)].map((_, i) => (
          <motion.div key={i} className="w-1.5 sm:w-2 rounded-full" style={{ backgroundColor: ACCENT, height: "20px" }} animate={{ height: ["20px", `${30 + ((i * 37) % 70)}px`, "20px"] }} transition={{ duration: 1.5 + (i % 3) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }} />
        ))}
      </div>
    );
  }
  return null;
}

function VisualPanel({ icon: Icon, id }: { icon: React.ElementType; id: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <AbstractGraphic id={id} />
      <div className="absolute inset-0 opacity-[0.06]" style={{ background: `radial-gradient(circle at center, ${ACCENT}, transparent)` }} />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(${ACCENT} 1px, transparent 1px), linear-gradient(90deg, ${ACCENT} 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
      
      <div className="relative flex flex-col items-center gap-4 z-10">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-2xl"
          style={{ background: `color-mix(in srgb, ${ACCENT} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${ACCENT} 25%, transparent)` }}>
          <Icon className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: ACCENT }} />
        </div>
        <motion.div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ border: `1px solid color-mix(in srgb, ${ACCENT} 50%, transparent)` }} animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ border: `1px solid color-mix(in srgb, ${ACCENT} 30%, transparent)` }} animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
      </div>
    </div>
  );
}

function NotebookCell({ item, index }: { item: typeof featuresMeta[0], index: number }) {
  const data = contentData[item.id];
  const Icon = item.icon;

  return (
    <motion.div 
      className="flex flex-col mb-12 sm:mb-20 last:mb-0 max-w-5xl mx-auto w-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Input Cell */}
      <div className="flex gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="text-[var(--brand-teal)] font-mono text-[10px] sm:text-xs font-bold pt-2 sm:pt-2.5 shrink-0 select-none w-10 sm:w-16 text-right">
          In [{index}]:
        </div>
        <div className="flex-1 bg-[#0d1117]/80 backdrop-blur-sm border border-white/5 rounded-lg p-3 sm:p-4 font-mono text-[11px] sm:text-[13px] overflow-x-auto hide-scrollbar">
          <div className="min-w-max text-[#d4d4d4]">
            <span className="text-[#ff7b72]">import</span> dmx<br />
            <span className="text-[#79c0ff]">dmx</span>.<span className="text-[#d2a8ff]">execute</span>(<span className="text-[#a5d6ff]">&apos;{item.id}&apos;</span>)
          </div>
        </div>
      </div>

      {/* Output Cell */}
      <div className="flex gap-2 sm:gap-4">
        <div className="text-[#ff7b72] font-mono text-[10px] sm:text-xs font-bold pt-2 shrink-0 select-none w-10 sm:w-16 text-right">
          Out[{index}]:
        </div>
        
        {/* Output Content Wrapper */}
        <div className="flex-1 bg-[#161b22]/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
          
          {/* Subtle Grid Background for Output Cell */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `linear-gradient(${ACCENT} 1px, transparent 1px), linear-gradient(90deg, ${ACCENT} 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />

          {/* Text Details (Left on Desktop, Top on Mobile) */}
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border mb-6 backdrop-blur-sm"
                style={{ color: ACCENT, borderColor: `color-mix(in srgb, ${ACCENT} 30%, transparent)`, background: `color-mix(in srgb, ${ACCENT} 8%, transparent)` }}>
                <Icon className="w-3.5 h-3.5" />
                {item.realTitle}
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-text-primary leading-[1.2] mb-4">
                {data.tagline}
              </h3>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-8">
                {data.desc}
              </p>
            </div>
            
            <Link
              href={data.href}
              className="group inline-flex items-center gap-2 w-fit px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ background: `color-mix(in srgb, ${ACCENT} 12%, transparent)`, color: ACCENT, border: `1px solid color-mix(in srgb, ${ACCENT} 25%, transparent)` }}
            >
              Explore {item.realTitle}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          
          {/* Visual Panel (Right on Desktop, Bottom on Mobile) */}
          <div className="lg:w-[350px] xl:w-[450px] h-[250px] lg:h-auto border-t lg:border-t-0 lg:border-l border-white/5 relative shrink-0 bg-[#0d1117]/50">
             <VisualPanel id={item.id} icon={Icon} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export function WhatWeDo() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-16 sm:mb-24 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: ACCENT }}>
          Our Activities
        </p>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
          What We Do
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          We bridge the gap between theoretical knowledge and practical implementation in the world of Artificial Intelligence.
        </p>
      </motion.div>

      {/* Notebook Cells */}
      <div className="flex flex-col">
        {featuresMeta.map((item, i) => (
          <NotebookCell key={item.id} item={item} index={i + 1} />
        ))}
      </div>
    </section>
  );
}
