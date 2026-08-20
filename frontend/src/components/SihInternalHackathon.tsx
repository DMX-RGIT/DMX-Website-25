"use client";

/*
 * SIH 2026 — Internal Hackathon Page
 * Design: DMX Mission Control / Hackathon Briefing
 * All CSS is scoped inside .sih-shell to prevent leaking into other pages.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  motion,
  useAnimation,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Flag,
  Layers3,
  Link2,
  MessageCircle,
  MousePointer2,
  MoveRight,
  Radio,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import confetti from "canvas-confetti";
import teamData from "@/lib/selectedTeams.json";
import problemData from "@/lib/problemStatements.json";
import { MagneticButton } from "@/components/shared/MagneticButton";
import Link from "next/link";

// ─── Data ──────────────────────────────────────────────────────────────────────

const timelineStages = [
  {
    date: "June–August 2026",
    stage: "Registration of SPOCs",
    action: "Institutions register their Single Point of Contact (SPOC).",
    tone: "mint",
  },
  {
    date: "June–August 2026",
    stage: "Internal Hackathon",
    action:
      "Colleges and institutions conduct their internal SIH hackathon and collect student ideas.",
    tone: "blue",
  },
  {
    date: "July–August 2026",
    stage: "SIH Problem Statement Launch",
    action:
      "Official problem statements for Smart India Hackathon 2026 are launched.",
    tone: "amber",
  },
  {
    date: "August 2026",
    stage: "Internal Hackathon Report Compilation and Uploading",
    action:
      "Institutions compile the internal hackathon report and upload it to the SIH portal.",
    tone: "blue",
  },
  {
    date: "August–September 2026",
    stage: "Nomination of Top Teams and Submission of Ideas",
    action:
      "The best teams selected from internal hackathons are nominated, and their ideas are submitted on the SIH portal.",
    tone: "mint",
  },
  {
    date: "September–October 2026",
    stage: "Screening of Ideas",
    action: "Submitted ideas are evaluated and screened.",
    tone: "lime",
  },
  {
    date: "October 2026",
    stage: "Result Publication",
    action:
      "Results of the idea screening and selection process are published.",
    tone: "amber",
  },
  {
    date: "November 2026",
    stage: "Mentoring and Training Sessions",
    action:
      "Selected teams receive mentoring and training to prepare for the next stage.",
    tone: "blue",
  },
  {
    date: "November 2026",
    stage: "Announcement of Shortlisted Students for SIH Grand Finale",
    action:
      "Teams and students selected for the SIH Grand Finale are officially announced.",
    tone: "mint",
  },
  {
    date: "November 2026",
    stage: "Communication of Results to Finalist Teams",
    action:
      "Results and relevant information are communicated to the teams participating in the final stage.",
    tone: "lime",
  },
  {
    date: "December 2026",
    stage: "SIH Grand Finale",
    action:
      "Shortlisted teams participate in the final Smart India Hackathon event.",
    tone: "red",
  },
];

const squadRoles = [
  {
    label: "BUILD",
    contribution: "Turns the chosen idea into a working prototype.",
  },
  {
    label: "RESEARCH",
    contribution: "Frames the problem with evidence and context.",
  },
  {
    label: "DESIGN",
    contribution: "Makes the solution clear, useful, and human.",
  },
  { label: "PITCH", contribution: "Translates the work into a sharp story." },
  {
    label: "TEST",
    contribution: "Challenges assumptions before the jury does.",
  },
  {
    label: "LEAD",
    contribution: "Keeps the team aligned and the signal clear.",
  },
];

const protocolRules = [
  ["01", "Six seats", "Exactly 6 members per team.", "hard"],
  [
    "02",
    "One essential voice",
    "At least 1 female member is mandatory.",
    "hard",
  ],
  ["03", "One campus", "Inter-college teams are not allowed.", "hard"],
  [
    "04",
    "Many disciplines",
    "Different branches and departments are encouraged.",
    "encouraged",
  ],
  [
    "05",
    "One signal",
    "Only the Team Leader completes the registration form.",
    "hard",
  ],
] as const;

// Whether the selected teams have been declared — flip this flag in selectedTeams.json
const TEAMS_DECLARED = teamData.declared as boolean;

const sections = [
  { id: "sih-brief", label: "Brief" },
  { id: "sih-rules", label: "Team protocol" },
  { id: "sih-timeline", label: "Timeline" },
  {
    id: "sih-vault",
    label: TEAMS_DECLARED ? "Selected Teams" : "Problem vault",
  },
];

type Team = {
  id: number;
  name: string;
  status: string;
  message: string;
};
const teams = teamData.teams as Team[];
const teamStatuses: string[] = [
  "All teams",
  ...Array.from(new Set(teams.map((t: Team) => t.status))),
];

type ProblemStatement = {
  sr_no: number;
  problem_statement: string;
  description: string;
  domain: string;
};
const problems = problemData.problem_statements as ProblemStatement[];
const problemDomains: string[] = [
  "All domains",
  ...Array.from(new Set(problems.map((p: ProblemStatement) => p.domain))),
];

// ─── Hooks ─────────────────────────────────────────────────────────────────────

function useActiveSection() {
  const [active, setActive] = useState("sih-brief");
  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const node = document.getElementById(id);
      if (!node) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-32% 0px -58% 0px" },
      );
      observer.observe(node);
      return observer;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);
  return active;
}

function scrollToId(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Scoped CSS ────────────────────────────────────────────────────────────────
// All class names are prefixed with .sih-shell to ensure zero bleed into other pages.

const SIH_STYLES = `
  /* ── Reset & shell ── */
  .sih-shell { position: relative; overflow-x: clip; }
  .sih-shell *, .sih-shell *::before, .sih-shell *::after { box-sizing: border-box; }
  .sih-shell button, .sih-shell a { font: inherit; }
  .sih-shell a { color: inherit; text-decoration: none; }
  .sih-shell button { border: 0; background: none; }
  .sih-shell button:focus-visible,
  .sih-shell a:focus-visible { outline: 2px solid #49e6b2; outline-offset: 4px; }

  /* ── Local tokens ── */
  .sih-shell {
    --sih-bg: #07090D;
    --sih-card: #10141c;
    --sih-mint: #34D9A6;
    --sih-mint-bright: #49e6b2;
    --sih-navy: #1E3A8A;
    --sih-cobalt: #4169e1;
    --sih-blue: #1e9fe6;
    --sih-lime: #b7ed45;
    --sih-amber: #f5a23a;
    --sih-red: #ff5b5f;
    --sih-fg: #f4f7f5;
    --sih-muted: #929aa4;
    --sih-line: rgba(255,255,255,.12);
    --sih-ease-out: cubic-bezier(.23,1,.32,1);
    font-family: "Space Grotesk", "Inter", sans-serif;
    color: var(--sih-fg);
    background: var(--sih-bg);
  }

  /* ── Ambient grid ── */
  .sih-ambient-grid {
    position: fixed; inset: -20%; pointer-events: none; opacity: .15;
    background-image:
      linear-gradient(rgba(52,217,166,.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,217,166,.08) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(circle at 50% 40%, black, transparent 72%);
    z-index: 0;
  }

  /* ── Aurora ── */
  .sih-aurora { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; opacity: .55; }
  .sih-orb {
    position: absolute; display: block; border-radius: 50%;
    opacity: .18; width: 46vw; height: 23vw;
    min-width: 320px; min-height: 160px;
    will-change: transform;
  }
  .sih-orb-1 { top: 5%; left: -12%; background: radial-gradient(ellipse, rgba(52,217,166,.45), transparent 66%); transform: rotate(-16deg); }
  .sih-orb-2 { top: 23%; right: -17%; background: radial-gradient(ellipse, rgba(30,58,138,.55), transparent 68%); transform: rotate(18deg); }
  .sih-orb-3 { top: 61%; left: 24%; background: radial-gradient(ellipse, rgba(183,237,69,.2), transparent 70%); transform: rotate(8deg); }

  /* ── Signal glows ── */
  .sih-glow {
    position: fixed; z-index: 0; pointer-events: none; border-radius: 50%;
    width: 180px; height: 180px; will-change: transform, opacity;
  }
  .sih-glow-1 { top: 21%; left: 43%; background: radial-gradient(circle, rgba(52,217,166,.14), transparent 68%); }
  .sih-glow-2 { top: 69%; right: 13%; width: 220px; height: 220px; background: radial-gradient(circle, rgba(30,58,138,.12), transparent 68%); }

  /* ── Z-stacking ── */
  .sih-shell main, .sih-shell section { position: relative; z-index: 1; }

  /* ── Typography helpers ── */
  .sih-eyebrow {
    display: flex; align-items: center; gap: 9px;
    color: var(--sih-mint); margin-bottom: 24px;
    font: 10px "JetBrains Mono", "IBM Plex Mono", monospace;
    letter-spacing: .13em; text-transform: uppercase;
  }
  .sih-status-dot {
    width: 7px; height: 7px; display: inline-block;
    background: var(--sih-lime); border-radius: 50%;
    box-shadow: 0 0 0 5px rgba(183,237,69,.12);
    animation: sih-blink 2s ease-in-out infinite;
  }
  .sih-terminal {
    margin: 0 0 20px; color: var(--sih-mint);
    font: 12px "JetBrains Mono", "IBM Plex Mono", monospace;
    letter-spacing: .04em;
  }
  .sih-kicker {
    display: flex; align-items: center; gap: 13px;
    color: #8c97a4; margin-bottom: 56px;
    font: 10px "JetBrains Mono", "IBM Plex Mono", monospace;
    letter-spacing: .13em; text-transform: uppercase;
  }
  .sih-kicker > span:first-child { color: var(--sih-mint); }
  .sih-label-orange {
    color: var(--sih-amber); display: block; margin-bottom: 9px;
    font: 10px "JetBrains Mono", monospace; letter-spacing: .13em; text-transform: uppercase;
  }
  .sih-label-mint {
    color: var(--sih-mint);
    font: 10px "JetBrains Mono", monospace; letter-spacing: .13em; text-transform: uppercase;
  }

  /* ── Section padding ── */
  .sih-pad { padding: 110px clamp(20px, 7vw, 110px); }

  /* ══════════════════════════════════════
     HERO
  ══════════════════════════════════════ */
  .sih-hero {
    min-height: 820px;
    padding: 80px clamp(20px, 8vw, 110px) 90px;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(300px, .7fr);
    gap: 6vw;
    align-items: center;
    position: relative;
    isolation: isolate;
  }
  .sih-hero-art {
    position: absolute; inset: 0; top: -100px; z-index: -1;
    background:
      radial-gradient(circle at 78% 28%, rgba(30,58,138,.18), transparent 30%),
      radial-gradient(circle at 90% 82%, rgba(52,217,166,.12), transparent 28%),
      linear-gradient(90deg, rgba(7,9,13,.98) 0%, rgba(7,9,13,.9) 45%, rgba(7,9,13,.55) 100%);
  }
  .sih-hero-copy { max-width: 760px; }
  .sih-hero-copy h1 {
    margin: 0; font-weight: 700;
    font-size: clamp(56px, 7.5vw, 118px);
    letter-spacing: -.065em; line-height: .93;
    font-family: "Space Grotesk", sans-serif;
  }
  .sih-hero-copy h1 em { font-style: normal; color: var(--sih-mint); }
  .sih-hero-copy h1 span {
    color: #5d6670; font-size: .48em; vertical-align: top;
    letter-spacing: -.03em; margin-left: .12em;
  }
  .sih-hero-deck {
    color: #bec6cf; max-width: 520px;
    font-size: 17px; line-height: 1.65; margin: 28px 0 30px;
  }
  .sih-hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; }

  /* ── CTA buttons ── */
  .sih-btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 20px;
    background: var(--brand-teal, var(--sih-mint)); color: var(--bg-primary, #06110e);
    font-weight: 700; font-size: 13px; letter-spacing: .02em;
    transition: transform .18s var(--sih-ease-out), box-shadow .18s ease, background .18s ease;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(52,217,166,0.3);
  }
  .sih-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 25px rgba(52,217,166,0.5);
    background: var(--brand-teal-light, #3FE0B0);
  }
  .sih-btn-text {
    background: none; color: #aeb8c2; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    font: 11px "JetBrains Mono", monospace; text-transform: uppercase; letter-spacing: .07em;
    transition: color .18s ease; border: none;
  }
  .sih-btn-text:hover { color: var(--sih-mint); }
  .sih-btn-secondary {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 12px 16px;
    color: #e4ebe7; background: transparent;
    border: 1px solid var(--sih-line); font-size: 12px; letter-spacing: .02em;
    transition: border-color .18s ease, color .18s ease;
    border-radius: 2px;
  }
  .sih-btn-secondary:hover { border-color: var(--sih-mint); color: var(--sih-mint); }

  /* ── Console card (hero right column) ── */
  .sih-console {
    width: min(100%, 380px); justify-self: end;
    border: 1px solid rgba(52,217,166,.28);
    background: rgba(8,10,15,.95);
    box-shadow: 16px 16px 0 rgba(30,58,138,.14), 0 0 0 1px rgba(52,217,166,.05);
    padding: 22px;
    transform: rotate(1.5deg);
  }
  .sih-console-top {
    color: #79838e; display: flex; justify-content: space-between; gap: 12px;
    border-bottom: 1px solid var(--sih-line); padding-bottom: 14px;
    font: 10px "JetBrains Mono", monospace; letter-spacing: .13em; text-transform: uppercase;
  }
  .sih-console-number {
    color: var(--sih-mint);
    font: 600 88px/.9 "Space Grotesk", sans-serif;
    letter-spacing: -.1em; padding: 24px 0 18px;
  }
  .sih-console-number span {
    display: block; color: #9ca5b0;
    font: 11px "JetBrains Mono", monospace;
    letter-spacing: .12em; text-transform: uppercase; margin: 8px 0 0 5px;
  }
  .sih-console-rule {
    height: 4px; width: 72%;
    background: linear-gradient(90deg, var(--sih-mint), var(--sih-navy));
    margin-bottom: 17px;
  }
  .sih-console-list { display: grid; gap: 14px; }
  .sih-console-list div { display: grid; grid-template-columns: 32px 1fr; align-items: center; }
  .sih-console-list span { color: var(--sih-amber); font: 11px "JetBrains Mono", monospace; grid-row: span 2; }
  .sih-console-list b { font-size: 16px; font-weight: 500; }
  .sih-console-list small { color: #77808b; font: 10px "JetBrains Mono", monospace; text-transform: uppercase; letter-spacing: .08em; }
  .sih-console-footer {
    margin-top: 22px; border-top: 1px solid var(--sih-line); padding-top: 15px;
    color: var(--sih-lime); display: flex; gap: 7px; align-items: center;
    font: 10px "JetBrains Mono", monospace; letter-spacing: .13em; text-transform: uppercase;
  }

  /* scroll cue */
  .sih-scroll-cue {
    position: absolute; bottom: 32px; left: clamp(20px, 8vw, 110px);
    color: #717b87; display: flex; align-items: center; gap: 11px;
    font: 10px "JetBrains Mono", monospace; letter-spacing: .13em;
  }

  /* ══════════════════════════════════════
     INTRO
  ══════════════════════════════════════ */
  .sih-intro { background: transparent; }
  .sih-intro-grid { display: grid; grid-template-columns: 1fr .85fr; gap: 12vw; }
  .sih-intro-heading h2 {
    margin: 0; font-weight: 650;
    font-size: clamp(40px, 5.5vw, 78px);
    letter-spacing: -.065em; line-height: .93;
    font-family: "Space Grotesk", sans-serif;
  }
  .sih-intro-heading h2 span { color: var(--sih-mint); }
  .sih-intro-body { max-width: 535px; align-self: end; color: #adb6c1; line-height: 1.7; font-size: 17px; }
  .sih-intro-body p { margin: 0 0 22px; }
  .sih-inline-status {
    display: flex; align-items: center; gap: 10px;
    font: 11px "JetBrains Mono", monospace; color: var(--sih-lime);
    text-transform: uppercase; letter-spacing: .05em;
    border-top: 1px solid var(--sih-line); padding-top: 18px;
  }

  /* ══════════════════════════════════════
     RULES / TEAM PROTOCOL
  ══════════════════════════════════════ */
  .sih-rules { background: transparent; }
  .sih-squad-layout { display: grid; grid-template-columns: .82fr 1.18fr; gap: clamp(40px, 7vw, 110px); align-items: center; }
  .sih-squad-command > p:nth-of-type(2) { max-width: 390px; color: #a6b1bb; line-height: 1.65; margin: 27px 0 0; }
  .sih-squad-command h2 {
    margin: 0; font-weight: 650;
    font-size: clamp(40px, 5.5vw, 78px);
    letter-spacing: -.065em; line-height: .93;
    font-family: "Space Grotesk", sans-serif;
  }
  .sih-squad-command h2 span { color: var(--sih-mint); }

  /* squad diagram */
  .sih-squad-system {
    position: relative; width: 100%; max-width: 480px; aspect-ratio: 1.24;
    margin: 24px auto 10px;
    overflow: visible; isolation: isolate;
  }
  .sih-squad-circuit { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .sih-squad-circuit path { fill: none; stroke: rgba(52,217,166,.3); stroke-width: 1.3; stroke-dasharray: 5 7; vector-effect: non-scaling-stroke; }
  .sih-squad-circuit .spine { stroke: rgba(30,58,138,.7); stroke-dasharray: none; }
  .sih-squad-circuit circle { fill: rgba(8,10,15,.7); stroke: rgba(52,217,166,.6); stroke-width: 1.2; vector-effect: non-scaling-stroke; }
  .sih-squad-core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: grid; justify-items: center; gap: 3px; color: var(--sih-mint); z-index: 2; }
  .sih-squad-core strong { font: 600 62px/.8 "Space Grotesk", sans-serif; letter-spacing: -.1em; }
  .sih-squad-core small { color: #77848f; font: 9px "JetBrains Mono", monospace; letter-spacing: .12em; }

  .sih-squad-node {
    position: absolute; z-index: 3;
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 9px; border: 1px solid rgba(255,255,255,.18);
    background: rgba(8,10,15,.72); color: #d8e0dc;
    font: 9px "JetBrains Mono", monospace; letter-spacing: .07em;
    cursor: pointer;
    transition: opacity .22s ease, transform .22s var(--sih-ease-out), border-color .22s ease, color .22s ease;
  }
  .sih-squad-node i { color: var(--sih-amber); font-style: normal; }
  .sih-squad-node.is-dimmed { opacity: .25; }
  .sih-squad-node.is-active { color: var(--sih-mint); border-color: var(--sih-mint); transform: translateY(-3px) scale(1.04); box-shadow: 0 0 18px rgba(52,217,166,.15); }
  .sih-node-1 { top: 8%; left: 35%; }
  .sih-node-2 { top: 26%; right: 2%; }
  .sih-node-3 { bottom: 18%; right: 2%; }
  .sih-node-4 { bottom: 5%; left: 34%; }
  .sih-node-5 { bottom: 18%; left: 2%; }
  .sih-node-6 { top: 26%; left: 2%; }
  .sih-role-tooltip {
    position: absolute; z-index: 5;
    left: 50%; bottom: calc(100% + 9px); width: 180px;
    padding: 9px 10px; color: #aab8c1;
    background: #111820; border: 1px solid rgba(52,217,166,.34);
    font: 10px/1.45 "JetBrains Mono", monospace;
    text-align: left; text-transform: none; letter-spacing: 0;
    opacity: 0; pointer-events: none;
    transform: translate(-50%, 5px); transition: opacity .18s ease, transform .18s ease;
  }
  .sih-squad-node:hover .sih-role-tooltip,
  .sih-squad-node:focus-visible .sih-role-tooltip,
  .sih-squad-node.is-active .sih-role-tooltip { opacity: 1; transform: translate(-50%, 0); }

  .sih-squad-caption { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; color: var(--sih-lime); font: 10px "JetBrains Mono", monospace; letter-spacing: .11em; margin-top: 16px; }
  .sih-squad-legend { margin-left: auto; color: #6c7a86; font-size: 9px; }

  /* protocol tiles */
  .sih-protocol-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .sih-tile {
    min-height: 168px; display: flex; flex-direction: column; justify-content: space-between;
    padding: 19px; border: 1px solid rgba(255,255,255,.14);
    background: rgba(8,10,15,.5); position: relative; 
    overflow: hidden; transform: translateZ(0); border-radius: 12px;
    transition: transform .22s var(--sih-ease-out), border-color .22s ease, background .22s ease;
  }
  .sih-tile::after {
    content: ""; position: absolute; width: 78px; height: 78px;
    right: -22px; bottom: -25px; border: 1px solid currentColor;
    border-radius: 50%; opacity: .32;
  }
  .sih-tile:hover { transform: translateY(-5px); border-color: currentColor; background: rgba(16,24,31,.8); }
  .sih-tile-top { display: flex; justify-content: space-between; color: currentColor; }
  .sih-tile-top span { font: 11px "JetBrains Mono", monospace; }
  .sih-tile h3 { margin: 24px 0 6px; color: #f4f7f5; font-size: 20px; font-weight: 500; letter-spacing: -.04em; }
  .sih-tile p { margin: 0; color: #8996a2; font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
  .sih-tile-hard { color: var(--sih-mint); border-color: rgba(52,217,166,.22); }
  .sih-tile-hard::after { border-color: var(--sih-mint); }
  .sih-tile-encouraged { color: var(--sih-blue); border-color: rgba(30,159,230,.32); }
  .sih-tile-encouraged::after { border-color: var(--sih-blue); }

  /* ══════════════════════════════════════
     NOTICE
  ══════════════════════════════════════ */
  .sih-notice { padding-top: 20px; padding-bottom: 20px; background: transparent; }
  .sih-notice-card {
    display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;
    max-width: 800px; margin: 0 auto;
    border: 1px solid rgba(245,162,58,.35); padding: 32px 40px;
    background: rgba(245,162,58,.05);
    border-radius: 12px;
  }
  .sih-notice-icon {
    color: var(--sih-amber); width: 44px; height: 44px;
    display: grid; place-items: center;
    border: 1px solid rgba(245,162,58,.4);
    border-radius: 50%;
  }
  .sih-notice-card h3 { margin: 0 0 9px; font-size: 22px; font-weight: 500; }
  .sih-notice-card p { color: #9ca7b3; line-height: 1.6; margin: 0; font-size: 14px; }
  .sih-notice-card strong { color: #f2c988; font-weight: 500; }

  /* ══════════════════════════════════════
     TIMELINE
  ══════════════════════════════════════ */
  .sih-timeline { background: transparent; }
  .sih-timeline-header { display: flex; justify-content: space-between; align-items: end; gap: 40px; margin-bottom: 52px; max-width: 900px; margin-left: auto; margin-right: auto; }
  .sih-timeline-header h2 {
    margin: 0; font-weight: 650;
    font-size: clamp(40px, 5.5vw, 78px);
    letter-spacing: -.065em; line-height: .93;
    font-family: "Space Grotesk", sans-serif;
  }
  .sih-timeline-header h2 span { color: var(--sih-blue); }
  .sih-timeline-header > p { max-width: 285px; color: #9aa6b2; line-height: 1.6; }

  .sih-timeline-shell {
    max-width: 900px; margin: 0 auto;
    border: 1px solid rgba(52,217,166,.26);
    background: linear-gradient(145deg, rgba(16,24,31,.92), rgba(8,13,19,.9));
    padding: clamp(20px, 4vw, 40px);
    box-shadow: 14px 16px 0 rgba(30,58,138,.12);
    border-radius: 12px;
  }
  .sih-timeline-intro {
    display: flex; justify-content: space-between; align-items: center; gap: 20px;
    color: #75828e; font: 10px "JetBrains Mono", monospace;
    letter-spacing: .1em; text-transform: uppercase;
    padding-bottom: 24px; border-bottom: 1px solid var(--sih-line);
  }
  .sih-timeline-intro > div { display: inline-flex; align-items: center; gap: 9px; color: var(--sih-mint); }

  .sih-motion-timeline { position: relative; padding: 21px 0 10px; }
  .sih-track { position: absolute; top: 21px; bottom: 28px; left: 19px; width: 2px; }
  .sih-track-base { position: absolute; inset: 0; background: #303d48; }
  .sih-track-fill { position: absolute; top: 0; left: 0; right: 0; background: linear-gradient(var(--sih-mint), var(--sih-blue), var(--sih-amber)); transform-origin: top; }
  .sih-track-signal {
    position: absolute; left: 50%; width: 10px; height: 10px;
    border-radius: 50%; background: var(--sih-mint);
    box-shadow: 0 0 0 5px rgba(52,217,166,.15), 0 0 18px var(--sih-mint);
    transform: translate(-50%, -50%);
  }

  .sih-stage {
    position: relative; display: grid;
    grid-template-columns: 54px minmax(150px, .34fr) minmax(0, 1fr) minmax(110px, .24fr);
    gap: 18px; align-items: start; min-height: 110px; padding: 0 0 32px;
  }
  .sih-stage-marker {
    position: relative; z-index: 2; width: 40px; height: 40px;
    display: grid; place-items: center;
    border: 1px solid currentColor; background: #0c1118;
    font: 11px "JetBrains Mono", monospace; color: var(--sih-mint);
  }
  .sih-stage-date { color: #8b98a5; font: 10px "JetBrains Mono", monospace; text-transform: uppercase; letter-spacing: .08em; line-height: 1.5; padding-top: 10px; }
  .sih-stage-copy { min-width: 0; border-left: 1px solid var(--sih-line); padding-left: 18px; }
  .sih-stage-copy h3 { margin: 6px 0 8px; color: #f3f6f4; font-size: clamp(16px, 1.8vw, 23px); font-weight: 500; letter-spacing: -.035em; line-height: 1.08; overflow-wrap: anywhere; }
  .sih-stage-copy p { margin: 0; color: #97a3ae; font-size: 14px; line-height: 1.55; max-width: 600px; overflow-wrap: anywhere; }
  .sih-stage-status { color: #66737e; font: 9px "JetBrains Mono", monospace; letter-spacing: .08em; padding-top: 12px; text-align: right; }
  .sih-status-pip {
    width: 6px; height: 6px; display: inline-block; margin-right: 6px;
    border-radius: 50%; background: currentColor; vertical-align: middle;
    animation: sih-blink 2s ease-in-out infinite;
  }

  /* tone colors */
  .sih-tone-mint { color: var(--sih-mint); }
  .sih-tone-blue { color: var(--sih-blue); }
  .sih-tone-amber { color: var(--sih-amber); }
  .sih-tone-lime { color: var(--sih-lime); }
  .sih-tone-red { color: var(--sih-red); }

  /* current stage highlight */
  .sih-stage-current {
    position: relative; z-index: 2; margin: 0 -18px 32px;
    padding: 19px 18px; background: #0e2b23;
    border: 1px solid rgba(52,217,166,.85);
    box-shadow: 0 0 0 1px rgba(52,217,166,.12), 0 0 26px rgba(52,217,166,.16), inset 0 0 24px rgba(52,217,166,.05);
  }
  .sih-stage-current::after {
    content: "LIVE"; position: absolute; top: -9px; right: 17px;
    padding: 3px 7px; background: var(--sih-mint); color: #06110e;
    font: 9px "JetBrains Mono", monospace; letter-spacing: .12em;
  }
  .sih-stage-current .sih-stage-marker { background: var(--sih-mint); color: #06110e; border-color: var(--sih-mint); box-shadow: 0 0 0 5px rgba(52,217,166,.2), 0 0 20px rgba(52,217,166,.5); }
  .sih-stage-current .sih-stage-date, .sih-stage-current .sih-stage-copy p { color: #c5e9dc; }
  .sih-stage-current .sih-stage-copy h3 { color: #ffffff; }
  .sih-stage-current .sih-stage-status { display: inline-flex; justify-content: flex-end; align-items: center; gap: 4px; color: #9fffe0; font-weight: 600; }
  .sih-stage-current .sih-status-pip { background: var(--sih-mint); box-shadow: 0 0 10px var(--sih-mint); }
  .sih-stage-complete { opacity: .65; }
  .sih-stage-upcoming .sih-stage-marker { opacity: .72; }

  .sih-timeline-endcap { display: flex; align-items: center; gap: 9px; border-top: 1px solid var(--sih-line); padding-top: 19px; color: var(--sih-lime); font: 10px "JetBrains Mono", monospace; letter-spacing: .1em; }

  /* ══════════════════════════════════════
     PROBLEM VAULT
  ══════════════════════════════════════ */
  .sih-vault { position: relative; background: transparent; isolation: isolate; }
  .sih-vault-backdrop {
    position: absolute; inset: 0; z-index: -1;
    background:
      radial-gradient(circle at 76% 28%, rgba(30,58,138,.13), transparent 26%),
      radial-gradient(circle at 18% 76%, rgba(52,217,166,.08), transparent 24%);
  }
  .sih-vault-header { display: flex; justify-content: space-between; align-items: end; gap: 30px; }
  .sih-vault-header h2 {
    margin: 0; font-weight: 650;
    font-size: clamp(40px, 5.5vw, 78px);
    letter-spacing: -.065em; line-height: .93;
    font-family: "Space Grotesk", sans-serif;
  }
  .sih-vault-header h2 span { color: var(--sih-mint); }

  /* tools */
  .sih-vault-tools { display: grid; justify-items: end; gap: 8px; }
  .sih-vault-tools > label { color: #75818d; font: 9px "JetBrains Mono", monospace; letter-spacing: .1em; text-transform: uppercase; }
  .sih-vault-tools select {
    width: min(100%, 260px); border: 1px solid rgba(52,217,166,.28);
    background: rgba(8,10,15,.75); color: #cbd5d1;
    padding: 9px 11px; font: 10px "JetBrains Mono", monospace; outline: none;
    cursor: pointer;
  }
  .sih-vault-tools select:focus { border-color: var(--sih-mint); }
  .sih-vault-count { text-align: right; font: 10px "JetBrains Mono", monospace; color: var(--sih-amber); letter-spacing: .12em; text-transform: uppercase; margin-top: 11px; }
  .sih-vault-count strong { display: block; color: var(--sih-mint); font: 52px/.95 "Space Grotesk", sans-serif; font-weight: 600; letter-spacing: -.08em; margin-top: 8px; }
  .sih-vault-count small { color: #66727d; font-size: 18px; letter-spacing: -.04em; }

  /* card deck */
  .sih-vault-workspace { min-height: 540px; display: grid; grid-template-columns: 90px 1fr; gap: 3vw; align-items: center; margin-top: 55px; }
  .sih-vault-side { display: grid; gap: 12px; justify-items: center; color: var(--sih-mint); font: 10px "JetBrains Mono", monospace; text-align: center; text-transform: uppercase; letter-spacing: .08em; }
  .sih-card-deck { position: relative; width: min(100%, 650px); aspect-ratio: 1.35; justify-self: center; user-select: none; touch-action: pan-y; }
  .sih-card {
    position: absolute; inset: 0;
    border: 1px solid rgba(52,217,166,.45);
    background: linear-gradient(145deg, rgba(16,27,35,.98), rgba(8,13,19,.97));
    padding: clamp(22px, 4vw, 40px); display: flex; flex-direction: column;
    box-shadow: 14px 16px 0 rgba(30,58,138,.14);
    border-radius: 12px;
  }
  .sih-card-behind-1 { transform: translate(20px, -19px) rotate(3deg); opacity: .5; border-color: rgba(30,58,138,.4); }
  .sih-card-behind-2 { transform: translate(38px, -37px) rotate(6deg); opacity: .25; border-color: rgba(245,162,58,.4); }
  .sih-card-front { cursor: grab; transition: transform .28s var(--sih-ease-out), box-shadow .28s ease; }
  .sih-card-front:active { cursor: grabbing; transform: rotate(-1.5deg) scale(.99); }
  .sih-card-topline { display: flex; align-items: center; gap: 13px; font: 10px "JetBrains Mono", monospace; text-transform: uppercase; letter-spacing: .1em; }
  .sih-card-index { color: var(--sih-mint); font: 15px "JetBrains Mono", monospace; }
  .sih-card-domain { color: #9aa5b0; max-width: 50%; }
  .sih-card-flag { color: var(--sih-amber); display: inline-flex; align-items: center; gap: 5px; margin-left: auto; }
  .sih-card h3 {
    max-width: 520px; font-size: clamp(22px, 3.2vw, 40px); font-weight: 500;
    letter-spacing: -.05em; line-height: 1.03; margin: auto 0 18px;
    min-width: 0; overflow-wrap: anywhere; word-break: break-word;
  }
  .sih-card p { color: #a3adb7; font-size: 15px; line-height: 1.65; max-width: 560px; margin: 0 0 auto; overflow-wrap: anywhere; }
  .sih-card-bottom {
    color: #63727d; display: flex; justify-content: space-between; gap: 15px;
    border-top: 1px solid var(--sih-line); padding-top: 17px; margin-top: 28px;
    font: 10px "JetBrains Mono", monospace; letter-spacing: .08em; text-transform: uppercase;
  }
  .sih-card-bottom span { min-width: 0; overflow-wrap: anywhere; }

  /* controls */
  .sih-vault-controls { display: flex; align-items: center; gap: 22px; margin: 32px auto 0; width: min(100%, 650px); }
  .sih-vault-controls > button {
    width: 39px; height: 39px; border: 1px solid var(--sih-line);
    background: rgba(8,10,15,.7); color: white;
    display: grid; place-items: center; cursor: pointer;
    transition: border-color .18s ease, color .18s ease, transform .18s ease;
  }
  .sih-vault-controls > button:hover { border-color: var(--sih-mint); color: var(--sih-mint); transform: translateY(-2px); }
  .sih-pips { flex: 1; display: flex; gap: 5px; }
  .sih-pips button { flex: 1; height: 3px; background: #3a424c; cursor: pointer; border: none; transition: background .18s ease; }
  .sih-pips button.active { background: var(--sih-mint); }

  .sih-vault-footnote { margin: 50px 0 0 90px; color: #87929d; display: flex; align-items: center; gap: 15px; font: 11px "JetBrains Mono", monospace; }
  .sih-vault-led { display: inline-flex; align-items: center; gap: 7px; color: var(--sih-lime); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
  .sih-vault-footnote a { color: var(--sih-mint); display: inline-flex; align-items: center; gap: 6px; }
  .sih-vault-footnote a:hover { color: #3FE0B0; }

  /* ══════════════════════════════════════
     ACTION / CTA
  ══════════════════════════════════════ */
  .sih-action { background: transparent; }
  .sih-action-panel {
    display: grid; grid-template-columns: 1fr .8fr; gap: 8vw;
    padding: clamp(26px, 5vw, 68px);
    border: 1px solid rgba(52,217,166,.22);
    background: rgba(16,20,28,.75);
    border-radius: 12px;
  }
  .sih-action-panel > div:first-child > p:last-child { max-width: 475px; color: #9da8b3; line-height: 1.65; margin: 28px 0 0; }
  .sih-action-panel h2 {
    margin: 0; font-weight: 650;
    font-size: clamp(36px, 5vw, 72px);
    letter-spacing: -.065em; line-height: .93;
    font-family: "Space Grotesk", sans-serif;
  }
  .sih-action-panel h2 span { color: var(--sih-mint); }
  .sih-action-links { display: grid; align-content: center; justify-items: start; gap: 13px; }

  /* ══════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════ */
  @media (max-width: 900px) {
    .sih-hero { grid-template-columns: 1fr; min-height: 860px; gap: 48px; }
    .sih-console { justify-self: start; transform: rotate(0); width: min(100%, 420px); }
    .sih-intro-grid { grid-template-columns: 1fr; gap: 42px; }
    .sih-squad-layout { grid-template-columns: 1fr; gap: 40px; }
    .sih-squad-system { margin-left: auto; margin-right: auto; }
    .sih-squad-legend { display: block; margin: 7px 0 0; }
    .sih-timeline-header { display: block; }
    .sih-timeline-header > p { margin-top: 25px; }
    .sih-stage { grid-template-columns: 45px 1fr; gap: 11px; min-height: 0; padding-bottom: 28px; }
    .sih-stage-date { grid-column: 2; grid-row: 1; padding-top: 4px; }
    .sih-stage-copy { grid-column: 2; grid-row: 2; border-left: 0; border-top: 1px solid var(--sih-line); padding: 12px 0 0; }
    .sih-stage-status { grid-column: 2; grid-row: 3; padding-top: 12px; text-align: left; }
    .sih-stage-current { margin-left: -8px; margin-right: -8px; padding-left: 8px; padding-right: 8px; }
    .sih-stage-current .sih-stage-status { justify-content: flex-start; }
    .sih-vault-header { display: block; }
    .sih-vault-tools { justify-items: start; margin-top: 20px; }
    .sih-vault-workspace { grid-template-columns: 1fr; margin-top: 28px; }
    .sih-vault-side { flex-direction: row; justify-content: center; display: flex; }
    .sih-vault-footnote { margin-left: 0; }
    .sih-action-panel { grid-template-columns: 1fr; gap: 40px; }
    .sih-timeline-intro { align-items: flex-start; flex-direction: column; gap: 10px; }
  }
  @media (max-width: 768px) {
    /* Kill expensive animations on mobile */
    .sih-orb { animation: none !important; transform: none !important; }
    .sih-glow { animation: none !important; opacity: 0 !important; }
    .sih-ambient-grid { transform: none !important; }
  }
  @media (max-width: 560px) {
    .sih-pad { padding: 90px 24px; }
    .sih-hero { padding-left: 24px; padding-right: 24px; }
    .sih-hero-copy h1 { font-size: clamp(50px, 15vw, 76px); }
    .sih-hero-deck { font-size: 16px; }
    .sih-hero-actions { align-items: flex-start; flex-direction: column; gap: 16px; }
    .sih-scroll-cue { bottom: 20px; }
    .sih-protocol-tiles { grid-template-columns: 1fr; gap: 16px; }
    .sih-tile { min-height: 136px; }
    .sih-notice-card { grid-template-columns: 1fr; gap: 20px; padding: 24px; }
    .sih-motion-timeline-shell { padding: 16px 12px; }
    .sih-stage-copy h3 { font-size: 18px; }
    .sih-stage-copy p { font-size: 13px; }
    .sih-vault-workspace { min-height: 0; }
    .sih-card-deck { width: 100%; height: 460px; aspect-ratio: auto; }
    .sih-card { padding: 24px; }
    .sih-card h3 { font-size: 20px; margin-bottom: 12px; }
    .sih-card p { font-size: 13px; line-height: 1.5; }
    .sih-card-domain { max-width: 43%; font-size: 8px; line-height: 1.5; }
    .sih-card-bottom { font-size: 8px; margin-top: 18px; }
    .sih-vault-tools select { width: 100%; }

    /* Elegant spiral scaling */
    .sih-squad-system {
      min-width: 480px;
      transform-origin: top center;
      transform: scale(0.75);
      margin-bottom: -70px;
      left: 50%;
      margin-left: -240px;
    }
  }
  @media (max-width: 400px) {
    .sih-pad { padding-left: 16px; padding-right: 16px; }
    .sih-hero { padding-left: 16px; padding-right: 16px; }
    
    .sih-squad-system {
      transform: scale(0.65);
      margin-bottom: -110px;
    }
    
    .sih-card-deck { height: 500px; }
    .sih-card { padding: 18px; }
    .sih-card h3 { font-size: 16px; margin-bottom: 8px; }
    .sih-card p { font-size: 12px; line-height: 1.5; }
    .sih-card-bottom { margin-top: 14px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .sih-orb { animation: none; }
    .sih-ambient-grid { transform: none !important; }
  }

  /* animations */
  @keyframes sih-spin { to { transform: rotate(360deg); } }
  @keyframes sih-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .sih-spinner { animation: sih-spin 0.8s linear infinite; }
`;

// ─── Component ─────────────────────────────────────────────────────────────────

export default function SihInternalHackathon() {
  const active = useActiveSection();
  const [cardIndex, setCardIndex] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [teamCount, setTeamCount] = useState(0);
  const [domainFilter, setDomainFilter] = useState("All domains");
  const [statusFilter, setStatusFilter] = useState("All teams");
  const [reducedMotion, setReducedMotion] = useState(false);

  const heroStatRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLElement | null>(null);
  const consoleControls = useAnimation();

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 25%"],
  });
  const timelineProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.3,
  });
  const timelineBeam = useTransform(timelineProgress, [0, 1], ["0%", "100%"]);

  // Problem vault data (used when TEAMS_DECLARED === false)
  const filteredProblems = useMemo(
    () =>
      domainFilter === "All domains"
        ? problems
        : problems.filter((p) => p.domain === domainFilter),
    [domainFilter],
  );

  // Teams data (used when TEAMS_DECLARED === true)
  const filteredTeams = useMemo(
    () =>
      statusFilter === "All teams"
        ? teams
        : teams.filter((t) => t.status === statusFilter),
    [statusFilter],
  );

  // Active card — switches source depending on declared flag
  const activeList = TEAMS_DECLARED ? filteredTeams : filteredProblems;
  const card = activeList[cardIndex % activeList.length] ?? activeList[0];
  const nextCards = useMemo(
    () =>
      [1, 2].map(
        (offset) =>
          activeList[(cardIndex + offset) % activeList.length] ??
          activeList[offset],
      ),
    [cardIndex, activeList],
  );

  // Reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Console card: entry then float
  useEffect(() => {
    if (reducedMotion) {
      consoleControls.set({ opacity: 1, x: 0, rotate: 1.5 });
      return;
    }
    consoleControls
      .start({
        opacity: 1,
        x: 0,
        rotate: 1.5,
        transition: { duration: 0.7, delay: 0.18, ease: [0.33, 1, 0.68, 1] },
      })
      .then(() => {
        consoleControls.start({
          y: [0, -10, 0],
          rotate: [1.5, 2.2, 1.5],
          transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Count-up animation
  useEffect(() => {
    const node = heroStatRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const started = performance.now();
        const duration = reducedMotion ? 1 : 950;
        const animate = (now: number) => {
          const progress = Math.min((now - started) / duration, 1);
          setTeamCount(Math.round(50 * progress));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // URL param to jump to card
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (TEAMS_DECLARED) {
      const teamId = Number(params.get("team"));
      if (teamId > 0 && teamId <= teams.length) setCardIndex(teamId - 1);
    } else {
      const statement = Number(params.get("statement"));
      if (statement > 0 && statement <= problems.length)
        setCardIndex(statement - 1);
    }
  }, []);

  // Parallax scroll tracking — throttled with rAF, disabled on mobile
  useEffect(() => {
    // Don't track scroll for parallax on mobile — saves re-renders
    if (window.innerWidth <= 768) return;
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Card navigation
  const moveCard = (direction: number) => {
    setCardIndex((cur) => {
      return (cur + direction + activeList.length) % activeList.length;
    });

    // Fire small confetti burst on card change
    if (TEAMS_DECLARED) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#34D9A6", "#1E3A8A", "#ffffff"],
        zIndex: 100,
      });
    }
  };

  // Initial page load big confetti
  useEffect(() => {
    if (TEAMS_DECLARED) {
      const fireCannon = () => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors: ["#34D9A6", "#1E3A8A", "#ffffff"],
          zIndex: 100,
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors: ["#34D9A6", "#1E3A8A", "#ffffff"],
          zIndex: 100,
        });
      };
      
      // Fire once immediately, and again slightly later for a layered effect
      fireCannon();
      setTimeout(fireCannon, 400);
    }
  }, []);

  useEffect(() => {
    if (TEAMS_DECLARED) {
      const teamId = (activeList[cardIndex % activeList.length] as Team)?.id;
      if (teamId)
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?team=${teamId}`,
        );
    } else {
      const sr = (activeList[cardIndex % activeList.length] as ProblemStatement)
        ?.sr_no;
      if (sr)
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?statement=${sr}`,
        );
    }
  }, [cardIndex, activeList]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragStart(e.clientX);
  };
  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStart === null) return;
    const dist = e.clientX - dragStart;
    if (Math.abs(dist) > 42) moveCard(dist < 0 ? 1 : -1);
    setDragStart(null);
  };

  const toneClass = (tone: string) => `sih-tone-${tone}`;

  return (
    <div className="sih-shell">
      {/* Inject scoped styles */}
      <style dangerouslySetInnerHTML={{ __html: SIH_STYLES }} />

      {/* Ambient decorations */}
      <div
        className="sih-ambient-grid"
        aria-hidden="true"
        style={{
          transform: reducedMotion
            ? undefined
            : `translateY(${scrollY * 0.1}px)`,
        }}
      />
      <div className="sih-aurora" aria-hidden="true">
        <motion.span
          className="sih-orb sih-orb-1"
          animate={
            reducedMotion
              ? undefined
              : {
                  x: [0, 26, -12, 0],
                  y: [0, -16, 20, 0],
                  rotate: [-16, -10, -20, -16],
                  opacity: [0.2, 0.28, 0.22, 0.2],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="sih-orb sih-orb-2"
          animate={
            reducedMotion
              ? undefined
              : {
                  x: [0, -22, 16, 0],
                  y: [0, 16, -11, 0],
                  rotate: [18, 24, 12, 18],
                  opacity: [0.18, 0.27, 0.2, 0.18],
                }
          }
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: -5,
          }}
        />
        <motion.span
          className="sih-orb sih-orb-3"
          animate={
            reducedMotion
              ? undefined
              : {
                  x: [0, 14, -18, 0],
                  y: [0, 11, -16, 0],
                  scale: [1, 1.07, 0.96, 1],
                  opacity: [0.12, 0.18, 0.14, 0.12],
                }
          }
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: -11,
          }}
        />
      </div>
      <motion.div
        className="sih-glow sih-glow-1"
        aria-hidden="true"
        animate={
          reducedMotion
            ? undefined
            : { opacity: [0.22, 0.5, 0.22], scale: [1, 1.08, 1] }
        }
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="sih-glow sih-glow-2"
        aria-hidden="true"
        animate={
          reducedMotion
            ? undefined
            : { opacity: [0.14, 0.38, 0.14], scale: [1, 1.12, 1] }
        }
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: -2.2,
        }}
      />

      <main id="top">
        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <section className="sih-hero" id="sih-brief">
          <div
            className="sih-hero-art"
            aria-hidden="true"
            style={{
              transform: reducedMotion
                ? undefined
                : `translateY(${scrollY * -0.08}px)`,
            }}
          />

          <motion.div
            className="sih-hero-copy"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className="sih-eyebrow">
              <span className="sih-status-dot" />
              INTERNAL HACKATHON / 2026
            </div>
            <p className="sih-terminal">$dmx sih --mode=solve --teams=50</p>
            <h1>
              Smart India
              <br />
              <em>Hackathon</em> <span>2026</span>
            </h1>
            <p className="sih-hero-deck">
              A focused internal launchpad for students who want to turn a
              real-world problem into a working prototype — with the right team,
              the right constraints, and a clear path to the next stage.
            </p>
            <div className="sih-hero-actions flex flex-wrap items-center gap-4">
              <Link
                href="https://forms.gle/r2jCQVqFx81KzKyc6"
                target="_blank"
                rel="noreferrer"
              >
                <MagneticButton>
                  <span className="flex items-center gap-2">
                    Register your team <MoveRight size={17} />
                  </span>
                </MagneticButton>
              </Link>
              <MagneticButton
                variant="outline"
                onClick={() => scrollToId("sih-vault")}
              >
                <span className="flex items-center gap-2">
                  {TEAMS_DECLARED ? "Check standings" : "Explore problem vault"}{" "}
                  <ArrowDown size={16} />
                </span>
              </MagneticButton>
            </div>
          </motion.div>

          {/* Stats console */}
          <motion.div
            className="sih-console"
            initial={{ opacity: 0, x: 50, rotate: 0 }}
            animate={consoleControls}
            whileHover={{
              y: -14,
              rotate: 0,
              boxShadow:
                "24px 24px 0 rgba(30,58,138,.22), 0 0 40px rgba(52,217,166,.18)",
              transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
            }}
            style={{ cursor: "default" }}
          >
            <div className="sih-console-top">
              <span>LIVE BRIEFING</span>
              <span>DMX / CESS / CODECELL</span>
            </div>
            <div className="sih-console-number" ref={heroStatRef}>
              {teamCount}
              <span>teams advance</span>
            </div>
            <div className="sih-console-rule" />
            <div className="sih-console-list">
              <div>
                <span>01</span>
                <b>6 members</b>
                <small>per squad</small>
              </div>
              <div>
                <span>02</span>
                <b>1+ female</b>
                <small>mandatory</small>
              </div>
              <div>
                <span>03</span>
                <b>All branches</b>
                <small>multidisciplinary</small>
              </div>
            </div>
            <div className="sih-console-footer">
              <Radio size={14} /> next signal: internal round
            </div>
          </motion.div>

          <div className="sih-scroll-cue">
            <span>SCROLL TO BRIEF</span>
            <ArrowDown size={16} />
          </div>
        </section>

        {/* ══ INTRO ═════════════════════════════════════════════════════════════ */}
        <section className="sih-intro sih-pad">
          <div className="sih-kicker">
            <span>01</span>
            <span>THE BRIEF</span>
          </div>
          <div className="sih-intro-grid">
            <motion.div
              className="sih-intro-heading"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55 }}
            >
              <p className="sih-terminal">$dmx explain --why</p>
              <h2>
                Build for the
                <br />
                <span>problems that matter.</span>
              </h2>
            </motion.div>
            <motion.div
              className="sih-intro-body"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              <p>
                DMX, CodeCell, and CESS come together to take the SIH mindset
                from a national stage into a campus-scale proving ground.
                Students across disciplines are invited to form a team, choose a
                direction, and make a sharp, testable first move.
              </p>
              <p>
                The Ministry of Education&apos;s Innovation Cell (MIC), in
                collaboration with AICTE, invites students to participate in
                Smart India Hackathon 2026 — a nationwide initiative for solving
                real-world challenges through innovation.
              </p>
              <div className="sih-inline-status">
                <Sparkles size={16} />
                <span>Open to every branch. Built for curious teams.</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ RULES / TEAM PROTOCOL ═════════════════════════════════════════════ */}
        <section className="sih-rules sih-pad" id="sih-rules">
          <div className="sih-kicker">
            <span>02</span>
            <span>TEAM PROTOCOL</span>
          </div>
          <div className="sih-squad-layout">
            {/* Left: diagram */}
            <div className="sih-squad-command">
              <p className="sih-terminal">$dmx assemble --squad=6</p>
              <h2>
                Make the
                <br />
                <span>six click.</span>
              </h2>
              <p>
                A strong SIH team is not six copies of the same skill. It is a
                small system: distinct disciplines, one shared problem, and a
                leader who keeps the signal clear.
              </p>

              <div className="sih-squad-system">
                <svg
                  className="sih-squad-circuit"
                  viewBox="0 0 520 420"
                  role="img"
                  aria-label="Six team roles connected to the central team unit"
                >
                  <path d="M82 74 L205 164 M438 74 L315 164 M478 210 L328 210 M438 346 L315 258 M82 346 L205 258 M42 210 L192 210" />
                  <path className="spine" d="M260 120 V300 M145 210 H375" />
                  <circle cx="260" cy="210" r="67" />
                </svg>
                <div className="sih-squad-core">
                  <Users size={22} />
                  <strong>06</strong>
                  <small>MEMBERS</small>
                </div>
                {squadRoles.map((role, idx) => (
                  <button
                    key={role.label}
                    className={`sih-squad-node sih-node-${idx + 1}${activeRole && activeRole !== role.label ? " is-dimmed" : ""}${activeRole === role.label ? " is-active" : ""}`}
                    onMouseEnter={() => setActiveRole(role.label)}
                    onMouseLeave={() => setActiveRole(null)}
                    onFocus={() => setActiveRole(role.label)}
                    onBlur={() => setActiveRole(null)}
                    onClick={() =>
                      setActiveRole(
                        activeRole === role.label ? null : role.label,
                      )
                    }
                  >
                    <i>{String(idx + 1).padStart(2, "0")}</i>
                    {role.label}
                    <span className="sih-role-tooltip">
                      {role.contribution}
                    </span>
                  </button>
                ))}
              </div>

              <div className="sih-squad-caption">
                <span className="sih-status-dot" />
                MULTIDISCIPLINARY BY DESIGN
                <span className="sih-squad-legend">
                  MINT = REQUIRED / BLUE = ENCOURAGED
                </span>
              </div>
            </div>

            {/* Right: protocol tiles */}
            <div
              className="sih-protocol-tiles"
              aria-label="Team protocol constraints"
            >
              {protocolRules.map(([number, title, copy, kind], idx) => (
                <motion.article
                  key={number}
                  className={`sih-tile sih-tile-${kind}`}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.38,
                    delay: reducedMotion ? 0 : idx * 0.1,
                  }}
                >
                  <div className="sih-tile-top">
                    <span>
                      {number} / {kind === "hard" ? "REQUIRED" : "ENCOURAGED"}
                    </span>
                    <Check size={15} />
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ══ NOTICE ════════════════════════════════════════════════════════════ */}
        <section className="sih-notice sih-pad">
          <div className="sih-notice-card">
            <div className="sih-notice-icon">
              <ShieldAlert size={22} />
            </div>
            <div>
              <span className="sih-label-orange">IMPORTANT DISTINCTION</span>
              <h3>Internal prompts now. Official SIH prompts later.</h3>
              <p>
                The problem statements on this page are mock problem statements
                created exclusively for the internal round.{" "}
                <strong>
                  Real SIH problem statements have not been announced yet.
                </strong>{" "}
                The top 50 teams will qualify for the next stage and then select
                from the official statements released on the SIH portal.
              </p>
            </div>
          </div>
        </section>

        {/* ══ TIMELINE ══════════════════════════════════════════════════════════ */}
        <section
          className="sih-timeline sih-pad"
          id="sih-timeline"
          ref={timelineRef}
        >
          <div className="sih-timeline-header">
            <div>
              <p className="sih-terminal" style={{ color: "#1e9fe6" }}>
                $dmx map --journey=2026
              </p>
              <h2>
                From first signal
                <br />
                <span>to grand finale.</span>
              </h2>
            </div>
            <p>
              Keep the sequence visible. The internal round is the launchpad —
              not the destination.
            </p>
          </div>

          <div className="sih-timeline-shell">
            <div className="sih-timeline-intro">
              <div>
                <span>SIH / 2026 / MISSION SEQUENCE</span>
              </div>
              <span>11 STAGES / 01 OUTCOME</span>
            </div>

            <div className="sih-motion-timeline">
              {/* Animated track */}
              <div className="sih-track" aria-hidden="true">
                <div className="sih-track-base" />
                <motion.div
                  className="sih-track-fill"
                  style={{ height: timelineBeam }}
                />
                <motion.div
                  className="sih-track-signal"
                  style={{ top: timelineBeam }}
                />
              </div>

              {timelineStages.map((item, idx) => {
                const stageClass =
                  idx === 1
                    ? "sih-stage-current"
                    : idx < 1
                      ? "sih-stage-complete"
                      : "sih-stage-upcoming";
                const statusLabel =
                  idx === 1
                    ? "CURRENT STAGE"
                    : idx < 1
                      ? "COMPLETE"
                      : idx === timelineStages.length - 1
                        ? "FINAL STAGE"
                        : "UPCOMING";
                return (
                  <motion.article
                    key={item.stage}
                    className={`sih-stage ${toneClass(item.tone)} ${stageClass}`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.46,
                      delay: Math.min(idx * 0.03, 0.22),
                    }}
                  >
                    <div className="sih-stage-marker">
                      <span>{String(idx + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="sih-stage-date">{item.date}</div>
                    <div className="sih-stage-copy">
                      <h3>{item.stage}</h3>
                      <p>{item.action}</p>
                    </div>
                    <div className="sih-stage-status">
                      <span className="sih-status-pip" /> {statusLabel}
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="sih-timeline-endcap">
              <span className="sih-status-dot" />
              FINAL OUTPUT: SIH GRAND FINALE / DECEMBER 2026
            </div>
          </div>
        </section>

        {/* ══ PROBLEM VAULT / SELECTED TEAMS ══════════════════════════════════ */}
        {/* Toggle: set "declared": true in selectedTeams.json to switch to teams view */}
        <section className="sih-vault sih-pad" id="sih-vault">
          <div className="sih-vault-backdrop" aria-hidden="true" />
          <div className="sih-kicker">
            <span>03</span>
            <span>
              {TEAMS_DECLARED ? "SELECTED TEAMS" : "THE PROBLEM VAULT"}
            </span>
          </div>

          <div className="sih-vault-header">
            <div>
              <p className="sih-terminal">
                {TEAMS_DECLARED
                  ? "$dmx list --selected-teams"
                  : "$dmx open --mock-statements"}
              </p>
              <h2>
                {TEAMS_DECLARED ? (
                  <>
                    Meet the teams.
                    <br />
                    <span>The journey continues.</span>
                  </>
                ) : (
                  <>
                    Pick a problem.
                    <br />
                    <span>Build the proof.</span>
                  </>
                )}
              </h2>
            </div>
            <div className="sih-vault-tools">
              <label htmlFor="sih-domain-filter">
                {TEAMS_DECLARED ? "FILTER / STATUS" : "FILTER / DOMAIN"}
              </label>
              {TEAMS_DECLARED ? (
                <select
                  id="sih-domain-filter"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCardIndex(0);
                  }}
                >
                  <option value="All teams">All teams</option>
                  {teamStatuses.slice(1).map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  id="sih-domain-filter"
                  value={domainFilter}
                  onChange={(e) => {
                    setDomainFilter(e.target.value);
                    setCardIndex(0);
                  }}
                >
                  <option>All domains</option>
                  {problemDomains.slice(1).map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              )}
              <div className="sih-vault-count">
                <span>
                  {TEAMS_DECLARED
                    ? "INTERNAL / SHORTLIST"
                    : "INTERNAL / MOCK ONLY"}
                </span>
                <strong>
                  {String((cardIndex % activeList.length) + 1).padStart(2, "0")}{" "}
                  <small>/ {String(activeList.length).padStart(2, "0")}</small>
                </strong>
              </div>
            </div>
          </div>

          <div className="sih-vault-workspace">
            <div className="sih-vault-side">
              <MousePointer2 size={16} />
              <span>
                Swipe
                <br />
                to browse
              </span>
            </div>

            <div
              className="sih-card-deck"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => setDragStart(null)}
            >
              {/* Behind cards (depth effect) */}
              {nextCards.map((next, idx) => {
                const t = next as Team;
                const p = next as ProblemStatement;
                return (
                  <div
                    key={
                      TEAMS_DECLARED
                        ? `t-${t.id}-${idx}`
                        : `p-${p.sr_no}-${idx}`
                    }
                    className={`sih-card sih-card-behind-${idx + 1}`}
                    aria-hidden="true"
                  >
                    <span className="sih-card-index">
                      {String(TEAMS_DECLARED ? t.id : p.sr_no).padStart(2, "0")}
                    </span>
                    <span className="sih-card-domain">
                      {TEAMS_DECLARED ? t.status.toUpperCase() : p.domain}
                    </span>
                    <h3>{TEAMS_DECLARED ? t.name : p.problem_statement}</h3>
                  </div>
                );
              })}

              {/* Front card — problem vault mode */}
              {!TEAMS_DECLARED &&
                (() => {
                  const p = card as ProblemStatement;
                  return (
                    <article className="sih-card sih-card-front" key={p.sr_no}>
                      <div className="sih-card-topline">
                        <span className="sih-card-index">
                          {String(p.sr_no).padStart(2, "0")}
                        </span>
                        <span className="sih-card-domain">{p.domain}</span>
                        <span className="sih-card-flag">
                          <Flag size={14} /> MOCK
                        </span>
                      </div>
                      <h3>{p.problem_statement}</h3>
                      <p>{p.description}</p>
                      <div className="sih-card-bottom">
                        <span>INTERNAL ROUND / PROBLEM STATEMENT</span>
                        <span>DRAG TO MOVE</span>
                      </div>
                    </article>
                  );
                })()}

              {/* Front card — selected teams mode */}
              {TEAMS_DECLARED &&
                (() => {
                  const t = card as Team;
                  return (
                    <article className="sih-card sih-card-front" key={t.id}>
                      <div className="sih-card-topline">
                        <span className="sih-card-index">
                          {String(t.id).padStart(2, "0")}
                        </span>
                        <span
                          className="sih-card-domain"
                          style={{
                            color:
                              t.status === "backup"
                                ? "var(--sih-amber)"
                                : "var(--sih-mint)",
                          }}
                        >
                          {t.status.toUpperCase()}
                        </span>
                        <span className="sih-card-flag">
                          {t.status === "backup" ? (
                            <ShieldAlert size={14} />
                          ) : (
                            <Flag size={14} />
                          )}{" "}
                          {t.status === "backup" ? "BACKUP" : "SELECTED"}
                        </span>
                      </div>
                      <h3>{t.name}</h3>
                      <p>{t.message}</p>
                      <div className="sih-card-bottom">
                        <span>INTERNAL ROUND / SELECTED TEAMS</span>
                        <span>DRAG TO MOVE</span>
                      </div>
                    </article>
                  );
                })()}
            </div>
          </div>

          {/* Controls */}
          <div className="sih-vault-controls">
            <button
              onClick={() => moveCard(-1)}
              aria-label={TEAMS_DECLARED ? "Previous team" : "Previous problem"}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="sih-pips">
              {activeList
                .slice(0, Math.min(activeList.length, 10))
                .map((item, idx) => {
                  const key = TEAMS_DECLARED
                    ? (item as Team).id
                    : (item as ProblemStatement).sr_no;
                  return (
                    <button
                      key={key}
                      className={idx === cardIndex % 10 ? "active" : ""}
                      onClick={() => {
                        setCardIndex(idx);
                        if (TEAMS_DECLARED) {
                          confetti({
                            particleCount: 30,
                            spread: 40,
                            origin: { y: 0.7 },
                            colors: ["#34D9A6", "#1E3A8A", "#ffffff"],
                            zIndex: 100,
                          });
                        }
                      }}
                      aria-label={
                        TEAMS_DECLARED
                          ? `Open team ${key}`
                          : `Open problem ${key}`
                      }
                    />
                  );
                })}
            </div>
            <button
              onClick={() => moveCard(1)}
              aria-label={TEAMS_DECLARED ? "Next team" : "Next problem"}
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="sih-vault-footnote">
            {TEAMS_DECLARED ? (
              <span className="sih-vault-led">
                <span className="sih-status-dot" /> {teams.length} TEAMS INDEXED
              </span>
            ) : (
              <>
                <span className="sih-vault-led">
                  <span className="sih-status-dot" /> {problems.length} PROMPTS
                  INDEXED
                </span>
                <Link2 size={16} />
                <span>
                  Need the full set?{" "}
                  <a
                    href="https://drive.google.com/drive/folders/1KFoSoMhActRnlmjN-dxeUTiZs4ThaCKV?usp=drive_link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open all {problems.length} mock statements{" "}
                    <ExternalLink size={13} />
                  </a>
                </span>
              </>
            )}
          </div>
        </section>

        {/* ══ ACTION / CTA ══════════════════════════════════════════════════════ */}
        <section className="sih-action sih-pad">
          <div className="sih-action-panel">
            <div>
              <p className="sih-terminal">$dmx next --team-leader</p>
              <h2>
                Ready to make
                <br />
                <span>your first commit?</span>
              </h2>
              <p>
                Only the Team Leader should register. Keep the WhatsApp group
                limited to Team Leaders for important updates and announcements.
              </p>
            </div>
            <div className="sih-action-links flex flex-col items-start gap-4 mt-8">
              <Link
                href="https://forms.gle/r2jCQVqFx81KzKyc6"
                target="_blank"
                rel="noreferrer"
              >
                <MagneticButton>
                  <span className="flex items-center gap-2">
                    Register now <ExternalLink size={16} className="ml-1" />
                  </span>
                </MagneticButton>
              </Link>
              <Link
                href="https://chat.whatsapp.com/GNpIA2WC7V2IIeTsdzO0Ru"
                target="_blank"
                rel="noreferrer"
              >
                <MagneticButton
                  variant="outline"
                  style={{ border: "1px solid rgba(255,255,255,0.25)" }}
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle size={16} /> Join the WhatsApp group
                  </span>
                </MagneticButton>
              </Link>
              <Link
                href="https://www.sih.gov.in/"
                target="_blank"
                rel="noreferrer"
              >
                <MagneticButton
                  variant="outline"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <span className="flex items-center gap-2">
                    <Layers3 size={16} /> Official SIH portal
                  </span>
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
