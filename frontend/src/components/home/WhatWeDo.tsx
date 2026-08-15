"use client";

import { useState, useRef, useEffect } from "react";
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

/* ─── Circuit Node Strip ─── */
function CircuitStrip({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = nodeRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left - rect.left + r.width / 2, y: r.top - rect.top + r.height / 2 };
      });
      setPositions(pos);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto mb-14">
      {/* SVG traces + data flow */}
      {positions.length === features.length && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
          {/* Circuit trace lines between nodes */}
          {positions.slice(0, -1).map((from, i) => {
            const to = positions[i + 1];
            return (
              <line
                key={`trace-${i}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="var(--brand-teal)"
                strokeWidth="2"
                opacity="0.15"
              />
            );
          })}

          {/* Glowing active trace segment */}
          {positions.slice(0, -1).map((from, i) => {
            const to = positions[i + 1];
            const isActiveSegment = i === activeIndex || i + 1 === activeIndex;
            if (!isActiveSegment) return null;
            return (
              <motion.line
                key={`glow-${i}-${activeIndex}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="var(--brand-teal)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            );
          })}

          {/* Data packet dots flowing along ALL traces */}
          {positions.slice(0, -1).map((from, i) => {
            const to = positions[i + 1];
            return (
              <motion.circle
                key={`packet-${i}`}
                r="3"
                fill="var(--brand-teal)"
                initial={{ cx: from.x, cy: from.y, opacity: 0 }}
                animate={{
                  cx: [from.x, to.x],
                  cy: [from.y, to.y],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut",
                }}
              />
            );
          })}

          {/* Active node glow ring */}
          {positions[activeIndex] && (
            <motion.circle
              cx={positions[activeIndex].x}
              cy={positions[activeIndex].y}
              r="30"
              fill="none"
              stroke="var(--brand-teal)"
              strokeWidth="1"
              initial={{ opacity: 0, r: 24 }}
              animate={{ opacity: [0, 0.3, 0], r: [24, 34, 24] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </svg>
      )}

      {/* Node buttons */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-0">
        {features.map((f, i) => {
          const Icon = f.icon;
          const isActive = i === activeIndex;
          return (
            <button
              key={f.id}
              ref={(el) => { nodeRefs.current[i] = el; }}
              onClick={() => onSelect(i)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border",
                  isActive
                    ? "bg-brand-teal/15 border-brand-teal/40 shadow-[0_0_20px_rgba(52,217,166,0.2)]"
                    : "bg-bg-surface/50 border-border-subtle group-hover:border-brand-teal/30 group-hover:bg-brand-teal/5"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300",
                    isActive ? "text-brand-teal" : "text-text-muted group-hover:text-text-secondary"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-semibold transition-colors duration-300",
                  isActive ? "text-brand-teal" : "text-text-muted group-hover:text-text-secondary"
                )}
              >
                {f.title}
              </span>
            </button>
          );
        })}
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
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-teal mb-4">
          Our Activities
        </p>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">What We Do</h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          We bridge the gap between theoretical knowledge and practical implementation
          in the world of Artificial Intelligence.
        </p>
      </motion.div>

      {/* Circuit Strip Navigation */}
      <CircuitStrip activeIndex={activeTab} onSelect={setActiveTab} />

      {/* Content Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) handleNext();
            else if (swipe > swipeConfidenceThreshold) handlePrev();
          }}
          className="rounded-2xl border border-border-subtle bg-bg-secondary/60 backdrop-blur-sm overflow-hidden"
        >
          {/* Content */}
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-2">
              {active.title}
            </p>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary leading-tight mb-4">
              {active.tagline}
            </h3>
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl mb-6">
              {active.description}
            </p>

            <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
              {/* Stats */}
              <div className="flex gap-3 flex-wrap">
                {active.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="px-5 py-3 rounded-xl border border-border-subtle bg-bg-surface/50 text-center min-w-[100px]"
                  >
                    <p className="text-base font-bold font-display text-brand-teal">{stat.value}</p>
                    <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Tags + CTA */}
              <div className="flex flex-col items-start lg:items-end gap-3">
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
                <Link
                  href={active.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-brand-teal bg-brand-teal/10 border border-brand-teal/20 transition-all hover:-translate-y-0.5 hover:bg-brand-teal/15"
                >
                  Explore {active.title}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
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