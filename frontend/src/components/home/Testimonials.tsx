"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "DMX gave me the confidence to submit my first ML research paper. The mentorship here is unreal.",
    name: "Aarav Patel",
    role: "3rd Year, Computer Engineering",
    initiative: "NLP Research Lead",
  },
  {
    quote: "Hack2Infinity was a turning point for me. 36 hours of pure building — I learned more there than in an entire semester.",
    name: "Sneha Iyer",
    role: "2nd Year, Data Science",
    initiative: "Hackathon Participant",
  },
  {
    quote: "The workshops don't just teach you theory. You walk out with a deployed model. That's the DMX difference.",
    name: "Rohan Mehta",
    role: "4th Year, AI & ML",
    initiative: "Workshop Instructor",
  },
  {
    quote: "Being part of the core committee taught me more about leadership and project management than any course ever could.",
    name: "Priya Sharma",
    role: "3rd Year, Computer Engineering",
    initiative: "Core Committee Member",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Voices from the Lab
        </h2>
        <p className="text-text-secondary mb-16">
          What our members have to say about the DMX experience.
        </p>

        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <Quote className="w-8 h-8 text-brand-navy-light mb-6 opacity-50" />
              <blockquote className="text-xl md:text-2xl text-text-primary font-medium leading-relaxed mb-8 max-w-3xl">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>
              <div>
                <p className="text-text-primary font-semibold">{testimonials[current].name}</p>
                <p className="text-text-secondary text-sm">{testimonials[current].role}</p>
                <p className="text-brand-teal text-xs font-mono mt-1">{testimonials[current].initiative}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === current
                  ? "bg-brand-teal w-6"
                  : "bg-border-default hover:bg-text-secondary"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
