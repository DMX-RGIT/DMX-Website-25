"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Layers, BookOpen, Mic, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "hackathons",
    title: "Hackathons",
    tagline: "Build under pressure. Ship something real.",
    description:
      "Our flagship Hack2Infinity gathers students from across Mumbai to compete, collaborate, and build working products in a single weekend. Open to all streams — CS, IT, EXTC, and more.",
    icon: Code2,
    href: "/events?category=hackathon",
    stats: [
      { value: "Annual", label: "Flagship Event" },
      { value: "Open", label: "To All Branches" },
      { value: "Weekend", label: "Format" },
    ],
    tags: ["Hack2Infinity", "Team Event", "Open to All", "Prizes"],
  },
  {
    id: "projects",
    title: "Projects",
    tagline: "From idea to deployed product.",
    description:
      "DMX members collaborate on real software projects — web apps, tools, dashboards, and more. Projects are open source, team-driven, and documented so anyone can contribute or learn from them.",
    icon: Layers,
    href: "/projects",
    stats: [
      { value: "Open", label: "Source" },
      { value: "Team", label: "Driven" },
      { value: "GitHub", label: "Published" },
    ],
    tags: ["Web Dev", "Data", "Tooling", "Open Source"],
  },
  {
    id: "workshops",
    title: "Workshops",
    tagline: "Learn by doing, not just watching.",
    description:
      "Hands-on technical sessions where you build something by the end. Topics span web development, data science, cloud, DevOps, and more — run by seniors, alumni, and invited experts.",
    icon: BookOpen,
    href: "/events?category=workshop",
    stats: [
      { value: "Hands-on", label: "Format" },
      { value: "Free", label: "For Members" },
      { value: "Beginner", label: "Friendly" },
    ],
    tags: ["Technical", "Practical", "Beginner-Friendly", "Certificates"],
  },
  {
    id: "seminars",
    title: "Seminars",
    tagline: "Real talk from people in the industry.",
    description:
      "Guest speakers — working professionals, alumni, and researchers — share their journeys, insights, and the things no textbook covers. Followed by open Q&A so you can ask what actually matters.",
    icon: Mic,
    href: "/events?category=seminar",
    stats: [
      { value: "Guest", label: "Speakers" },
      { value: "Live Q&A", label: "Every Session" },
      { value: "Alumni", label: "Network" },
    ],
    tags: ["Industry", "Career", "Alumni", "Open Q&A"],
  },
];

/* ─── Dense Circuit Board Panel ─── */

