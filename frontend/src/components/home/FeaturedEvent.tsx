"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { api } from "@/lib/api";
import { Event } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { MagneticButton } from "@/components/shared/MagneticButton";

export function FeaturedEvent() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      try {
        const events = await api.events.list({ upcoming: "true" });
        const flagship = events.find((e) => e.is_flagship);
        setEvent(flagship || events[0] || null);
      } catch (e) {
        console.error("Failed to load featured event", e);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-96 rounded-2xl bg-bg-surface animate-pulse" />
      </section>
    );
  }

  if (!event) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="glass-card overflow-hidden gradient-border p-[1px]"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="bg-bg-secondary rounded-lg p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-navy/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-navy/10 border border-brand-navy-light/20 mb-4">
                <CalendarIcon className="w-8 h-8 text-brand-teal" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
                Something Big is Cooking
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Our team is currently preparing for the next major event. From deep learning workshops to our flagship Hack2Infinity hackathon, stay tuned for updates.
              </p>
              <div className="pt-4">
                <MagneticButton>
                  <a href="/events" className="flex items-center gap-2">
                    View Past Events <ArrowRight className="w-4 h-4" />
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="glass-card overflow-hidden gradient-border p-[1px]"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-bg-secondary rounded-lg p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-navy/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Content */}
          <div className="flex-1 relative z-10 w-full">
            <div className="inline-block px-3 py-1 rounded-full border border-brand-teal/30 bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider mb-6">
              Flagship Event
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
              {event.title}
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-xl">
              {event.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-8 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-brand-navy-light" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-navy-light" />
                <span>{event.venue}</span>
              </div>
            </div>

            <MagneticButton>
              {event.registration_url ? (
                <a href={event.registration_url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  Register Now <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <span className="flex items-center gap-2">
                  Coming Soon <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </MagneticButton>
          </div>

          {/* Timer */}
          <div className="w-full lg:w-auto relative z-10">
            <Timer targetDate={event.date} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Timer({ targetDate }: { targetDate: string }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className="glass p-8 rounded-2xl text-center border-brand-teal/20">
        <h3 className="text-2xl font-bold text-brand-teal mb-2">Event is Live!</h3>
        <p className="text-text-secondary">Check the gallery for updates.</p>
      </div>
    );
  }

  const timeBlocks = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Mins", value: minutes },
    { label: "Secs", value: seconds },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4">
      {timeBlocks.map((block) => (
        <div key={block.label} className="glass flex flex-col items-center justify-center p-6 rounded-2xl border-border-default min-w-[120px]">
          <span className="text-4xl font-mono font-bold text-text-primary mb-1">
            {block.value.toString().padStart(2, "0")}
          </span>
          <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
