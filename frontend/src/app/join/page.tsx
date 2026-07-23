"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Terminal, Code2, Brain } from "lucide-react";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { MagneticButton } from "@/components/shared/MagneticButton";
import Link from "next/link";

const benefits = [
  {
    icon: Brain,
    title: "Hands-on AI Research",
    description: "Work on cutting-edge machine learning models, natural language processing, and computer vision projects."
  },
  {
    icon: Code2,
    title: "Build Real Products",
    description: "Take theory into practice. We don't just study algorithms; we deploy them."
  },
  {
    icon: Terminal,
    title: "Exclusive Workshops",
    description: "Get first access to internal deep-dive sessions led by industry experts and senior members."
  }
];

export default function JoinPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate API call
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">
            Join the Lab
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Become a part of RGIT's premier AI & Machine Learning student committee. We are looking for builders, researchers, and curious minds.
          </p>
        </div>

        <SectionDivider />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Why Join */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Why DMX?</h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                DataMatrix isn't just a club; it's a research lab disguised as a student committee. When you join DMX, you are committing to rigorous learning, open collaboration, and building systems that matter.
              </p>
            </div>

            <div className="space-y-8">
              {benefits.map((benefit, idx) => (
                <motion.div 
                  key={benefit.title}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-navy/10 border border-brand-navy-light/20 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">{benefit.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Application Form */}
          <motion.div 
            className="glass-card p-8 md:p-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {status === "success" ? (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-brand-teal" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Application Received</h3>
                <p className="text-text-secondary">
                  Thanks for applying! Our core team will review your application and get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-text-secondary">First Name</label>
                      <input 
                        id="firstName"
                        required
                        className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary"
                        placeholder="Ada"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-text-secondary">Last Name</label>
                      <input 
                        id="lastName"
                        required
                        className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary"
                        placeholder="Lovelace"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-text-secondary">College Email</label>
                    <input 
                      id="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary"
                      placeholder="ada@rgit.ac.in"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium text-text-secondary">Domain of Interest</label>
                    <select 
                      id="role"
                      required
                      className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary appearance-none"
                    >
                      <option value="">Select a domain...</option>
                      <option value="ml">Machine Learning / AI</option>
                      <option value="web">Web Development</option>
                      <option value="design">UI / UX Design</option>
                      <option value="content">Content & Strategy</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="github" className="text-sm font-medium text-text-secondary">GitHub Profile (Optional)</label>
                    <input 
                      id="github"
                      type="url"
                      className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="why" className="text-sm font-medium text-text-secondary">Why do you want to join DMX?</label>
                    <textarea 
                      id="why"
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:border-brand-teal transition-colors text-text-primary resize-none"
                      placeholder="Tell us about your interests and what you hope to build..."
                    />
                  </div>
                </div>

                <MagneticButton className="w-full group">
                  {status === "submitting" ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Submit Application
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  )}
                </MagneticButton>
              </form>
            )}
          </motion.div>
        </div>

        {/* Hidden Admin Link */}
        <div className="mt-24 text-center">
          <Link href="/admin/login" className="text-[10px] text-border-default hover:text-text-secondary transition-colors cursor-default hover:cursor-pointer select-none">
            Committee Login
          </Link>
        </div>
      </div>
    </div>
  );
}
