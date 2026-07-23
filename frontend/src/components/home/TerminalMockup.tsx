"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const defaultLines = [
  { prompt: true, text: "dmx status", delay: 0 },
  { prompt: false, text: "→ 15+ active research projects", delay: 0.4 },
  { prompt: false, text: "→ 500+ members trained across 3 years", delay: 0.6 },
  { prompt: false, text: "→ 3 hackathons completed this year", delay: 0.8 },
  { prompt: false, text: "→ Next event: Hack2Infinity 2026 — Dec 14", delay: 1.0 },
  { prompt: false, text: "", delay: 1.2 },
  { prompt: true, text: "dmx list-projects --featured", delay: 1.4 },
  { prompt: false, text: "┌─ SentimentLens     [NLP]     ██████████ 92%", delay: 1.8 },
  { prompt: false, text: "├─ VisionForge       [CV]      ████████░░ 78%", delay: 2.0 },
  { prompt: false, text: "├─ DataPulse         [GenAI]   ██████░░░░ 65%", delay: 2.2 },
  { prompt: false, text: "└─ RoboSense         [Robotics] █████░░░░░ 52%", delay: 2.4 },
  { prompt: false, text: "", delay: 2.6 },
  { prompt: true, text: "dmx upcoming --format=short", delay: 2.8 },
  { prompt: false, text: "Dec 14  Hack2Infinity 2026       hackathon", delay: 3.2 },
  { prompt: false, text: "Jan 08  Intro to Transformers    workshop", delay: 3.4 },
  { prompt: false, text: "Jan 22  MLOps Deep Dive          workshop", delay: 3.6 },
  { prompt: false, text: "", delay: 3.8 },
  { prompt: true, text: "█", delay: 4.0 },
];

export function TerminalMockup() {
  const [terminalLines, setTerminalLines] = useState(defaultLines);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    async function fetchTerminal() {
      try {
        const data = await api.stats.get(); // fetches /content
        if (data.terminal_code && data.terminal_code.trim()) {
          const lines = data.terminal_code.split("\n").map((text: string, idx: number) => {
            const isPrompt = text.trim().startsWith("$") || text.trim().startsWith("dmx ");
            return {
              prompt: isPrompt,
              text: isPrompt ? text.trim().replace(/^\$\s*/, "") : text,
              delay: idx * 0.2
            };
          });
          lines.push({ prompt: true, text: "█", delay: lines.length * 0.2 });
          setTerminalLines(lines);
        }
      } catch (e) {
        console.error("Failed to fetch terminal data", e);
      }
    }
    fetchTerminal();
  }, []);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    terminalLines.forEach((line, idx) => {
      const timer = setTimeout(() => {
        setVisibleLines(idx + 1);
      }, line.delay * 1000);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, [terminalLines]);

  return (
    <div className="w-full h-full p-4 md:p-6 font-mono text-xs md:text-sm leading-relaxed overflow-y-auto custom-scrollbar">
      {terminalLines.slice(0, visibleLines).map((line, idx) => {
        if (line.text.trim() === "") {
          return <div key={idx} className="h-3" />;
        }

        // Blinking cursor on last line
        if (line.text === "█") {
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-brand-teal select-none">$</span>
              <motion.span
                className="text-text-primary"
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              >
                █
              </motion.span>
            </div>
          );
        }

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-start gap-2"
          >
            {line.prompt ? (
              <>
                <span className="text-brand-teal select-none shrink-0">$</span>
                <span className="text-text-primary font-semibold">{line.text}</span>
              </>
            ) : (
              <>
                <span className="w-3 shrink-0" />
                <span className="text-text-secondary whitespace-pre">{line.text}</span>
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
