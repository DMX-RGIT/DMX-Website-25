"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="flex items-center justify-center py-12 px-4">
      <motion.div
        className="h-px flex-1"
        style={{
          background: "linear-gradient(90deg, transparent, var(--brand-navy))",
        }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      />
      {/* Center X mark */}
      <svg
        viewBox="0 0 24 24"
        width={16}
        height={16}
        className="mx-3 shrink-0"
      >
        <line
          x1="4"
          y1="4"
          x2="20"
          y2="20"
          stroke="var(--brand-navy)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="4"
          x2="4"
          y2="20"
          stroke="var(--brand-teal)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <motion.div
        className="h-px flex-1"
        style={{
          background: "linear-gradient(90deg, var(--brand-teal), transparent)",
        }}
        initial={{ scaleX: 0, originX: 1 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.1 }}
      />
    </div>
  );
}
