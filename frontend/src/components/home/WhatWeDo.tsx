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
  },
];

export function WhatWeDo() {
  const [activeTab, setActiveTab] = useState(0);
  const active = features[activeTab];
  const ActiveIcon = active.icon;

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
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border",
                activeTab === i
                  ? "text-bg-primary border-transparent shadow-lg bg-brand-teal"
                  : "text-text-secondary border-border-subtle hover:border-border-default hover:text-text-primary bg-transparent"
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
          {/* Top bar with icon + title + tagline */}
          <div className="p-6 sm:p-8 pb-0 flex flex-col sm:flex-row items-start gap-5">
            {/* Large icon */}
            <div
              className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center bg-brand-teal/10 border border-brand-teal/20"
            >
              <ActiveIcon className="w-8 h-8 sm:w-10 sm:h-10 text-brand-teal" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-2">
                {active.title}
              </p>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary leading-tight mb-3">
                {active.tagline}
              </h3>
              <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
                {active.description}
              </p>
            </div>
          </div>

          {/* Bottom section: stats + tags + CTA */}
          <div className="p-6 sm:p-8 pt-6">
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