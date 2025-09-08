// Hero Section Component
// Main landing section of the homepage with animated elements and floating shapes
// Uses Framer Motion for smooth entrance animations and shape movements

"use client";

import { motion } from "framer-motion";
import LandingParticles from "../ui/landing-particles";

// Floating shape component props interface
interface FloatingShapeProps {
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

// Floating shape component
const FloatingShape: React.FC<FloatingShapeProps> = ({
  className = "",
  style = {},
  delay = 0,
}) => {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.1, 0.3, 0.1],
        y: [0, -30, 0],
        x: [0, 15, 0],
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={style}
    />
  );
};

// Hero section with animated title, call-to-action buttons, and floating shapes
export function HeroSection() {
  return (
    // Full-height section with gradient background overlay
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dmx-purple/5 via-white to-dmx-primary/5">
      <LandingParticles />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
    </section>
  );
}
