"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, X, Pause, Share2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { GameScore } from "@/types";

const COLS = 22, ROWS = 22;
const BASE_MS = 140, MIN_MS = 60, SPEED_DROP = 8, FOODS_PER_LEVEL = 5;
const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

type Dir = "U" | "D" | "L" | "R";
type Pt = { x: number; y: number };
type Status = "idle" | "playing" | "paused" | "over";

const OPP: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };

function rndFood(s: Pt[]): Pt {
  let f: Pt;
  do { f = { x: ~~(Math.random() * COLS), y: ~~(Math.random() * ROWS) }; }
  while (s.some((p) => p.x === f.x && p.y === f.y));
  return f;
}

// DPR-aware render — all coords are logical, context is pre-scaled
function render(canvas: HTMLCanvasElement, snake: Pt[], food: Pt, now: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr, H = canvas.height / dpr;
  const cs = W / COLS;

  ctx.save();
  ctx.scale(dpr, dpr);

  ctx.fillStyle = "#07090D";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(52,217,166,0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= COLS; i++) { ctx.beginPath(); ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, H); ctx.stroke(); }
  for (let j = 0; j <= ROWS; j++) { ctx.beginPath(); ctx.moveTo(0, j * cs); ctx.lineTo(W, j * cs); ctx.stroke(); }

  const pulse = 0.65 + 0.35 * Math.sin(now * 0.004);
  const fx = food.x * cs + cs / 2, fy = food.y * cs + cs / 2;
  const grd = ctx.createRadialGradient(fx, fy, 0, fx, fy, cs * 0.9);
  grd.addColorStop(0, "rgba(52,217,166,0.35)");
  grd.addColorStop(1, "rgba(52,217,166,0)");
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.arc(fx, fy, cs * 0.9, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = "#34D9A6"; ctx.shadowBlur = 8;
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(fx, fy, (cs / 2 - 3) * pulse, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  snake.forEach((seg, i) => {
    const t = i / Math.max(snake.length - 1, 1);
    const r = Math.round(0x34 + (0x1E - 0x34) * t);
    const g = Math.round(0xD9 + (0x3A - 0xD9) * t);
    const b = Math.round(0xA6 + (0x8A - 0xA6) * t);
    const m = 1;
    const rad = Math.min(cs / 2, 4);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.beginPath();
    ctx.roundRect(seg.x * cs + m, seg.y * cs + m, cs - m * 2, cs - m * 2, rad);
    ctx.fill();
  });

  ctx.restore();
}

// ── Leaderboard panel (shared between sidebar and modal) ──
function LBPanel({ lb, onPlay }: { lb: GameScore[]; onPlay: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Trophy className="w-5 h-5 text-brand-teal" />
        <h2 className="text-lg font-bold font-display text-text-primary">Leaderboard</h2>
      </div>
      {lb.length === 0 ? (
        <div className="text-center py-10 text-text-secondary">
          <Trophy className="w-8 h-8 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-semibold">No scores yet.</p>
          <p className="text-xs text-text-muted mt-1">Be the first to claim the throne.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {lb.map((entry, i) => (
            <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors"
              style={{
                background: i === 0 ? "rgba(52,217,166,0.07)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === 0 ? "rgba(52,217,166,0.18)" : "rgba(255,255,255,0.04)"}`,
              }}>
              <span className="text-sm font-bold w-5 text-center shrink-0"
                style={{ color: i < 3 ? RANK_COLORS[i] : "var(--text-muted)" }}>
                {i + 1}
              </span>
              <span className="flex-1 font-semibold text-text-primary text-sm truncate">{entry.name}</span>
              <span className="font-mono font-bold text-sm text-brand-teal">{entry.score}</span>
              <span className="text-text-muted text-[11px] font-mono shrink-0">Lv{entry.level}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={onPlay}
        className="w-full py-2.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 border border-brand-teal/20 mt-2"
        style={{ background: "var(--brand-navy)" }}>
        <Play className="w-4 h-4" /> Play Now
      </button>
    </div>
  );
}

// ── Name entry form ──
function NameEntry({ score, level, name, setName, onSubmit, onRetry, isSubmitting, isSaved }: {
  score: number; level: number; name: string;
  setName: (n: string) => void; onSubmit: () => void; onRetry: () => void; isSubmitting: boolean; isSaved: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `I just scored ${score} in DMX Snake! 🐍 Think you're built different? Beat my high score here: https://dmxrgit.com/game`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-[10px] font-mono text-brand-teal uppercase tracking-[0.25em]">Game Over</p>
        <p className="font-display text-4xl font-bold text-text-primary">{score}</p>
        <p className="text-text-secondary text-sm">Level {level} reached</p>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation(); // CRITICAL: prevent game handler from stealing WASD
            if (e.key === "Enter") onSubmit();
          }}
          placeholder="Enter to save your score…"
          maxLength={20}
          autoFocus
          className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-default text-text-primary placeholder-text-muted outline-none focus:border-brand-teal transition-colors text-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button onClick={onRetry}
            className="flex-[0.5] py-2.5 rounded-xl border border-border-default text-text-secondary hover:text-text-primary transition-colors text-sm font-semibold flex items-center justify-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </button>
          <button onClick={onSubmit} disabled={!name.trim() || isSubmitting || isSaved}
            className="flex-1 py-2.5 rounded-xl font-bold text-bg-primary transition-all disabled:opacity-35 text-sm"
            style={{ background: "var(--brand-teal)" }}>
            {isSaved ? "Saved!" : isSubmitting ? "Saving..." : "Save Score"}
          </button>
        </div>
        <button onClick={handleShare}
          className="w-full py-2.5 rounded-xl border border-brand-teal/20 text-brand-teal hover:bg-brand-teal/10 transition-colors text-sm font-semibold flex items-center justify-center gap-2 mt-1">
          <Share2 className="w-3.5 h-3.5" /> 
          {copied ? "Copied to clipboard!" : "Share Challenge Link"}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function GamePage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const snakeR = useRef<Pt[]>([{ x: 11, y: 11 }, { x: 10, y: 11 }, { x: 9, y: 11 }]);
  const dirR = useRef<Dir>("R");
  const inputQueueR = useRef<Dir[]>([]);
  const foodR = useRef<Pt>({ x: 16, y: 11 });
  const scoreR = useRef(0);
  const levelR = useRef(1);
  const foodCountR = useRef(0);
  const tickR = useRef(0);
  const speedR = useRef(BASE_MS);
  const lastTickTimeR = useRef(0);
  const rafR = useRef<number | null>(null);
  const statusR = useRef<Status>("idle");
  const touchR = useRef<{ x: number; y: number } | null>(null);
  const isDesktopR = useRef(false);

  const [status, setStatus] = useState<Status>("idle");
  const [lb, setLb] = useState<GameScore[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [uiScore, setUiScore] = useState(0);
  const [uiLevel, setUiLevel] = useState(1);
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);
  const [showLBModal, setShowLBModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function setStatusBoth(s: Status) { statusR.current = s; setStatus(s); }

  function calcCS() {
    if (!wrapRef.current) return;
    const dpr = window.devicePixelRatio || 1;
    const logW = wrapRef.current.clientWidth;
    const cv = canvasRef.current;
    if (cv) {
      cv.width = logW * dpr;
      cv.height = logW * dpr;
      cv.style.width = "100%";
      cv.style.height = "100%";
    }
  }

  function redraw(now = performance.now()) {
    const cv = canvasRef.current;
    if (cv) render(cv, snakeR.current, foodR.current, now);
  }

  function stopLoop() {
    if (rafR.current) { cancelAnimationFrame(rafR.current); rafR.current = null; }
  }

  function startLoop(ms?: number) {
    if (ms !== undefined) speedR.current = ms;
    stopLoop();
    lastTickTimeR.current = performance.now();
    rafR.current = requestAnimationFrame(loop);
  }

  function loop(now: number) {
    rafR.current = requestAnimationFrame(loop);
    if (statusR.current !== "playing") { redraw(now); return; }
    if (now - lastTickTimeR.current >= speedR.current) {
      lastTickTimeR.current = now;
      gameTick();
    } else {
      redraw(now);
    }
  }

  function gameTick() {
    tickR.current++;
    if (inputQueueR.current.length > 0) {
      dirR.current = inputQueueR.current.shift()!;
    }

    const head = snakeR.current[0];
    let nx = head.x, ny = head.y;
    if (dirR.current === "U") ny--;
    if (dirR.current === "D") ny++;
    if (dirR.current === "L") nx--;
    if (dirR.current === "R") nx++;

    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) { doGameOver(); return; }
    const nh = { x: nx, y: ny };
    if (snakeR.current.some((s) => s.x === nh.x && s.y === nh.y)) { doGameOver(); return; }

    const ate = nh.x === foodR.current.x && nh.y === foodR.current.y;
    const ns = [nh, ...snakeR.current];
    if (!ate) ns.pop();
    snakeR.current = ns;

    if (ate) {
      foodCountR.current++;
      scoreR.current += 10 * levelR.current;
      setUiScore(scoreR.current);
      foodR.current = rndFood(ns);
      if (foodCountR.current % FOODS_PER_LEVEL === 0) {
        levelR.current++;
        setUiLevel(levelR.current);
        startLoop(Math.max(MIN_MS, BASE_MS - (levelR.current - 1) * SPEED_DROP));
        return;
      }
    }
    redraw();
  }

  function doGameOver() {
    stopLoop();
    const s = scoreR.current, l = levelR.current;
    setFinalScore(s); setFinalLevel(l);
    if (s > highScore) setHighScore(s);
    setStatusBoth("over");
    redraw();
  }

  function startGame() {
    snakeR.current = [{ x: 11, y: 11 }, { x: 10, y: 11 }, { x: 9, y: 11 }];
    dirR.current = "R"; inputQueueR.current = [];
    foodR.current = rndFood(snakeR.current);
    scoreR.current = 0; levelR.current = 1; foodCountR.current = 0; tickR.current = 0;
    speedR.current = BASE_MS;
    setUiScore(0); setUiLevel(1);
    setShowEntryModal(false); setShowLBModal(false);
    setIsSaved(false);
    setStatusBoth("playing");
    startLoop(BASE_MS);
  }

  function togglePause() {
    if (statusR.current === "playing") { setStatusBoth("paused"); redraw(); }
    else if (statusR.current === "paused") setStatusBoth("playing");
  }

  function pressDir(d: Dir) {
    if (statusR.current === "idle" || statusR.current === "over") { startGame(); return; }
    if (statusR.current === "paused") { setStatusBoth("playing"); return; }
    
    const lastQueued = inputQueueR.current.length > 0 
      ? inputQueueR.current[inputQueueR.current.length - 1] 
      : dirR.current;
      
    if (d === OPP[lastQueued] || d === lastQueued) return;
    if (inputQueueR.current.length < 3) {
      inputQueueR.current.push(d);
    }
  }

  async function submitScore() {
    const n = name.trim().slice(0, 20);
    if (!n || isSubmitting || isSaved) return;
    setIsSubmitting(true);
    try {
      await api.gamescores.submit({ name: n, score: finalScore, level: finalLevel });
      const updated = await api.gamescores.list({ limit: "10" });
      setLb(updated);
      setHighScore(updated[0]?.score || 0);
      setIsSaved(true);
    } catch (e) {
      console.error(e);
      alert("Failed to save score. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const checkDesktop = () => {
      isDesktopR.current = window.innerWidth >= 1024;
    };
    checkDesktop();
    calcCS(); redraw();
    
    api.gamescores.list({ limit: "10" })
      .then((data) => {
        setLb(data);
        setHighScore(data[0]?.score || 0);
      })
      .catch(console.error);

    const ro = new ResizeObserver(() => { checkDesktop(); calcCS(); redraw(); });
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", checkDesktop);
    return () => { ro.disconnect(); stopLoop(); window.removeEventListener("resize", checkDesktop); };
  }, []);

  // Keyboard — WASD fix: bail if user is focused on an input
  useEffect(() => {
    const map: Record<string, Dir> = {
      ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R",
      w: "U", s: "D", a: "L", d: "R", W: "U", S: "D", A: "L", D: "R",
    };
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === " ") { e.preventDefault(); togglePause(); return; }
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      pressDir(d);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const topEntry = lb[0];

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border-subtle bg-bg-secondary/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-text-secondary hover:text-brand-teal transition-colors text-sm group">
            <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span> Home
          </Link>
          <div className="text-center">
            <p className="text-[10px] font-mono text-brand-teal tracking-[0.25em] uppercase leading-none">DMX</p>
            <h1 className="font-display font-bold text-lg text-text-primary leading-tight">Snake</h1>
          </div>
          {/* Mobile only — leaderboard button. Desktop has permanent sidebar */}
          <button
            onClick={() => setShowLBModal(true)}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-teal transition-colors lg:invisible"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Scores</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:items-start">

          {/* ── Left: game area ── */}
          <div className="space-y-4">
            {/* Score bar */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Score", value: uiScore, accent: true },
                { label: "Level", value: uiLevel, accent: false },
                { label: "Best", value: highScore, accent: false },
              ].map(({ label, value, accent }) => (
                <div key={label} className="rounded-xl border border-border-subtle bg-bg-surface p-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">{label}</p>
                  <p className={`text-2xl font-bold font-mono ${accent ? "text-brand-teal" : "text-text-primary"}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Canvas */}
            <div ref={wrapRef} className="relative select-none w-full aspect-square max-w-[640px] mx-auto rounded-2xl border border-brand-teal/25 shadow-[0_0_50px_rgba(52,217,166,0.08)] overflow-hidden">
              <canvas
                ref={canvasRef}
                className="block w-full h-full"
                onTouchStart={(e) => { touchR.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
                onTouchEnd={(e) => {
                  if (!touchR.current) return;
                  const dx = e.changedTouches[0].clientX - touchR.current.x;
                  const dy = e.changedTouches[0].clientY - touchR.current.y;
                  touchR.current = null;
                  if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
                  pressDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "R" : "L") : (dy > 0 ? "D" : "U"));
                }}
              />

              {/* Idle overlay */}
              {status === "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/78 backdrop-blur-sm gap-5">
                  <div className="text-center px-6">
                    <p className="text-[11px] font-mono text-brand-teal tracking-[0.3em] uppercase mb-2">DataMatrix</p>
                    <p className="font-display text-5xl font-bold text-white mb-3">Snake</p>
                    {topEntry ? (
                      <p className="text-text-secondary text-sm leading-relaxed">
                        <span className="text-brand-teal font-bold">{topEntry.name}</span> is sitting at{" "}
                        <span className="text-brand-teal font-bold">{topEntry.score}</span>.{" "}
                        <span className="text-white font-semibold">Think you&apos;re built different?</span>
                      </p>
                    ) : (
                      <p className="text-text-secondary text-sm">
                        No one&apos;s scored yet. <span className="text-white font-semibold">First player sets the bar.</span>
                      </p>
                    )}
                  </div>
                  <button onClick={startGame}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-bg-primary text-base transition-all hover:-translate-y-0.5 active:scale-95"
                    style={{ background: "var(--brand-teal)", boxShadow: "0 0 30px rgba(52,217,166,0.45)" }}>
                    <Play className="w-4 h-4" /> Let&apos;s go
                  </button>
                  <p className="text-text-muted text-xs">Arrow keys · WASD · Swipe</p>
                </div>
              )}

              {/* Paused overlay */}
              {status === "paused" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm gap-4">
                  <p className="font-display text-3xl font-bold text-white">Paused</p>
                  <button onClick={togglePause}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-brand-teal/40 bg-brand-navy/50 text-white font-semibold hover:bg-brand-navy transition-all text-sm">
                    <Play className="w-4 h-4" /> Resume
                  </button>
                </div>
              )}

              {/* Game Over overlay */}
              {status === "over" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/85 backdrop-blur-md p-4 lg:p-6 z-10">
                  <div className="w-full max-w-sm bg-bg-secondary/95 border border-border-default rounded-2xl p-5 shadow-2xl">
                    <NameEntry
                      score={finalScore} level={finalLevel}
                      name={name} setName={setName}
                      onSubmit={submitScore}
                      onRetry={startGame}
                      isSubmitting={isSubmitting}
                      isSaved={isSaved}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile D-pad */}
            <div className="flex flex-col items-center gap-2 md:hidden pt-1">
              <button onTouchStart={(e) => { e.preventDefault(); pressDir("U"); }}
                className="p-4 rounded-2xl bg-bg-surface border border-border-subtle active:bg-brand-navy/30 active:border-brand-teal/40 touch-none">
                <ChevronUp className="w-7 h-7 text-text-secondary" />
              </button>
              <div className="flex gap-2">
                {(["L", "D", "R"] as Dir[]).map((d, i) => {
                  const Icon = [ChevronLeft, ChevronDown, ChevronRight][i];
                  return (
                    <button key={d} onTouchStart={(e) => { e.preventDefault(); pressDir(d); }}
                      className="p-4 rounded-2xl bg-bg-surface border border-border-subtle active:bg-brand-navy/30 active:border-brand-teal/40 touch-none">
                      <Icon className="w-7 h-7 text-text-secondary" />
                    </button>
                  );
                })}
              </div>
              {(status === "playing" || status === "paused") && (
                <button onClick={togglePause}
                  className="mt-1 flex items-center gap-1.5 px-5 py-2 rounded-lg border border-border-subtle text-text-secondary text-sm hover:text-text-primary transition-colors">
                  {status === "paused" ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  {status === "paused" ? "Resume" : "Pause"}
                </button>
              )}
            </div>

            {/* Desktop hint */}
            <div className="hidden md:flex items-center justify-center gap-6 text-xs text-text-muted pb-2">
              <span>Arrow keys or WASD · Space to pause</span>
              {(status === "playing" || status === "paused") && (
                <>
                  <span className="w-px h-3 bg-border-subtle" />
                  <button onClick={togglePause} className="text-text-secondary hover:text-brand-teal transition-colors flex items-center gap-1">
                    {status === "paused" ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    {status === "paused" ? "Resume" : "Pause"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Right: permanent leaderboard sidebar (desktop only) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-bg-secondary border border-border-default rounded-2xl p-5">
              <LBPanel lb={lb} onPlay={startGame} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Leaderboard Modal */}
      <AnimatePresence>
        {showLBModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 lg:hidden"
            onClick={() => setShowLBModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 24 }}
              className="w-full max-w-sm bg-bg-secondary border border-border-default rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end mb-3">
                <button onClick={() => setShowLBModal(false)}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <LBPanel lb={lb} onPlay={() => { setShowLBModal(false); startGame(); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}