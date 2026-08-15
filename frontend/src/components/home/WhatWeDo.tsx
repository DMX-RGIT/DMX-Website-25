"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Layers, BookOpen, Mic, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ACCENT = "var(--brand-teal)";

const features = [
  {
    id: "hackathons",
    title: "Hackathons",
    tagline: "Build under pressure. Ship something real.",
    description: "Our flagship Hack2Infinity gathers students from across Mumbai to compete, collaborate, and build working products in a single weekend. Open to all streams — CS, IT, EXTC, and more.",
    icon: Code2,
    href: "/events?category=hackathon",
    stats: [
      { value: "Annual", label: "Flagship Event" },
      { value: "Open", label: "To All Branches" },
      { value: "Weekend", label: "Format" },
    ],
    tags: ["Hack2Infinity", "Team Event", "Open to All", "Prizes"],
    visual: "hackathon",
  },
  {
    id: "projects",
    title: "Projects",
    tagline: "From idea to deployed product.",
    description: "DMX members collaborate on real software projects — web apps, tools, dashboards, and more. Projects are open source, team-driven, and documented so anyone can contribute or learn from them.",
    icon: Layers,
    href: "/projects",
    stats: [
      { value: "Open", label: "Source" },
      { value: "Team", label: "Driven" },
      { value: "GitHub", label: "Published" },
    ],
    tags: ["Web Dev", "Data", "Tooling", "Open Source"],
    visual: "projects",
  },
  {
    id: "workshops",
    title: "Workshops",
    tagline: "Learn by doing, not just watching.",
    description: "Hands-on technical sessions where you build something by the end. Topics span web development, data science, cloud, DevOps, and more — run by seniors, alumni, and invited experts.",
    icon: BookOpen,
    href: "/events?category=workshop",
    stats: [
      { value: "Hands-on", label: "Format" },
      { value: "Free", label: "For Members" },
      { value: "Beginner", label: "Friendly" },
    ],
    tags: ["Technical", "Practical", "Beginner-Friendly", "Certificates"],
    visual: "workshops",
  },
  {
    id: "seminars",
    title: "Seminars",
    tagline: "Real talk from people in the industry.",
    description: "Guest speakers — working professionals, alumni, and researchers — share their journeys, insights, and the things no textbook covers. Followed by open Q&A so you can ask what actually matters.",
    icon: Mic,
    href: "/events?category=seminar",
    stats: [
      { value: "Guest", label: "Speakers" },
      { value: "Live Q&A", label: "Every Session" },
      { value: "Alumni", label: "Network" },
    ],
    tags: ["Industry", "Career", "Alumni", "Open Q&A"],
    visual: "seminars",
  },
];

/* ─── Unique SVG visual patterns per tab ─── */

function HackathonVisual() {
  return (
    <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
      {/* Circuit board pattern */}
      <path d="M40 140h60l20-20h40l20 20h60" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
      <path d="M40 160h40l20 20h80l20-20h40" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.2" />
      <path d="M140 40v40l-20 20v60l20 20v40" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.25" />
      <path d="M160 60v30l20 20v60l-20 20v30" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.15" />
      {/* Nodes */}
      <circle cx="100" cy="140" r="4" fill="var(--brand-teal)" opacity="0.5" />
      <circle cx="180" cy="140" r="4" fill="var(--brand-teal)" opacity="0.5" />
      <circle cx="140" cy="100" r="4" fill="var(--brand-teal)" opacity="0.4" />
      <circle cx="140" cy="180" r="4" fill="var(--brand-teal)" opacity="0.4" />
      <circle cx="60" cy="140" r="2.5" fill="var(--brand-teal)" opacity="0.3" />
      <circle cx="220" cy="140" r="2.5" fill="var(--brand-teal)" opacity="0.3" />
      {/* Center bracket symbol */}
      <text x="140" y="148" textAnchor="middle" fill="var(--brand-teal)" fontSize="36" fontFamily="monospace" opacity="0.6">{"{ }"}</text>
    </svg>
  );
}

