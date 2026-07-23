"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function InitialLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide the loader after 2.2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-bg-primary flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
        >
          {/* Animated Split-X Motif */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
              
              {/* Left Navy Stroke */}
              <motion.line
                x1="20"
                y1="20"
                x2="80"
                y2="80"
                stroke="var(--brand-navy)"
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, x: -50, y: -50 }}
                animate={{ pathLength: 1, opacity: 1, x: 0, y: 0 }}
                transition={{ 
                  duration: 1, 
                  ease: [0.25, 1, 0.5, 1] 
                }}
              />
              
              {/* Right Teal Stroke */}
              <motion.line
                x1="80"
                y1="20"
                x2="20"
                y2="80"
                stroke="var(--brand-teal)"
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, x: 50, y: -50 }}
                animate={{ pathLength: 1, opacity: 1, x: 0, y: 0 }}
                transition={{ 
                  duration: 1, 
                  ease: [0.25, 1, 0.5, 1],
                  delay: 0.2
                }}
              />
              
              {/* Central Glow Burst */}
              <motion.circle
                cx="50"
                cy="50"
                r="4"
                fill="var(--brand-teal)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 10, 0], opacity: [0, 0.5, 0] }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                className="mix-blend-screen"
              />
            </svg>
          </div>
          
          <motion.div 
            className="mt-8 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.p 
              className="text-text-primary font-display font-bold tracking-widest text-sm uppercase"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Initializing Systems
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
