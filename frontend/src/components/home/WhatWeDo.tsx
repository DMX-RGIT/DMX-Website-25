"use client";

import { motion } from "framer-motion";
import { Code2, Brain, Mic, Microscope, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Hackathons",
    description: "Our flagship Hack2Infinity brings together hundreds of developers for 36 hours of relentless innovation. Build real-world solutions under pressure.",
    icon: Code2,
    href: "/events?category=hackathon",
  },
  {
    title: "AI/ML Workshops",
    description: "Hands-on sessions covering everything from linear regression to large language models. Learn by doing.",
    icon: Brain,
    href: "/events?category=workshop",
  },
  {
    title: "Speaker Sessions",
    description: "Insights and guidance from industry veterans and academic researchers. Get a glimpse into the future of tech.",
    icon: Mic,
    href: "/events?category=speaker_session",
  },
  {
    title: "Research Projects",
    description: "Collaborative research in computer vision, NLP, and robotics pushing the boundaries of what's possible.",
    icon: Microscope,
    href: "/projects",
  },
];

export function WhatWeDo() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">What We Do</h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          We bridge the gap between theoretical knowledge and practical implementation in the world of Artificial Intelligence.
        </p>
      </div>

      <div className="space-y-20 md:space-y-28">
        {features.map((item, index) => (
          <motion.div
            key={item.title}
            className={cn(
              "flex flex-col md:flex-row items-center gap-8 md:gap-16",
              index % 2 !== 0 && "md:flex-row-reverse"
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Visual Side */}
            <div className="w-full md:w-1/2 aspect-video bg-bg-surface border border-border-default rounded-2xl flex items-center justify-center group hover:border-brand-teal/50 transition-colors">
              <item.icon className="w-16 h-16 text-brand-navy-light group-hover:text-brand-teal transition-colors duration-500" />
            </div>

            {/* Text Side */}
            <div className="w-full md:w-1/2 space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-text-primary">{item.title}</h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                {item.description}
              </p>
              <Link 
                href={item.href}
                className="inline-flex items-center gap-2 text-brand-teal font-semibold hover:text-brand-teal-light transition-colors group"
              >
                Learn more 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
