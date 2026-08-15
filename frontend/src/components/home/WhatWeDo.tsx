"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
    // Binary / code characters
    chars: "01{}()<>[];=+*/&|!?#$%^~_10",
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
    // Git / version control characters
    chars: "git push merge branch commit deploy ./src >>|",
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
    // Data / math symbols
    chars: "∑∏∫∂Δλπσμ∞≈≠±√∈∉∪∩⊂⊃∀∃0123456789",
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
    // Katakana-inspired + data
    chars: "ァイウエオカキクケコサシスセソタチツテトナニヌネノ01",
  },
];

/* ─── Matrix Rain Canvas ─── */
function MatrixRain({ chars, activeId }: { chars: string; activeId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const dropsRef = useRef<number[]>([]);
  const charsRef = useRef(chars);

  // Update chars without restarting animation
  useEffect(() => {
    charsRef.current = chars;
  }, [chars]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const fontSize = 14;
    const columns = Math.floor(w / fontSize);

    // Initialize drops if needed
    if (dropsRef.current.length !== columns) {
      dropsRef.current = Array.from({ length: columns }, () =>
        Math.random() * -100
      );
    }

    // Fade effect — semi-transparent black overlay
    ctx.fillStyle = "rgba(10, 15, 28, 0.06)";
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${fontSize}px monospace`;

    const currentChars = charsRef.current;

    for (let i = 0; i < columns; i++) {
      const charIndex = Math.floor(Math.random() * currentChars.length);
      const char = currentChars[charIndex];
      const x = i * fontSize;
      const y = dropsRef.current[i] * fontSize;

      // Brighter at the head, fading trail
      const headBrightness = 0.9;
      const normalBrightness = 0.25 + Math.random() * 0.15;
      const isHead = Math.random() > 0.97;

      if (isHead) {
        ctx.fillStyle = `rgba(52, 217, 166, ${headBrightness})`;
        ctx.shadowColor = "rgba(52, 217, 166, 0.8)";
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = `rgba(52, 217, 166, ${normalBrightness})`;
        ctx.shadowBlur = 0;
      }

      ctx.fillText(char, x, y);
      ctx.shadowBlur = 0;

      // Reset drop when it reaches bottom
      if (y > h && Math.random() > 0.975) {
        dropsRef.current[i] = 0;
      }

      dropsRef.current[i] += 0.5 + Math.random() * 0.5;
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = parent.offsetWidth * dpr;
      canvas.height = parent.offsetHeight * dpr;
      canvas.style.width = parent.offsetWidth + "px";
      canvas.style.height = parent.offsetHeight + "px";
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      // Reset drops on resize
      dropsRef.current = [];
    };

    resize();
    window.addEventListener("resize", resize);
    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  // Flash effect on tab change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Bright teal flash
    ctx.fillStyle = "rgba(52, 217, 166, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Reset some drops to create a "surge" effect
    for (let i = 0; i < dropsRef.current.length; i++) {
      if (Math.random() > 0.6) dropsRef.current[i] = Math.random() * -20;
    }
  }, [activeId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1 }}
    />
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
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Matrix Rain Background — spans the entire section */}
      <div className="absolute inset-0">
        <MatrixRain chars={active.chars} activeId={active.id} />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary" />
        <div className="absolute inset-0 bg-bg-primary/40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
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
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border backdrop-blur-sm",
                  activeTab === i
                    ? "text-bg-primary border-brand-teal bg-brand-teal shadow-[0_0_24px_rgba(52,217,166,0.3)]"
                    : "text-text-secondary border-border-subtle hover:border-brand-teal/40 hover:text-text-primary bg-bg-primary/60"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {f.title}
              </button>
            );
          })}
        </motion.div>

        {/* Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) handleNext();
              else if (swipe > swipeConfidenceThreshold) handlePrev();
            }}
            className="rounded-2xl border border-brand-teal/15 bg-bg-primary/70 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(52,217,166,0.05)]"
          >
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Icon + Title row */}
              <div className="flex items-start gap-5 mb-6">
                <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-brand-teal/10 border border-brand-teal/25 shadow-[0_0_20px_rgba(52,217,166,0.1)]">
                  <active.icon className="w-7 h-7 text-brand-teal" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-brand-teal mb-1.5">
                    {`> ${active.id}`}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary leading-tight">
                    {active.tagline}
                  </h3>
                </div>
              </div>

              <p className="text-base text-text-secondary leading-relaxed max-w-3xl mb-8">
                {active.description}
              </p>

              <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
                {/* Stats */}
                <div className="flex gap-3 flex-wrap">
                  {active.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="px-5 py-3 rounded-xl border border-brand-teal/10 bg-brand-teal/5 text-center min-w-[100px]"
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
                        className="px-2.5 py-1 rounded-md text-xs font-mono text-brand-teal/70 border border-brand-teal/15 bg-brand-teal/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={active.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-bg-primary bg-brand-teal transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(52,217,166,0.3)]"
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
                activeTab === i
                  ? "w-6 bg-brand-teal shadow-[0_0_8px_rgba(52,217,166,0.5)]"
                  : "w-1.5 bg-border-default"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}