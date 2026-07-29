"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type TerminalLine = {
  type: "prompt" | "secondary" | "wait" | "comment" | "output";
  text: string;
  delay: number;
  blink: boolean;
};

const defaultLines: TerminalLine[] = [
  { type: "prompt", text: "dmx status", delay: 0, blink: false },
  { type: "output", text: "→ 15+ active research projects", delay: 0.4, blink: false },
  { type: "output", text: "→ 500+ members trained across 3 years", delay: 0.6, blink: false },
  { type: "output", text: "→ 3 hackathons completed this year", delay: 0.8, blink: false },
  { type: "output", text: "→ Next event: Hack2Infinity 2026 — Dec 14", delay: 1.0, blink: false },
  { type: "output", text: "", delay: 1.2, blink: false },
  { type: "prompt", text: "dmx list-projects --featured", delay: 1.4, blink: false },
  { type: "output", text: "┌─ SentimentLens     [NLP]     ██████████ 92%", delay: 1.8, blink: false },
  { type: "output", text: "├─ VisionForge       [CV]      ████████░░ 78%", delay: 2.0, blink: false },
  { type: "output", text: "├─ DataPulse         [GenAI]   ██████░░░░ 65%", delay: 2.2, blink: false },
  { type: "output", text: "└─ RoboSense         [Robotics] █████░░░░░ 52%", delay: 2.4, blink: false },
  { type: "output", text: "", delay: 2.6, blink: false },
  { type: "prompt", text: "dmx upcoming --format=short", delay: 2.8, blink: false },
  { type: "output", text: "Dec 14  Hack2Infinity 2026       hackathon", delay: 3.2, blink: false },
  { type: "output", text: "Jan 08  Intro to Transformers    workshop", delay: 3.4, blink: false },
  { type: "output", text: "Jan 22  MLOps Deep Dive          workshop", delay: 3.6, blink: false },
  { type: "output", text: "", delay: 3.8, blink: false },
  { type: "prompt", text: "█", delay: 4.0, blink: true },
];

export function TerminalMockup() {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>(defaultLines);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    async function fetchTerminal() {
      try {
        const data = await api.stats.get(); // fetches /content
        if (data.terminal_code && data.terminal_code.trim()) {
          const lines: TerminalLine[] = data.terminal_code.split("\n").map((rawText: string, idx: number) => {
            let text = rawText;
            const blink = text.includes("!!blink!!");
            if (blink) text = text.replace("!!blink!!", "");
            
            const trimmed = text.trim();
            let type: TerminalLine["type"] = "output";
            let content = text;

            if (trimmed.startsWith("$") || trimmed.startsWith("dmx ")) {
              type = "prompt";
              content = trimmed.replace(/^\$\s*/, "");
            } else if (trimmed.startsWith(">>")) {
              type = "secondary";
              content = trimmed.replace(/^>>\s*/, "");
            } else if (trimmed.startsWith("...")) {
              type = "wait";
              content = trimmed.replace(/^\.\.\.\s*/, "");
            } else if (trimmed.startsWith("##")) {
              type = "comment";
              content = trimmed;
            }

            return { type, text: content, delay: idx * 0.2, blink };
          });
          lines.push({ type: "prompt", text: "█", delay: lines.length * 0.2, blink: true });
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
        if (line.text.trim() === "" && line.type !== "wait") {
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

        const renderContent = () => {
          let inner = <span className="whitespace-pre">{line.text}</span>;
          
          if (line.blink) {
            inner = (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                {inner}
              </motion.span>
            );
          }

          switch (line.type) {
            case "prompt":
              return (
                <>
                  <span className="text-brand-teal select-none shrink-0">$</span>
                  <span className="text-text-primary font-semibold">{inner}</span>
                </>
              );
            case "secondary":
              return (
                <>
                  <span className="text-brand-teal/70 select-none shrink-0">{">>"}</span>
                  <span className="text-text-secondary">{inner}</span>
                </>
              );
            case "wait":
              return (
                <>
                  <span className="text-brand-teal/50 select-none shrink-0">...</span>
                  <span className="text-text-muted italic">{inner}</span>
                </>
              );
            case "comment":
              return (
                <>
                  <span className="w-3 shrink-0" />
                  <span className="text-text-muted/60 italic">{inner}</span>
                </>
              );
            default:
              return (
                <>
                  <span className="w-3 shrink-0" />
                  <span className="text-text-secondary">{inner}</span>
                </>
              );
          }
        };

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-start gap-2"
          >
            {renderContent()}
          </motion.div>
        );
      })}
    </div>
  );
}
