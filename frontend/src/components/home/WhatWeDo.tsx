"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Layers, BookOpen, Mic, Play, Terminal, FileCode2, FileJson, FileText, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ACCENT = "var(--brand-teal)";

const featuresMeta = [
  { id: "hackathons", title: "hackathons.tsx", icon: FileCode2, color: "#3178C6", realTitle: "Hackathons", mainIcon: Code2 },
  { id: "projects", title: "projects.py", icon: FileCode2, color: "#3776AB", realTitle: "Projects", mainIcon: Layers },
  { id: "workshops", title: "workshops.yml", icon: FileJson, color: "#CB171E", realTitle: "Workshops", mainIcon: BookOpen },
  { id: "seminars", title: "seminars.md", icon: FileText, color: "#94a3b8", realTitle: "Seminars", mainIcon: Mic },
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
    <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117] overflow-hidden">
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

function CodeRenderer({ id, data }: { id: string; data: { tagline: string; desc: string; href: string } }) {
  // VS Code GitHub Dark Theme Colors
  const syntax = {
    keyword: "text-[#ff7b72]",    // red
    variable: "text-[#79c0ff]",   // light blue
    property: "text-[#79c0ff]",   // light blue
    string: "text-[#a5d6ff]",     // lighter blue
    punctuation: "text-white",
    comment: "text-[#8b949e]",    // gray
  };

  const CodeLine = ({ num, children, className }: { num: number | string, children: React.ReactNode, className?: string }) => (
    <div className="flex w-full">
      <div className="w-8 sm:w-10 shrink-0 text-right pr-3 sm:pr-4 text-[#8b949e]/50 select-none">
        {num}
      </div>
      <div className={cn("flex-1 break-words", className)}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col font-mono text-[13px] sm:text-sm leading-[1.7] pb-4">
      <CodeLine num={1}><span className={syntax.comment}>{`//`} dmx.config.{id === 'hackathons' ? 'ts' : id === 'projects' ? 'py' : id === 'workshops' ? 'yml' : 'md'}</span></CodeLine>
      <CodeLine num={2}><span>&nbsp;</span></CodeLine>
      <CodeLine num={3}>
        <span className={syntax.keyword}>export const </span>
        <span className={syntax.variable}>{id}</span>
        <span className={syntax.keyword}> = </span>
        <span className={syntax.punctuation}>&#123;</span>
      </CodeLine>
      <CodeLine num={4} className="pl-4 sm:pl-6">
        <span className={syntax.property}>tagline</span>
        <span className={syntax.keyword}>: </span>
        <span className={syntax.string}>&quot;{data.tagline}&quot;</span>,
      </CodeLine>
      <CodeLine num={5} className="pl-4 sm:pl-6">
        <span className={syntax.property}>description</span>
        <span className={syntax.keyword}>: </span>
        <span className={syntax.string}>&quot;{data.desc}&quot;</span>,
      </CodeLine>
      <CodeLine num={6} className="pl-4 sm:pl-6">
        <span className={syntax.property}>action</span>
        <span className={syntax.keyword}>: </span>
        <span className={syntax.variable}>() </span>
        <span className={syntax.keyword}>=&gt; </span>
        <span className="text-[#d2a8ff]">execute</span>
        <span className={syntax.punctuation}>(</span>
        <span className={syntax.string}>&quot;{data.href}&quot;</span>
        <span className={syntax.punctuation}>)</span>
      </CodeLine>
      <CodeLine num={7}>
        <span className={syntax.punctuation}>&#125;;</span>
      </CodeLine>
      <CodeLine num={8}><span>&nbsp;</span></CodeLine>

      {/* Action Button */}
      <div className="mt-6 ml-8 sm:ml-10">
        <Link href={data.href} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:-translate-y-0.5 group"
          style={{ background: `color-mix(in srgb, ${ACCENT} 12%, transparent)`, color: ACCENT, border: `1px solid color-mix(in srgb, ${ACCENT} 25%, transparent)` }}>
          <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
          <span>Run script</span>
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export function WhatWeDo() {
  const [activeTab, setActiveTab] = useState(0);
  const active = featuresMeta[activeTab];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-16 text-center"
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

      {/* IDE Container */}
      <motion.div 
        className="rounded-xl overflow-hidden shadow-2xl flex flex-col max-w-5xl mx-auto border border-white/10"
        style={{ backgroundColor: "#0d1117" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Title Bar */}
        <div className="h-12 bg-[#161b22] border-b border-white/5 flex items-center px-4 shrink-0 justify-between select-none">
          <div className="flex gap-2 w-20">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8b949e]">
            <LayoutTemplate className="w-3.5 h-3.5" />
            dmx-workspace — WhatWeDo
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
        
        <div className="flex flex-col lg:flex-row h-[700px] lg:h-[500px]">
          {/* Sidebar (Desktop) */}
          <div className="hidden lg:flex flex-col w-56 bg-[#161b22] border-r border-white/5 shrink-0 select-none">
            <div className="px-4 py-3 text-[10px] font-bold text-[#8b949e] tracking-widest mt-2">EXPLORER</div>
            <div className="flex flex-col">
              {featuresMeta.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2 text-sm font-mono text-left transition-colors border-l-2",
                    activeTab === i ? "bg-white/5 text-white border-[var(--brand-teal)]" : "text-[#8b949e] hover:text-white hover:bg-white/5 border-transparent"
                  )}
                >
                  <f.icon className="w-4 h-4 shrink-0" style={{ color: f.color }} />
                  <span className="truncate">{f.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Tabs (Mobile) */}
          <div className="flex lg:hidden overflow-x-auto bg-[#161b22] border-b border-white/5 shrink-0 hide-scrollbar select-none">
            {featuresMeta.map((f, i) => (
              <button
                key={f.id}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3.5 text-xs font-mono whitespace-nowrap border-b-2 transition-colors",
                  activeTab === i ? "border-[var(--brand-teal)] text-white bg-white/5" : "border-transparent text-[#8b949e] hover:text-white hover:bg-white/5"
                )}
              >
                <f.icon className="w-3.5 h-3.5" style={{ color: f.color }} />
                {f.title}
              </button>
            ))}
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* Editor Top Bar (Breadcrumb) */}
            <div className="h-10 bg-[#0d1117] border-b border-white/5 flex items-center px-4 shrink-0 text-xs font-mono text-[#8b949e] select-none gap-2">
              <span>dmx-web</span>
              <span className="opacity-50">&gt;</span>
              <span>src</span>
              <span className="opacity-50">&gt;</span>
              <span className="text-white flex items-center gap-1.5">
                <active.icon className="w-3.5 h-3.5" style={{ color: active.color }} />
                {active.title}
              </span>
            </div>

            {/* Split Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              
              {/* Code Block */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <CodeRenderer id={active.id} data={contentData[active.id]} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Preview Window (Right on Desktop, Bottom on Mobile) */}
              <div className="h-64 lg:h-auto lg:w-[400px] xl:w-[450px] border-t lg:border-t-0 lg:border-l border-white/5 relative shrink-0">
                <div className="absolute top-0 left-0 right-0 h-8 bg-[#161b22]/80 backdrop-blur-md border-b border-white/5 flex items-center px-3 z-20 text-[10px] font-mono text-[#8b949e] uppercase tracking-wider select-none gap-2">
                  <Terminal className="w-3 h-3" />
                  Live Output
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id + '-visual'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 top-8"
                  >
                    <VisualPanel icon={active.mainIcon} id={active.id} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