// Each tab has a unique set of PCB trace paths so the visual clearly changes
const circuitPaths: Record<string, string[]> = {
  hackathons: [
    // Dense radial layout — traces fanning out from center like a star
    "M140,140 L140,20", "M140,140 L260,20", "M140,140 L280,140", "M140,140 L260,260",
    "M140,140 L140,280", "M140,140 L20,260", "M140,140 L0,140", "M140,140 L20,20",
    // Cross-connections
    "M60,60 L220,60", "M60,60 L60,220", "M220,60 L220,220", "M60,220 L220,220",
    // Diagonal branches
    "M80,40 L80,100", "M200,40 L200,100", "M40,80 L100,80", "M180,80 L240,80",
    "M80,180 L80,240", "M200,180 L200,240", "M40,200 L100,200", "M180,200 L240,200",
  ],
  projects: [
    // Layered horizontal traces — like a printed circuit board
    "M0,50 L80,50 L100,70 L180,70 L200,50 L280,50",
    "M0,90 L60,90 L80,110 L200,110 L220,90 L280,90",
    "M0,140 L40,140 L60,120 L220,120 L240,140 L280,140",
    "M0,180 L60,180 L80,160 L200,160 L220,180 L280,180",
    "M0,220 L80,220 L100,200 L180,200 L200,220 L280,220",
    // Vertical connections between layers
    "M80,50 L80,90", "M200,50 L200,90", "M60,90 L60,140", "M220,90 L220,140",
    "M80,160 L80,220", "M200,160 L200,220", "M140,70 L140,120", "M140,160 L140,200",
    // Short stubs
    "M120,50 L120,30", "M160,50 L160,30", "M120,220 L120,250", "M160,220 L160,250",
  ],
  workshops: [
    // Tree/branching structure — knowledge spreading
    "M140,260 L140,180", "M140,180 L80,130", "M140,180 L200,130",
    "M80,130 L50,80", "M80,130 L110,80",
    "M200,130 L170,80", "M200,130 L230,80",
    "M50,80 L30,40", "M50,80 L70,40", "M110,80 L90,40", "M110,80 L130,40",
    "M170,80 L150,40", "M170,80 L190,40", "M230,80 L210,40", "M230,80 L250,40",
    // Horizontal cross-bars
    "M30,40 L250,40", "M50,80 L230,80", "M80,130 L200,130",
    // Root extensions
    "M140,260 L100,280", "M140,260 L180,280",
  ],
  seminars: [
    // Concentric rings with spokes — like a broadcast signal
    "M140,140 L140,40", "M140,140 L230,70", "M140,140 L260,140",
    "M140,140 L230,210", "M140,140 L140,240", "M140,140 L50,210",
    "M140,140 L20,140", "M140,140 L50,70",
    // Inner ring connections (octagon)
    "M140,80 L190,95 L210,140 L190,185 L140,200 L90,185 L70,140 L90,95 Z",
    // Outer ring connections
    "M140,50 L215,75 L240,140 L215,205 L140,230 L65,205 L40,140 L65,75 Z",
    // Radial ticks
    "M140,40 L140,25", "M230,70 L242,58", "M260,140 L275,140",
    "M230,210 L242,222", "M140,240 L140,258", "M50,210 L38,222",
    "M20,140 L5,140", "M50,70 L38,58",
  ],
};

// Solder-point positions per tab
const solderPoints: Record<string, [number, number][]> = {
  hackathons: [
    [60,60],[220,60],[60,220],[220,220],[140,20],[280,140],[140,280],[0,140],
    [80,40],[200,40],[80,240],[200,240],[40,80],[240,80],[40,200],[240,200],
  ],
  projects: [
    [80,50],[200,50],[60,90],[220,90],[40,140],[240,140],[60,180],[220,180],
    [80,220],[200,220],[140,70],[140,120],[140,160],[140,200],
    [120,30],[160,30],[120,250],[160,250],
  ],
  workshops: [
    [140,180],[80,130],[200,130],[50,80],[110,80],[170,80],[230,80],
    [30,40],[70,40],[90,40],[130,40],[150,40],[190,40],[210,40],[250,40],
    [140,260],[100,280],[180,280],
  ],
  seminars: [
    [140,80],[190,95],[210,140],[190,185],[140,200],[90,185],[70,140],[90,95],
    [140,50],[215,75],[240,140],[215,205],[140,230],[65,205],[40,140],[65,75],
    [140,25],[275,140],[140,258],[5,140],
  ],
};