function ProjectsVisual() {
  return (
    <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
      {/* Layered hexagons */}
      <polygon points="140,60 190,85 190,135 140,160 90,135 90,85" stroke="var(--brand-teal)" strokeWidth="1.5" fill="none" opacity="0.15" />
      <polygon points="140,75 180,95 180,130 140,150 100,130 100,95" stroke="var(--brand-teal)" strokeWidth="1.5" fill="none" opacity="0.25" />
      <polygon points="140,90 170,105 170,125 140,140 110,125 110,105" stroke="var(--brand-teal)" strokeWidth="1.5" fill="var(--brand-teal)" fillOpacity="0.08" opacity="0.4" />
      {/* Connection lines going outward */}
      <line x1="90" y1="85" x2="55" y2="65" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.2" />
      <line x1="190" y1="85" x2="225" y2="65" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.2" />
      <line x1="90" y1="135" x2="55" y2="155" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.2" />
      <line x1="190" y1="135" x2="225" y2="155" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.2" />
      {/* Branch dots */}
      <circle cx="55" cy="65" r="3" fill="var(--brand-teal)" opacity="0.3" />
      <circle cx="225" cy="65" r="3" fill="var(--brand-teal)" opacity="0.3" />
      <circle cx="55" cy="155" r="3" fill="var(--brand-teal)" opacity="0.3" />
      <circle cx="225" cy="155" r="3" fill="var(--brand-teal)" opacity="0.3" />
      {/* Git branch lines below */}
      <path d="M100 180h80M120 180v25M160 180v25" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.2" />
      <circle cx="120" cy="205" r="3" fill="var(--brand-teal)" opacity="0.3" />
      <circle cx="160" cy="205" r="3" fill="var(--brand-teal)" opacity="0.3" />
    </svg>
  );
}

