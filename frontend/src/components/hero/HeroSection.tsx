"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/MagneticButton";
import Link from "next/link";
import { DMXLogo } from "../layout/DMXLogo";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Very subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-navy/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Logo Centerpiece */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <DMXLogo className="h-20 md:h-28 lg:h-32 w-auto" />
        </motion.div>

        {/* Headlines */}
        <motion.h1
          className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Where Intelligence Meets <span className="text-brand-teal">Action</span>
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          RGIT Mumbai&apos;s official Artificial Intelligence & Machine Learning committee. 
          We build the next generation of engineers through rigorous research and hands-on building.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/join">
            <MagneticButton>Join the Lab</MagneticButton>
          </Link>
          <Link href="/events">
            <MagneticButton variant="outline">Explore Events</MagneticButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