function CircuitPanel({ visual, icon: Icon }: { visual: string; icon: any }) {
  const paths = circuitPaths[visual] || circuitPaths.hackathons;
  const points = solderPoints[visual] || solderPoints.hackathons;

  return (
    <div className="relative w-full h-full min-h-[320px] overflow-hidden rounded-2xl bg-bg-primary border border-border-subtle">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, var(--brand-teal), transparent)" }}
      />

      {/* Circuit SVG */}
      <svg viewBox="0 0 280 280" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Traces */}
        {paths.map((d, i) => (
          <path
            key={`path-${i}`}
            d={d}
            stroke="var(--brand-teal)"
            strokeWidth="1.2"
            fill="none"
            opacity={0.12 + (i % 3) * 0.04}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Solder points */}
        {points.map(([cx, cy], i) => (
          <circle
            key={`pt-${i}`}
            cx={cx}
            cy={cy}
            r="2.5"
            fill="var(--brand-teal)"
            opacity={0.2 + (i % 3) * 0.08}
          />
        ))}

        {/* Center chip housing */}
        <rect
          x="108" y="108" width="64" height="64" rx="12"
          fill="var(--brand-teal)"
          fillOpacity="0.06"
          stroke="var(--brand-teal)"
          strokeWidth="1.5"
          opacity="0.4"
        />
        {/* Chip pins — left */}
        <line x1="108" y1="124" x2="94" y2="124" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        <line x1="108" y1="140" x2="94" y2="140" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        <line x1="108" y1="156" x2="94" y2="156" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        {/* Chip pins — right */}
        <line x1="172" y1="124" x2="186" y2="124" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        <line x1="172" y1="140" x2="186" y2="140" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        <line x1="172" y1="156" x2="186" y2="156" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        {/* Chip pins — top */}
        <line x1="124" y1="108" x2="124" y2="94" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        <line x1="140" y1="108" x2="140" y2="94" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        <line x1="156" y1="108" x2="156" y2="94" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        {/* Chip pins — bottom */}
        <line x1="124" y1="172" x2="124" y2="186" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        <line x1="140" y1="172" x2="140" y2="186" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
        <line x1="156" y1="172" x2="156" y2="186" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
      </svg>

      {/* Animated data pulses along traces */}
      <svg viewBox="0 0 280 280" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {paths.slice(0, 6).map((d, i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="3"
            fill="var(--brand-teal)"
            filter="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          >
            <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" path={d} />
          </motion.circle>
        ))}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-brand-teal/10 backdrop-blur-sm">
          <Icon className="w-8 h-8 text-brand-teal" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export function WhatWeDo() {
  const [activeTab, setActiveTab] = useState(0);
  const active = features[activeTab];

  const handleNext = () => setActiveTab((prev) => (prev + 1) % features.length);
  const handlePrev = () => setActiveTab((prev) => (prev - 1 + features.length) % features.length);
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

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
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-teal mb-4">Our Activities</p>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">What We Do</h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          We bridge the gap between theoretical knowledge and practical implementation in the world of Artificial Intelligence.
        </p>
      </motion.div>

      {/* Tab Pills */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setActiveTab(i)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border",
                activeTab === i
                  ? "text-bg-primary border-transparent bg-brand-teal"
                  : "text-text-secondary border-border-subtle hover:border-border-default hover:text-text-primary bg-transparent"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {f.title}
            </button>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) handleNext();
            else if (swipe > swipeConfidenceThreshold) handlePrev();
          }}
          className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch"
        >
          {/* Circuit Panel */}
          <div className="order-2 lg:order-none cursor-grab active:cursor-grabbing">
            <CircuitPanel visual={active.id} icon={active.icon} />
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-none flex flex-col justify-center gap-5">
            <div
              className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-brand-teal border border-brand-teal/25 bg-brand-teal/5"
            >
              <active.icon className="w-3.5 h-3.5" />
              {active.title}
            </div>

            <h3 className="text-2xl md:text-3xl font-display font-bold text-text-primary leading-tight">
              {active.tagline}
            </h3>

            <p className="text-base text-text-secondary leading-relaxed">
              {active.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {active.stats.map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl border border-border-subtle bg-bg-surface/50 text-center">
                  <p className="text-lg font-bold font-display text-brand-teal">{stat.value}</p>
                  <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {active.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-mono text-text-secondary border border-border-subtle bg-bg-surface/30">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={active.href}
              className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-lg text-sm font-bold text-brand-teal bg-brand-teal/10 border border-brand-teal/20 transition-all hover:-translate-y-0.5 hover:bg-brand-teal/15"
            >
              Explore {active.title}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-10">
        {features.map((f, i) => (
          <button
            key={f.id}
            onClick={() => setActiveTab(i)}
            className={cn(
              "transition-all duration-300 rounded-full h-1.5",
              activeTab === i ? "w-6 bg-brand-teal" : "w-1.5 bg-border-default"
            )}
          />
        ))}
      </div>
    </section>
  );
}