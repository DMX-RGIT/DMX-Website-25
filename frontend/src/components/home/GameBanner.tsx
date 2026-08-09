"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { api } from "@/lib/api";

const MINI_SNAKE = [
  { x: 10, y: 5 }, { x: 9, y: 5 }, { x: 8, y: 5 },
  { x: 7, y: 5 }, { x: 6, y: 5 },
];

export function GameBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickRef = useRef(0);
  const snakeRef = useRef(MINI_SNAKE.map(p => ({ ...p })));
  const foodRef = useRef({ x: 14, y: 5 });
  const dirRef = useRef<"L" | "R" | "U" | "D">("R");
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  
  const [topPlayer, setTopPlayer] = useState<{name: string, score: number} | null>(null);

  useEffect(() => {
    api.gamescores.list({ limit: "1" })
      .then(lb => {
        if (lb && lb.length > 0) {
          setTopPlayer({ name: lb[0].name, score: lb[0].score });
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cv: HTMLCanvasElement = canvas;
    const COLS = 22, ROWS = 10;
    const cs = 45; // Fixed logical cell size

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      cv.width = cs * COLS * dpr;
      cv.height = cs * ROWS * dpr;
    };
    
    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    // Auto-pilot: steer toward food
    function autoDir() {
      const head = snakeRef.current[0];
      const f = foodRef.current;
      const dx = f.x - head.x, dy = f.y - head.y;
      const opp: Record<string, string> = { L: "R", R: "L", U: "D", D: "U" };
      const preferred: ("L" | "R" | "U" | "D")[] = [];
      if (dx > 0) preferred.push("R");
      if (dx < 0) preferred.push("L");
      if (dy > 0) preferred.push("D");
      if (dy < 0) preferred.push("U");
      for (const d of preferred) {
        if (d !== opp[dirRef.current]) { dirRef.current = d; break; }
      }
    }

    function step(now: number) {
      rafRef.current = requestAnimationFrame(step);
      if (now - lastRef.current < 160) return;
      lastRef.current = now;
      tickRef.current++;

      autoDir();
      const head = snakeRef.current[0];
      let nx = head.x + (dirRef.current === "R" ? 1 : dirRef.current === "L" ? -1 : 0);
      let ny = head.y + (dirRef.current === "D" ? 1 : dirRef.current === "U" ? -1 : 0);
      // Wrap
      nx = (nx + COLS) % COLS;
      ny = (ny + ROWS) % ROWS;
      const nh = { x: nx, y: ny };
      const ate = nx === foodRef.current.x && ny === foodRef.current.y;
      const ns = [nh, ...snakeRef.current];
      if (!ate) ns.pop();
      if (ate) foodRef.current = { x: ~~(Math.random() * COLS), y: ~~(Math.random() * ROWS) };
      snakeRef.current = ns;

      // Draw
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.scale(dpr, dpr);
      
      const W = cs * COLS, H = cs * ROWS;
      
      ctx.fillStyle = "#07090D";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(52,217,166,0.04)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, H); ctx.stroke();
      }
      for (let j = 0; j <= ROWS; j++) {
        ctx.beginPath(); ctx.moveTo(0, j * cs); ctx.lineTo(W, j * cs); ctx.stroke();
      }

      // Food
      const pulse = 0.7 + 0.3 * Math.sin(tickRef.current * 0.3);
      const fx = foodRef.current.x * cs + cs / 2, fy = foodRef.current.y * cs + cs / 2;
      ctx.shadowColor = "#34D9A6"; ctx.shadowBlur = 12;
      ctx.fillStyle = "#34D9A6";
      ctx.beginPath(); ctx.arc(fx, fy, (cs / 2 - 4) * pulse, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // Snake
      ns.forEach((seg, i) => {
        const t = i / Math.max(ns.length - 1, 1);
        const r = Math.round(0x34 + (0x1E - 0x34) * t);
        const g = Math.round(0xD9 + (0x3A - 0xD9) * t);
        const b = Math.round(0xA6 + (0x8A - 0xA6) * t);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        if (i === 0) { ctx.shadowColor = "#34D9A6"; ctx.shadowBlur = 10; }
        ctx.beginPath();
        ctx.roundRect(seg.x * cs + 2, seg.y * cs + 2, cs - 4, cs - 4, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border-subtle overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-brand-teal/20 bg-bg-secondary w-full group"
          style={{ boxShadow: "0 0 60px rgba(52,217,166,0.06)" }}>

          {/* Canvas preview */}
          <div className="w-full relative h-[240px] sm:h-[300px]">
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" 
            />
          </div>

          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-8 sm:px-12 sm:py-10"
            style={{ background: "linear-gradient(90deg, rgba(7,9,13,0.95) 30%, rgba(7,9,13,0.8) 60%, rgba(7,9,13,0.1) 100%)" }}>
            <div className="max-w-[500px] w-full text-center sm:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-[10px] font-mono text-brand-teal uppercase tracking-widest mb-4">
                <Trophy className="w-3.5 h-3.5" />
                <span>Mini Game</span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight tracking-tight">
                DMX Snake
              </h3>
              
              <div className="mt-4 text-text-secondary text-base sm:text-lg">
                {topPlayer ? (
                  <p>
                    <span className="text-brand-teal font-bold">{topPlayer.name}</span> holds the crown with <span className="text-brand-teal font-bold">{topPlayer.score}</span> pts. Think you can dethrone them? Prove it.
                  </p>
                ) : (
                  <p>
                    The leaderboard is currently empty. Be the first to set the high score and claim the throne.
                  </p>
                )}
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="z-10 mt-4 sm:mt-0">
              <Link
                href="/game"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-bg-primary text-base sm:text-lg whitespace-nowrap"
                style={{ background: "var(--brand-teal)", boxShadow: "0 0 40px rgba(52,217,166,0.4)" }}
              >
                Play Now
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}