function WorkshopsVisual() {
  return (
    <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
      {/* Open book shape */}
      <path d="M140 100c-30-15-60-10-80-5v100c20-5 50-10 80 5" stroke="var(--brand-teal)" strokeWidth="1.5" fill="var(--brand-teal)" fillOpacity="0.04" opacity="0.4" />
      <path d="M140 100c30-15 60-10 80-5v100c-20-5-50-10-80 5" stroke="var(--brand-teal)" strokeWidth="1.5" fill="var(--brand-teal)" fillOpacity="0.04" opacity="0.4" />
      {/* Page lines — left */}
      <line x1="75" y1="115" x2="130" y2="122" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.15" />
      <line x1="75" y1="130" x2="130" y2="137" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.15" />
      <line x1="75" y1="145" x2="130" y2="152" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.15" />
      <line x1="75" y1="160" x2="130" y2="167" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.15" />
      {/* Page lines — right */}
      <line x1="150" y1="122" x2="205" y2="115" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.15" />
      <line x1="150" y1="137" x2="205" y2="130" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.15" />
      <line x1="150" y1="152" x2="205" y2="145" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.15" />
      <line x1="150" y1="167" x2="205" y2="160" stroke="var(--brand-teal)" strokeWidth="1" opacity="0.15" />
      {/* Spine */}
      <line x1="140" y1="95" x2="140" y2="205" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
      {/* Floating knowledge particles */}
      <circle cx="100" cy="75" r="2" fill="var(--brand-teal)" opacity="0.3" />
      <circle cx="180" cy="70" r="2" fill="var(--brand-teal)" opacity="0.25" />
      <circle cx="85" cy="60" r="1.5" fill="var(--brand-teal)" opacity="0.2" />
      <circle cx="195" cy="80" r="1.5" fill="var(--brand-teal)" opacity="0.2" />
      {/* Arrow rising from book */}
      <path d="M140 80l-6 10h12z" fill="var(--brand-teal)" opacity="0.3" />
      <line x1="140" y1="90" x2="140" y2="65" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function SeminarsVisual() {
  return (
    <svg viewBox="0 0 280 280" fill="none" className="w-full h-full">
      {/* Microphone body */}
      <rect x="125" y="100" width="30" height="55" rx="15" stroke="var(--brand-teal)" strokeWidth="1.5" fill="var(--brand-teal)" fillOpacity="0.06" opacity="0.5" />
      {/* Mic arc */}
      <path d="M110 140c0 25 13 40 30 40s30-15 30-40" stroke="var(--brand-teal)" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Stand */}
      <line x1="140" y1="180" x2="140" y2="200" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
      <line x1="120" y1="200" x2="160" y2="200" stroke="var(--brand-teal)" strokeWidth="1.5" opacity="0.3" />
      {/* Sound waves */}
      <path d="M170 115c10 8 10 30 0 40" stroke="var(--brand-teal)" strokeWidth="1" fill="none" opacity="0.2" />
      <path d="M182 105c15 15 15 50 0 60" stroke="var(--brand-teal)" strokeWidth="1" fill="none" opacity="0.15" />
      <path d="M194 95c20 20 20 65 0 80" stroke="var(--brand-teal)" strokeWidth="1" fill="none" opacity="0.1" />
      <path d="M110 115c-10 8-10 30 0 40" stroke="var(--brand-teal)" strokeWidth="1" fill="none" opacity="0.2" />
      <path d="M98 105c-15 15-15 50 0 60" stroke="var(--brand-teal)" strokeWidth="1" fill="none" opacity="0.15" />
      <path d="M86 95c-20 20-20 65 0 80" stroke="var(--brand-teal)" strokeWidth="1" fill="none" opacity="0.1" />
      {/* Audience dots */}
      <circle cx="90" cy="230" r="4" fill="var(--brand-teal)" opacity="0.15" />
      <circle cx="120" cy="235" r="4" fill="var(--brand-teal)" opacity="0.15" />
      <circle cx="150" cy="232" r="4" fill="var(--brand-teal)" opacity="0.15" />
      <circle cx="180" cy="237" r="4" fill="var(--brand-teal)" opacity="0.15" />
    </svg>
  );
}

const visualComponents: Record<string, React.FC> = {
  hackathon: HackathonVisual,
  projects: ProjectsVisual,
  workshops: WorkshopsVisual,
  seminars: SeminarsVisual,
};

function VisualPanel({ visual, icon: Icon }: { visual: string; icon: any }) {
  const VisualSvg = visualComponents[visual];
  return (
    <div className="relative w-full h-full min-h-[280px] overflow-hidden rounded-2xl bg-bg-primary border border-border-subtle flex items-center justify-center">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, var(--brand-teal), transparent)` }}
      />

      {/* SVG illustration */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        {VisualSvg && <VisualSvg />}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 rounded-tl-md opacity-20" style={{ borderColor: ACCENT }} />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 rounded-tr-md opacity-20" style={{ borderColor: ACCENT }} />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 rounded-bl-md opacity-20" style={{ borderColor: ACCENT }} />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 rounded-br-md opacity-20" style={{ borderColor: ACCENT }} />
    </div>
  );
}

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
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-teal mb-4">
          Our Activities
        </p>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
          What We Do
        </h2>
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
                  ? "text-bg-primary border-transparent shadow-lg"
                  : "text-text-secondary border-border-subtle hover:border-border-default hover:text-text-primary bg-transparent"
              )}
              style={activeTab === i ? { background: ACCENT, boxShadow: `0 0 20px color-mix(in srgb, var(--brand-teal) 25%, transparent)` } : {}}
            >
              <Icon className="w-3.5 h-3.5" />
              {f.title}
            </button>
          );
        })}
      </motion.div>

      {/* Main Content Panel */}
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
          {/* Mobile Header */}
          <div className="flex flex-col gap-4 lg:hidden">
            <div
              className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border"
              style={{ color: ACCENT, borderColor: `color-mix(in srgb, var(--brand-teal) 25%, transparent)`, background: `color-mix(in srgb, var(--brand-teal) 6%, transparent)` }}
            >
              <active.icon className="w-3.5 h-3.5" />
              {active.title}
            </div>
            <h3 className="text-2xl font-display font-bold text-text-primary leading-tight">
              {active.tagline}
            </h3>
          </div>

          {/* Visual side */}
          <div className="order-2 lg:order-none cursor-grab active:cursor-grabbing">
            <VisualPanel visual={active.visual} icon={active.icon} />
          </div>

          {/* Text side */}
          <div className="order-3 lg:order-none flex flex-col justify-center gap-6">
            {/* Desktop Header */}
            <div className="hidden lg:flex flex-col gap-6">
              <div
                className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border"
                style={{ color: ACCENT, borderColor: `color-mix(in srgb, var(--brand-teal) 25%, transparent)`, background: `color-mix(in srgb, var(--brand-teal) 6%, transparent)` }}
              >
                <active.icon className="w-3.5 h-3.5" />
                {active.title}
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-text-primary leading-tight">
                {active.tagline}
              </h3>
            </div>

            <div>
              <p className="text-base text-text-secondary leading-relaxed">
                {active.description}
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {active.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-xl border border-border-subtle bg-bg-surface/50 text-center"
                >
                  <p className="text-lg font-bold font-display text-brand-teal">
                    {stat.value}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {active.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-mono text-text-secondary border border-border-subtle bg-bg-surface/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={active.href}
              className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-lg text-sm font-bold text-brand-teal transition-all hover:-translate-y-0.5"
              style={{
                background: `color-mix(in srgb, var(--brand-teal) 10%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--brand-teal) 20%, transparent)`,
              }}
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
            className="transition-all duration-300 rounded-full h-1.5"
            style={{
              width: activeTab === i ? "24px" : "6px",
              background: activeTab === i ? ACCENT : "var(--border-default)",
            }}
          />
        ))}
      </div>
    </section>
  );
}