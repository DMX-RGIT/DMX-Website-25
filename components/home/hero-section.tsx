// Hero Section Component
// Main landing section of the homepage with animated elements and floating shapes
// Uses Framer Motion for smooth entrance animations and shape movements

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

// Floating shape component props interface
interface FloatingShapeProps {
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

// Floating shape component
const FloatingShape: React.FC<FloatingShapeProps> = ({ 
  className = '', 
  style = {}, 
  delay = 0 
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
        repeatType: 'reverse',
        ease: 'easeInOut',
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
      {/* Floating shapes */}
      <FloatingShape 
        className="w-64 h-64 bg-gradient-to-r from-dmx-purple/20 to-dmx-primary/20 blur-3xl"
        style={{ top: '20%', left: '10%' }}
        delay={0}
      />
      <FloatingShape 
        className="w-96 h-96 bg-gradient-to-r from-dmx-primary/20 to-dmx-purple/20 blur-3xl"
        style={{ bottom: '15%', right: '10%' }}
        delay={0.5}
      />
      <FloatingShape 
        className="w-80 h-80 bg-gradient-to-r from-dmx-purple/15 to-dmx-primary/15 blur-3xl"
        style={{ top: '60%', left: '20%' }}
        delay={1}
      />
      <FloatingShape 
        className="w-72 h-72 bg-gradient-to-r from-dmx-primary/15 to-dmx-purple/15 blur-3xl"
        style={{ top: '30%', right: '20%' }}
        delay={1.5}
      />
      
      {/* Main content container */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Animated main title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}    // Start state: invisible and moved down
          animate={{ opacity: 1, y: 0 }}     // End state: visible and in position
          transition={{ duration: 0.8 }}      // Animation duration
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          {/* DMX title with gradient text effect */}
          <span className="text-gradient">DataMatrix</span>
        </motion.h1>
        
        {/* Animated subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}  // Delayed animation for staggered effect
          className="text-xl md:text-2xl text-dmx-purple mb-8"
        >
          Exploring AI/ML and Cutting-Edge Technology at RGIT
        </motion.p>
        
        {/* Animated call-to-action buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}  // Further delayed for sequential animation
          className="flex gap-4 justify-center"
        >
          {/* Primary CTA button */}
          <Link 
            href="/events" 
            className="px-8 py-3 bg-dmx-primary text-white rounded-lg hover:bg-dmx-primary/80 transition"
          >
            Explore Events
          </Link>
          
          {/* Secondary CTA button */}
          <Link 
            href="/projects" 
            className="px-8 py-3 border-2 border-dmx-purple text-dmx-purple rounded-lg hover:bg-dmx-purple hover:text-white transition"
          >
            View Projects
          </Link>
        </motion.div>
      </div>

      {/* Animated grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
    </section>
  );
}
