"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Layers, BookOpen, Mic, ArrowUpRight,
  Timer, Users, Trophy, GitBranch, Star, Globe,
  GraduationCap, CheckCircle2, Award, Quote, MessageCircle, Radio
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ─── Hackathon Card — Event / Competition style ─── */
function HackathonCard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
      {/* Left: hero text */}
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-bold uppercase tracking-wider">
          <Code2 className="w-3.5 h-3.5" />
          Flagship Event
        </div>

        <h3 className="text-3xl sm:text-4xl font-display font-bold text-text-primary leading-[1.15]">
          Build under pressure.<br />
          <span className="text-brand-teal">Ship something real.</span>
        </h3>

        <p className="text-base text-text-secondary leading-relaxed max-w-xl">
          Our flagship Hack2Infinity gathers students from across Mumbai to compete, collaborate,
          and build working products in a single weekend. Open to all streams — CS, IT, EXTC, and more.
        </p>

        {/* Countdown-style stat blocks */}
        <div className="flex gap-3">
          {[
            { icon: Timer, value: "48h", label: "Non-stop" },
            { icon: Users, value: "200+", label: "Hackers" },
            { icon: Trophy, value: "₹50K+", label: "Prizes" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-surface/60 border border-border-subtle">
              <s.icon className="w-5 h-5 text-brand-teal shrink-0" />
              <div>
                <p className="text-lg font-bold font-display text-text-primary leading-none">{s.value}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/events?category=hackathon"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-bg-primary bg-brand-teal transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          View Hackathons <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Right: event poster style */}
      <div className="hidden lg:flex flex-col items-center gap-3 p-6 rounded-2xl bg-bg-surface/40 border border-border-subtle min-w-[200px]">
        <div className="w-20 h-20 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center">
          <Code2 className="w-10 h-10 text-brand-teal" />
        </div>
        <p className="text-lg font-display font-bold text-text-primary">Hack2Infinity</p>
        <div className="w-full h-px bg-border-subtle" />
        <div className="flex flex-wrap justify-center gap-1.5">
          {["Team Event", "Open to All", "Weekend", "Prizes"].map((t) => (
            <span key={t} className="px-2 py-0.5 text-[10px] font-mono rounded bg-brand-teal/8 text-brand-teal/70 border border-brand-teal/10">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Projects Card — GitHub repo style ─── */
function ProjectsCard() {
  const repos = [
    { name: "dmx-website", desc: "Club website — Next.js, FastAPI", lang: "TypeScript", stars: 12 },
    { name: "ai-workshop-kit", desc: "Starter templates for ML workshops", lang: "Python", stars: 8 },
    { name: "event-dashboard", desc: "Internal analytics & event tracking", lang: "JavaScript", stars: 5 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Open Source
          </div>
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-text-primary leading-[1.15]">
            From idea to<br /><span className="text-brand-teal">deployed product.</span>
          </h3>
          <p className="text-base text-text-secondary leading-relaxed max-w-xl">
            DMX members collaborate on real software projects — web apps, tools, dashboards, and more.
            Open source, team-driven, and documented.
          </p>
        </div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-bg-primary bg-brand-teal transition-all hover:-translate-y-0.5 hover:shadow-lg shrink-0"
        >
          All Projects <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Repo cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {repos.map((repo) => (
          <div key={repo.name} className="p-4 rounded-xl bg-bg-surface/50 border border-border-subtle hover:border-brand-teal/25 transition-colors group">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-brand-teal" />
              <p className="text-sm font-bold text-text-primary font-mono group-hover:text-brand-teal transition-colors">{repo.name}</p>
            </div>
            <p className="text-xs text-text-secondary mb-3 leading-relaxed">{repo.desc}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-teal" />
                <span className="text-[11px] text-text-muted">{repo.lang}</span>
              </div>
              <div className="flex items-center gap-1 text-text-muted">
                <Star className="w-3 h-3" />
                <span className="text-[11px]">{repo.stars}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-1">
        {[
          { icon: Globe, label: "Published on GitHub" },
          { icon: Users, label: "Team-driven" },
          { icon: GitBranch, label: "Open to contributions" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs text-text-muted">
            <item.icon className="w-3.5 h-3.5 text-brand-teal/60" />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Workshops Card — Curriculum / learning style ─── */
function WorkshopsCard() {
  const topics = [
    { title: "Web Development", level: "Beginner → Advanced", done: true },
    { title: "Data Science & ML", level: "Intermediate", done: true },
    { title: "Cloud & DevOps", level: "Beginner", done: false },
    { title: "Open Source Contributions", level: "All Levels", done: false },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: text */}
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Hands-on Learning
        </div>

        <h3 className="text-3xl sm:text-4xl font-display font-bold text-text-primary leading-[1.15]">
          Learn by doing,<br /><span className="text-brand-teal">not just watching.</span>
        </h3>

        <p className="text-base text-text-secondary leading-relaxed">
          Hands-on technical sessions where you build something by the end.
          Run by seniors, alumni, and invited experts.
        </p>

        <div className="flex gap-4">
          {[
            { icon: GraduationCap, value: "Free", sub: "For all members" },
            { icon: Award, value: "Certs", sub: "On completion" },
          ].map((s) => (
            <div key={s.sub} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-teal/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-brand-teal" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{s.value}</p>
                <p className="text-[11px] text-text-muted">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/events?category=workshop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-bg-primary bg-brand-teal transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          View Workshops <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Right: topic checklist */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Workshop Topics</p>
        {topics.map((topic, i) => (
          <div
            key={topic.title}
            className={cn(
              "flex items-center gap-3 p-3.5 rounded-xl border transition-colors",
              topic.done
                ? "bg-brand-teal/5 border-brand-teal/15"
                : "bg-bg-surface/30 border-border-subtle"
            )}
          >
            <CheckCircle2
              className={cn(
                "w-5 h-5 shrink-0",
                topic.done ? "text-brand-teal" : "text-border-default"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-semibold",
                topic.done ? "text-text-primary" : "text-text-secondary"
              )}>
                {topic.title}
              </p>
              <p className="text-[11px] text-text-muted">{topic.level}</p>
            </div>
            <span className={cn(
              "text-[10px] font-mono px-2 py-0.5 rounded",
              topic.done
                ? "bg-brand-teal/10 text-brand-teal"
                : "bg-bg-surface text-text-muted"
            )}>
              {topic.done ? "Completed" : "Upcoming"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Seminars Card — Speaker / talk style ─── */
function SeminarsCard() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-bold uppercase tracking-wider">
            <Mic className="w-3.5 h-3.5" />
            Industry Talks
          </div>
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-text-primary leading-[1.15]">
            Real talk from people<br /><span className="text-brand-teal">in the industry.</span>
          </h3>
        </div>
        <Link
          href="/events?category=seminar"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-bg-primary bg-brand-teal transition-all hover:-translate-y-0.5 hover:shadow-lg shrink-0"
        >
          View Seminars <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Featured quote / testimonial style */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-bg-surface/40 border border-border-subtle">
        <Quote className="w-8 h-8 text-brand-teal/20 absolute top-5 left-6" />
        <div className="relative pl-4 sm:pl-6">
          <p className="text-lg sm:text-xl text-text-primary font-display italic leading-relaxed mb-4">
            &ldquo;The things no textbook covers — career pivots, failed startups, the reality of tech interviews.
            Followed by open Q&A so you can ask what actually matters.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center">
              <Mic className="w-4 h-4 text-brand-teal" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Guest Speakers</p>
              <p className="text-xs text-text-muted">Working professionals, alumni & researchers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Radio, label: "Live Sessions" },
          { icon: MessageCircle, label: "Open Q&A" },
          { icon: Users, label: "Alumni Network" },
          { icon: Award, label: "Industry Insights" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-surface/30 border border-border-subtle">
            <item.icon className="w-4 h-4 text-brand-teal shrink-0" />
            <span className="text-xs font-semibold text-text-secondary">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tab content mapping ─── */
const tabContent: Record<string, React.FC> = {
  hackathons: HackathonCard,
  projects: ProjectsCard,
  workshops: WorkshopsCard,
  seminars: SeminarsCard,
};

const tabMeta = [
  { id: "hackathons", title: "Hackathons", icon: Code2 },
  { id: "projects", title: "Projects", icon: Layers },
  { id: "workshops", title: "Workshops", icon: BookOpen },
  { id: "seminars", title: "Seminars", icon: Mic },
];

/* ─── Main Component ─── */
export function WhatWeDo() {
  const [activeTab, setActiveTab] = useState(0);
  const active = tabMeta[activeTab];
  const ContentComponent = tabContent[active.id];

  const handleNext = () => setActiveTab((prev) => (prev + 1) % tabMeta.length);
  const handlePrev = () => setActiveTab((prev) => (prev - 1 + tabMeta.length) % tabMeta.length);
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
        {tabMeta.map((f, i) => {
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

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) handleNext();
            else if (swipe > swipeConfidenceThreshold) handlePrev();
          }}
          className="rounded-2xl border border-border-subtle bg-bg-secondary/60 p-6 sm:p-8 lg:p-10"
        >
          <ContentComponent />
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-10">
        {tabMeta.map((f, i) => (
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