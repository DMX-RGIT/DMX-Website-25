"use client";

import { useState } from "react";
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

/* ─── Reusable Bento Components ─── */

function VisualPanel({ icon: Icon, className }: { icon: any; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-bg-primary border border-border-subtle flex items-center justify-center min-h-[220px]", className)}>
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{ background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${ACCENT}, transparent)` }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${ACCENT}40 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}40 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 rounded-tl-md opacity-30" style={{ borderColor: ACCENT }} />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 rounded-tr-md opacity-30" style={{ borderColor: ACCENT }} />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 rounded-bl-md opacity-30" style={{ borderColor: ACCENT }} />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 rounded-br-md opacity-30" style={{ borderColor: ACCENT }} />

      {/* Center icon with glow */}
      <div className="relative flex flex-col items-center gap-4">
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: `color-mix(in srgb, ${ACCENT} 15%, transparent)`,
            border: `1px solid color-mix(in srgb, ${ACCENT} 30%, transparent)`,
            boxShadow: `0 0 40px color-mix(in srgb, ${ACCENT} 20%, transparent), inset 0 0 20px color-mix(in srgb, ${ACCENT} 8%, transparent)`,
          }}
        >
          <Icon className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: ACCENT }} />
        </div>
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ border: `1px solid color-mix(in srgb, ${ACCENT} 40%, transparent)` }}
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
            backgroundColor: ACCENT,
            top: `${20 + (i * 13) % 60}%`,
            left: `${10 + (i * 17) % 80}%`,
            opacity: 0.3,
          }}
          animate={{ y: [0, -8, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

function BentoCell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("p-6 sm:p-8 rounded-2xl border border-border-subtle bg-bg-surface/30 flex flex-col", className)}>
      {children}
    </div>
  );
}

function TitleBlock({ icon: Icon, title, tagline, desc, href }: { icon: any; title: string; tagline: string; desc: string; href: string }) {
  return (
    <div className="flex flex-col h-full justify-between gap-6">
      <div>
        <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border mb-5"
          style={{ color: ACCENT, borderColor: `color-mix(in srgb, ${ACCENT} 40%, transparent)`, background: `color-mix(in srgb, ${ACCENT} 10%, transparent)` }}>
          <Icon className="w-3.5 h-3.5" />
          {title}
        </div>
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary leading-tight mb-3">
          {tagline}
        </h3>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          {desc}
        </p>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:-translate-y-0.5"
        style={{ background: `color-mix(in srgb, ${ACCENT} 15%, transparent)`, color: ACCENT, border: `1px solid color-mix(in srgb, ${ACCENT} 30%, transparent)` }}
      >
        Explore {title}
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/* ─── Tab 1: Hackathons (Visual Left, Title Right, Stats Bottom) ─── */
function HackathonsBento() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <VisualPanel icon={Code2} className="lg:col-span-5 lg:row-span-2 min-h-[250px] lg:min-h-full" />
      <BentoCell className="lg:col-span-7">
        <TitleBlock
          icon={Code2}
          title="Hackathons"
          tagline="Build under pressure. Ship something real."
          desc="Our flagship Hack2Infinity gathers students from across Mumbai to compete, collaborate, and build working products in a single weekend. Open to all streams — CS, IT, EXTC, and more."
          href="/events?category=hackathon"
        />
      </BentoCell>
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Timer, value: "48h", label: "Non-stop" },
          { icon: Users, value: "200+", label: "Hackers" },
          { icon: Trophy, value: "₹50K", label: "Prizes" },
        ].map((s) => (
          <BentoCell key={s.label} className="!p-5 justify-center items-center text-center !bg-bg-surface/50">
            <s.icon className="w-6 h-6 mb-2" style={{ color: ACCENT }} />
            <p className="text-xl font-bold font-display text-text-primary leading-none mb-1">{s.value}</p>
            <p className="text-xs text-text-muted">{s.label}</p>
          </BentoCell>
        ))}
      </div>
    </div>
  );
}

/* ─── Tab 2: Projects (Visual Top Banner, Title Left, Repos Right) ─── */
function ProjectsBento() {
  const repos = [
    { name: "dmx-website", desc: "Club website & admin dashboard", lang: "TypeScript", stars: 12 },
    { name: "ai-workshop-kit", desc: "Starter templates for ML", lang: "Python", stars: 8 },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <VisualPanel icon={Layers} className="lg:col-span-12 lg:h-48 min-h-[160px]" />
      <BentoCell className="lg:col-span-6">
        <TitleBlock
          icon={Layers}
          title="Projects"
          tagline="From idea to deployed product."
          desc="DMX members collaborate on real software projects — web apps, tools, dashboards, and more. Projects are open source, team-driven, and documented so anyone can contribute or learn from them."
          href="/projects"
        />
      </BentoCell>
      <div className="lg:col-span-6 grid grid-rows-2 gap-4">
        {repos.map((repo) => (
          <BentoCell key={repo.name} className="!p-5 justify-center !bg-bg-surface/50 hover:border-brand-teal/30 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4" style={{ color: ACCENT }} />
              <p className="text-sm font-bold text-text-primary font-mono group-hover:text-brand-teal transition-colors">{repo.name}</p>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mb-3 leading-relaxed">{repo.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                <span className="text-xs text-text-muted">{repo.lang}</span>
              </div>
              <div className="flex items-center gap-1 text-text-muted">
                <Star className="w-3.5 h-3.5" />
                <span className="text-xs">{repo.stars}</span>
              </div>
            </div>
          </BentoCell>
        ))}
      </div>
    </div>
  );
}

/* ─── Tab 3: Workshops (Title Left, Visual Right, Checklist Bottom Left) ─── */
function WorkshopsBento() {
  const topics = [
    { title: "Web Development", level: "Beginner → Advanced" },
    { title: "Data Science & ML", level: "Intermediate" },
    { title: "Cloud & DevOps", level: "Beginner" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <BentoCell className="lg:col-span-7">
        <TitleBlock
          icon={BookOpen}
          title="Workshops"
          tagline="Learn by doing, not just watching."
          desc="Hands-on technical sessions where you build something by the end. Topics span web development, data science, cloud, DevOps, and more — run by seniors, alumni, and invited experts."
          href="/events?category=workshop"
        />
      </BentoCell>
      <VisualPanel icon={BookOpen} className="lg:col-span-5 lg:row-span-2 min-h-[250px] lg:min-h-full order-first lg:order-none" />
      <BentoCell className="lg:col-span-7 !bg-bg-surface/50">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">Workshop Topics</p>
        <div className="space-y-3">
          {topics.map((topic) => (
            <div key={topic.title} className="flex items-center gap-3 p-3 rounded-xl bg-bg-surface/80 border border-border-subtle">
              <CheckCircle2 className="w-5 h-5" style={{ color: ACCENT }} />
              <div>
                <p className="text-sm font-semibold text-text-primary">{topic.title}</p>
                <p className="text-xs text-text-muted">{topic.level}</p>
              </div>
            </div>
          ))}
        </div>
      </BentoCell>
    </div>
  );
}

/* ─── Tab 4: Seminars (Quote Top Left, Title Top Right, Visual Bottom Wide) ─── */
function SeminarsBento() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <BentoCell className="lg:col-span-6 lg:row-span-2 !bg-bg-surface/50">
        <TitleBlock
          icon={Mic}
          title="Seminars"
          tagline="Real talk from people in the industry."
          desc="Guest speakers — working professionals, alumni, and researchers — share their journeys, insights, and the things no textbook covers. Followed by open Q&A so you can ask what actually matters."
          href="/events?category=seminar"
        />
      </BentoCell>
      <BentoCell className="lg:col-span-6 flex flex-col justify-center relative !bg-brand-teal/5 border-brand-teal/20">
        <Quote className="w-10 h-10 absolute top-6 left-6 opacity-10" style={{ color: ACCENT }} />
        <div className="relative z-10 p-2 sm:p-4">
          <p className="text-lg text-text-primary font-display italic leading-relaxed mb-6">
            &ldquo;The things no textbook covers — career pivots, failed startups, the reality of tech interviews.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: `color-mix(in srgb, ${ACCENT} 10%, transparent)`, borderColor: `color-mix(in srgb, ${ACCENT} 20%, transparent)` }}>
              <Mic className="w-4 h-4" style={{ color: ACCENT }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Guest Speakers</p>
              <p className="text-xs text-text-muted">Alumni & Industry Pros</p>
            </div>
          </div>
        </div>
      </BentoCell>
      <VisualPanel icon={Mic} className="lg:col-span-6 lg:h-48 min-h-[160px]" />
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
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: ACCENT }}>
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
        {featuresMeta.map((f, i) => {
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
              style={activeTab === i ? { background: ACCENT, boxShadow: `0 0 20px color-mix(in srgb, ${ACCENT} 40%, transparent)` } : {}}
            >
              <Icon className="w-3.5 h-3.5" />
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
      <div className="flex justify-center gap-2 mt-10">
        {featuresMeta.map((f, i) => (
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