"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { api } from "@/lib/api";
import { Stats } from "@/types";

export function ImpactStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.stats.get();
        setStats(data);
      } catch (e) {
        console.error("Failed to load stats", e);
      }
    }
    loadStats();
  }, []);

  const statItems = [
    { label: "Members", value: stats?.members || 0, suffix: "+" },
    { label: "Projects Built", value: stats?.projects || 0, suffix: "+" },
    { label: "Events Hosted", value: stats?.events || 0, suffix: "+" },
    { label: "Research Papers", value: stats?.papers || 0, suffix: "+" },
  ];

  return (
    <section className="py-20 border-y border-border-subtle bg-bg-secondary" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-border-default">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center justify-center text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-2 flex items-baseline">
                <Counter value={item.value} isInView={isInView} />
                <span className="text-brand-teal text-3xl md:text-4xl">{item.suffix}</span>
              </div>
              <p className="text-sm md:text-base text-text-secondary uppercase tracking-widest font-medium">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ value, isInView }: { value: number; isInView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || value === 0) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = value / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, isInView]);

  return <span>{count}</span>;
}
