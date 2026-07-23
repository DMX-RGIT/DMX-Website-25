"use client";

import { motion } from "framer-motion";
import { Terminal, Users, Lightbulb, Rocket } from "lucide-react";
import { SectionDivider } from "@/components/shared/SectionDivider";

export default function AboutPage() {
  const values = [
    {
      icon: Terminal,
      title: "Builder's Mindset",
      description: "We don't just read papers; we implement them. Action over theory.",
    },
    {
      icon: Users,
      title: "Open Collaboration",
      description: "Great AI is built by diverse minds working together without ego.",
    },
    {
      icon: Lightbulb,
      title: "First Principles",
      description: "Understanding the math before calling the API.",
    },
    {
      icon: Rocket,
      title: "Impact Driven",
      description: "Building models that solve real problems, not just optimize metrics.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
          About <span className="text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-brand)" }}>DataMatrix</span>
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
          We are the official AI & Machine Learning student committee of MCT&apos;s Rajiv Gandhi Institute of Technology, Mumbai. 
          Founded by a group of passionate students, we serve as the bridge between academic curriculum and bleeding-edge AI research.
        </p>
      </div>

      <SectionDivider />

      {/* Mission / Vision Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="inline-block px-3 py-1 rounded-full border border-brand-navy-light/50 bg-brand-navy/10 text-brand-navy-light text-xs font-bold uppercase tracking-wider mb-2">
              Our Mission
            </div>
            <h2 className="text-3xl font-display font-bold text-text-primary">
              Democratizing AI Education
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              To cultivate an environment where students can freely explore, learn, and build with Artificial Intelligence. We provide the resources, mentorship, and platform needed to transform curious beginners into competent AI researchers and engineers.
            </p>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="inline-block px-3 py-1 rounded-full border border-brand-teal/50 bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider mb-2">
              Our Vision
            </div>
            <h2 className="text-3xl font-display font-bold text-text-primary">
              The Next Generation of Innovators
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              We envision RGIT as a premier hub for undergraduate AI research in India, where students consistently publish papers at top conferences and build intelligent systems that create tangible societal impact.
            </p>
          </motion.div>
        </div>
      </div>

      <SectionDivider />

      {/* Core Values / Why DMX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Core Values</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">The principles that guide how we learn and build.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, idx) => (
            <motion.div
              key={val.title}
              className="glass p-8 rounded-2xl flex flex-col items-center text-center border-border-default hover:border-brand-teal/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="w-16 h-16 rounded-full bg-bg-surface border border-border-default flex items-center justify-center mb-6">
                <val.icon className="w-8 h-8 text-brand-teal" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">{val.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{val.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
