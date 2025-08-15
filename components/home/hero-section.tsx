// Hero Section Component
// Main landing section of the homepage with animated elements
// Uses Framer Motion for smooth entrance animations

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Hero section with animated title and call-to-action buttons
export function HeroSection() {
  return (
    // Full-height section with gradient background overlay
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-dmx-primary/20 via-transparent to-dmx-secondary/20" />
      
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
          className="text-xl md:text-2xl text-gray-300 mb-8"
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
            className="px-8 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition"
          >
            View Projects
          </Link>
        </motion.div>
      </div>

      {/* Bottom gradient fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dmx-dark to-transparent" />
    </section>
  );
}
