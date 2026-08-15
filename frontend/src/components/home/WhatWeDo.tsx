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
    description: "Our flagship Hack2Infinity gathers students from across Mumbai to compete, collaborate, and build working products in a single weekend. Open to all streams — CS, IT, EXTC, and more.",
    icon: Code2,
    href: "/events?category=hackathon",
    accent: "#3B82F6",
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
    accent: "#38BDF8",
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
    accent: "#2DD4BF",
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
    accent: "#34D9A6",
    stats: [
      { value: "Guest", label: "Speakers" },
      { value: "Live Q&A", label: "Every Session" },
      { value: "Alumni", label: "Network" },
    ],
    tags: ["Industry", "Career", "Alumni", "Open Q&A"],
    visual: "seminars",
  },
];

function VisualPanel({ visual, accent, icon: Icon }: { visual: string; accent: string; icon: any }) {
  return (
    <div className="relative w-full h-full min-h-[280px] overflow-hidden rounded-2xl bg-bg-primary border border-border-subtle flex items-center justify-center">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{ background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${accent}, transparent)` }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${accent}40 1px, transparent 1px), linear-gradient(90deg, ${accent}40 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 rounded-tl-md opacity-30" style={{ borderColor: accent }} />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 rounded-tr-md opacity-30" style={{ borderColor: accent }} />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 rounded-bl-md opacity-30" style={{ borderColor: accent }} />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 rounded-br-md opacity-30" style={{ borderColor: accent }} />

      {/* Center icon with glow */}
      <div className="relative flex flex-col items-center gap-4">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: `${accent}15`,
            border: `1px solid ${accent}30`,
            boxShadow: `0 0 40px ${accent}20, inset 0 0 20px ${accent}08`,
          }}
        >
          <Icon className="w-12 h-12" style={{ color: accent }} />
        </div>

        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{ border: `1px solid ${accent}40` }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: accent,
            top: `${20 + (i * 13) % 60}%`,
            left: `${10 + (i * 17) % 80}%`,
            opacity: 0.3,
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2.5 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
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
              style={activeTab === i ? { background: f.accent, boxShadow: `0 0 20px ${f.accent}40` } : {}}
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
              style={{ color: active.accent, borderColor: `${active.accent}40`, background: `${active.accent}10` }}
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
            <VisualPanel visual={active.visual} accent={active.accent} icon={active.icon} />
          </div>

          {/* Text side */}
          <div className="order-3 lg:order-none flex flex-col justify-center gap-6">
            {/* Desktop Header */}
            <div className="hidden lg:flex flex-col gap-6">
              <div
                className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border"
                style={{ color: active.accent, borderColor: `${active.accent}40`, background: `${active.accent}10` }}
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
                  className="p-3 rounded-xl border bg-bg-surface/50 text-center"
                  style={{ borderColor: `${active.accent}25` }}
                >
                  <p className="text-lg font-bold font-display" style={{ color: active.accent }}>
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
              className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                background: `${active.accent}18`,
                color: active.accent,
                border: `1px solid ${active.accent}35`,
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
              background: activeTab === i ? f.accent : "var(--border-default)",
            }}
          />
        ))}
      </div>
    </section>
  );
}