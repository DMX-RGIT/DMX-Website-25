"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Layers, BookOpen, Mic, ArrowUpRight, Timer, Users, Trophy, GitBranch, Star, CheckCircle2, Quote } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ACCENT = "var(--brand-teal)";

const featuresMeta = [
  { id: "hackathons", title: "Hackathons", icon: Code2 },
  { id: "projects", title: "Projects", icon: Layers },
  { id: "workshops", title: "Workshops", icon: BookOpen },
  { id: "seminars", title: "Seminars", icon: Mic },
];

/* ─── Premium Bento Components ─── */

function AbstractGraphic({ id }: { id: string }) {
  if (id === "hackathons") {
    // Abstract bar chart representing competition/stats
    return (
      <div className="absolute inset-0 flex items-end justify-center gap-3 opacity-10 pb-4 pointer-events-none">
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
    // Data Matrix / Neural Network Node Animation
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.35] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={ACCENT} stopOpacity="0.6" />
              <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Network Connections */}
          <g stroke={ACCENT} strokeWidth="1" opacity="0.2">
            <line x1="200" y1="100" x2="100" y2="50" />
            <line x1="200" y1="100" x2="90" y2="150" />
            <line x1="200" y1="100" x2="300" y2="40" />
            <line x1="200" y1="100" x2="310" y2="160" />
            <line x1="100" y1="50" x2="90" y2="150" />
            <line x1="300" y1="40" x2="310" y2="160" />
            {/* Outer nodes */}
            <line x1="100" y1="50" x2="20" y2="90" />
            <line x1="90" y1="150" x2="30" y2="180" />
            <line x1="300" y1="40" x2="370" y2="80" />
            <line x1="310" y1="160" x2="380" y2="130" />
          </g>

          {/* Animated Data Packets (flowing along lines) */}
          <motion.g stroke={ACCENT} strokeWidth="2" strokeDasharray="6 40" fill="none">
            <motion.line x1="200" y1="100" x2="100" y2="50" animate={{ strokeDashoffset: [0, -111] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
            <motion.line x1="200" y1="100" x2="300" y2="40" animate={{ strokeDashoffset: [0, -116] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
            <motion.line x1="90" y1="150" x2="200" y2="100" animate={{ strokeDashoffset: [0, -120] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} />
            <motion.line x1="310" y1="160" x2="200" y2="100" animate={{ strokeDashoffset: [0, -125] }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }} />
          </motion.g>

          {/* Nodes */}
          {[
            { x: 200, y: 100, r: 5 }, // Center
            { x: 100, y: 50, r: 4 },   
            { x: 90, y: 150, r: 4 },  
            { x: 300, y: 40, r: 4 },  
            { x: 310, y: 160, r: 4 }, 
            { x: 20, y: 90, r: 3 }, 
            { x: 30, y: 180, r: 3 }, 
            { x: 370, y: 80, r: 3 }, 
            { x: 380, y: 130, r: 3 }, 
          ].map((node, i) => (
            <g key={i}>
              <motion.circle 
                cx={node.x} cy={node.y} r={node.r * 3.5} 
                fill="url(#nodeGlow)"
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
              />
              <circle cx={node.x} cy={node.y} r={node.r} fill={ACCENT} />
            </g>
          ))}
        </svg>
      </div>
    );
  }
  if (id === "workshops") {
    // Concentric dashed rings representing learning pathways
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <motion.div
          className="w-40 h-40 sm:w-64 sm:h-64 rounded-full border-2 border-dashed"
          style={{ borderColor: ACCENT }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full border-2 border-dotted"
          style={{ borderColor: ACCENT }}
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }
  if (id === "seminars") {
    // Abstract waveform representing speech/audio
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2 opacity-10 pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 sm:w-2 rounded-full"
            style={{ backgroundColor: ACCENT, height: "20px" }}
            animate={{ height: ["20px", `${30 + ((i * 37) % 70)}px`, "20px"] }}
            transition={{ duration: 1.5 + (i % 3) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
          />
        ))}
      </div>
    );
  }
  return null;
}

function VisualPanel({ icon: Icon, id, className }: { icon: any; id: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-bg-surface/20 border border-white/5 flex items-center justify-center min-h-[220px]", className)}>
      {/* Dynamic graphic background */}
      <AbstractGraphic id={id} />

      {/* Radial gradient glow behind icon */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${ACCENT}, transparent)` }}
      />
      
      {/* Premium subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(${ACCENT} 1px, transparent 1px), linear-gradient(90deg, ${ACCENT} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Center glowing icon housing */}
      <div className="relative flex flex-col items-center gap-4 z-10">
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center backdrop-blur-md"
          style={{
            background: `color-mix(in srgb, ${ACCENT} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${ACCENT} 30%, transparent)`,
            boxShadow: `0 8px 32px color-mix(in srgb, ${ACCENT} 15%, transparent), inset 0 0 20px color-mix(in srgb, ${ACCENT} 8%, transparent)`,
          }}
        >
          <Icon className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: ACCENT }} />
        </div>
        
        {/* Pulsing rings */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ border: `1px solid color-mix(in srgb, ${ACCENT} 50%, transparent)` }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ border: `1px solid color-mix(in srgb, ${ACCENT} 30%, transparent)` }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
    </div>
  );
}

// Spotlight Bento Cell
function BentoCell({ className, children, glow = true }: { className?: string; children: React.ReactNode; glow?: boolean }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !glow) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-white/5 bg-bg-surface/20 flex flex-col transition-colors duration-500",
        glow && "hover:border-white/10 hover:bg-bg-surface/30",
        className
      )}
      style={{
        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)",
      }}
    >
      {glow && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 rounded-3xl"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, color-mix(in srgb, ${ACCENT} 6%, transparent), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

function TitleBlock({ icon: Icon, title, tagline, desc, href }: { icon: any; title: string; tagline: string; desc: string; href: string }) {
  return (
    <div className="flex flex-col h-full justify-between gap-6">
      <div>
        <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border mb-6 backdrop-blur-sm"
          style={{ color: ACCENT, borderColor: `color-mix(in srgb, ${ACCENT} 30%, transparent)`, background: `color-mix(in srgb, ${ACCENT} 8%, transparent)` }}>
          <Icon className="w-3.5 h-3.5" />
          {title}
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-text-primary leading-[1.2] mb-4">
          {tagline}
        </h3>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          {desc}
        </p>
      </div>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 w-fit px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 mt-2"
        style={{ background: `color-mix(in srgb, ${ACCENT} 12%, transparent)`, color: ACCENT, border: `1px solid color-mix(in srgb, ${ACCENT} 25%, transparent)` }}
      >
        Explore {title}
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}

/* ─── Tab 1: Hackathons ─── */
function HackathonsBento() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <VisualPanel id="hackathons" icon={Code2} className="lg:col-span-5 lg:row-span-2 min-h-[250px] lg:min-h-full" />
      <BentoCell className="lg:col-span-7">
        <TitleBlock
          icon={Code2}
          title="Hackathons"
          tagline="Build under pressure. Ship something real."
          desc="Our flagship Hack2Infinity gathers students from across Mumbai to compete, collaborate, and build working products in a single weekend. Open to all streams — CS, IT, EXTC, and more."
          href="/events?category=hackathon"
        />
      </BentoCell>

    </div>
  );
}

/* ─── Tab 2: Projects ─── */
function ProjectsBento() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <BentoCell className="lg:col-span-6">
        <TitleBlock
          icon={Layers}
          title="Projects"
          tagline="From idea to deployed product."
          desc="DMX members collaborate on real software projects — web apps, tools, dashboards, and more. Projects are open source, team-driven, and documented so anyone can contribute or learn from them."
          href="/projects"
        />
      </BentoCell>
      <VisualPanel id="projects" icon={Layers} className="lg:col-span-6 min-h-[220px] order-first lg:order-none" />
    </div>
  );
}

/* ─── Tab 3: Workshops ─── */
function WorkshopsBento() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <BentoCell className="lg:col-span-8">
        <TitleBlock
          icon={BookOpen}
          title="Workshops"
          tagline="Learn by doing, not just watching."
          desc="Hands-on technical sessions where you build something by the end. Topics span web development, data science, cloud, DevOps, and more — run by seniors, alumni, and invited experts."
          href="/events?category=workshop"
        />
      </BentoCell>
      <VisualPanel id="workshops" icon={BookOpen} className="lg:col-span-4 min-h-[220px] order-first lg:order-none" />
    </div>
  );
}

/* ─── Tab 4: Seminars ─── */
function SeminarsBento() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <BentoCell className="lg:col-span-7">
        <TitleBlock
          icon={Mic}
          title="Seminars"
          tagline="Real talk from people in the industry."
          desc="Guest speakers — working professionals, alumni, and researchers — share their journeys, insights, and the things no textbook covers. Followed by open Q&A so you can ask what actually matters."
          href="/events?category=seminar"
        />
      </BentoCell>
      <VisualPanel id="seminars" icon={Mic} className="lg:col-span-5 min-h-[220px] order-first lg:order-none" />
    </div>
  );
}

const bentoComponents: Record<string, React.FC> = {
  hackathons: HackathonsBento,
  projects: ProjectsBento,
  workshops: WorkshopsBento,
  seminars: SeminarsBento,
};

/* ─── Main Component ─── */
export function WhatWeDo() {
  const [activeTab, setActiveTab] = useState(0);
  const active = featuresMeta[activeTab];
  const BentoLayout = bentoComponents[active.id];

  const handleNext = () => setActiveTab((prev) => (prev + 1) % featuresMeta.length);
  const handlePrev = () => setActiveTab((prev) => (prev - 1 + featuresMeta.length) % featuresMeta.length);
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-20 text-center"
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

      {/* Tab Pills */}
      <motion.div
        className="flex flex-wrap justify-center gap-2.5 mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {featuresMeta.map((f, i) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setActiveTab(i)}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border",
                activeTab === i
                  ? "text-bg-primary border-transparent"
                  : "text-text-secondary border-border-subtle hover:border-white/10 hover:text-text-primary hover:bg-bg-surface/30 bg-transparent"
              )}
              style={activeTab === i ? { background: ACCENT, boxShadow: `0 0 24px color-mix(in srgb, ${ACCENT} 40%, transparent)` } : {}}
            >
              <Icon className="w-4 h-4" />
              {f.title}
            </button>
          );
        })}
      </motion.div>

      {/* Main Content Panel - Bento Grids */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) handleNext();
            else if (swipe > swipeConfidenceThreshold) handlePrev();
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <BentoLayout />
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex justify-center gap-2.5 mt-12">
        {featuresMeta.map((f, i) => (
          <button
            key={f.id}
            onClick={() => setActiveTab(i)}
            className="transition-all duration-300 rounded-full h-1.5"
            style={{
              width: activeTab === i ? "28px" : "6px",
              background: activeTab === i ? ACCENT : "var(--border-default)",
            }}
          />
        ))}
      </div>
    </section>
  );
}