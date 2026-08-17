"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, Heart } from "lucide-react";
import { Event } from "@/types";
import { api } from "@/lib/api";
import { cn, stripMarkdown } from "@/lib/utils";
import { TiltCard } from "@/components/shared/TiltCard";

interface EventCardProps {
  event: Event;
  index: number;
  onClick?: () => void;
}

export function EventCard({ event, index, onClick }: EventCardProps) {
  const isHackathon = event.category === "hackathon";
  const [interestCount, setInterestCount] = useState(event.interest_count || 0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasLiked(localStorage.getItem(`liked_${event.id}`) === "true");
    }
  }, [event.id]);

  const handleInterest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) return;

    // Optimistic update
    setHasLiked(true);
    setInterestCount(prev => prev + 1);
    localStorage.setItem(`liked_${event.id}`, "true");

    try {
      await api.events.registerInterest(event.id);
    } catch (err) {
      // Revert on failure
      setHasLiked(false);
      setInterestCount(prev => prev - 1);
      localStorage.removeItem(`liked_${event.id}`);
    }
  };

  return (
    <TiltCard className="h-full">
      <motion.div
        onClick={onClick}
        className={cn(
          "group relative glass-card flex flex-col h-full overflow-hidden transition-all duration-300",
          onClick && "cursor-pointer",
          isHackathon && "border-2 hover:border-brand-teal shadow-[4px_4px_0_rgba(30,58,138,0.5)]"
        )}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Date Badge */}
        <div className="absolute top-4 right-4 z-20" style={{ transform: "translateZ(50px)" }}>
          <div className="bg-brand-navy text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-brand-navy-light backdrop-blur-md">
            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        </div>

        {/* Image / Thumbnail placeholder */}
        <div className="relative h-48 w-full bg-bg-surface overflow-hidden border-b border-border-default" style={{ transform: "translateZ(20px)" }}>
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/10 to-brand-teal/10 group-hover:from-brand-navy/20 group-hover:to-brand-teal/20 transition-colors duration-300" />
          )}
          
          {/* Category Tag (Neobrutalist for Hackathons) */}
          <div className="absolute bottom-4 left-4 z-20">
            <div
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md",
                isHackathon 
                  ? "bg-brand-teal text-bg-primary -rotate-2 border-2 border-bg-primary"
                  : "bg-bg-primary text-text-secondary border border-border-default"
              )}
            >
              {event.category.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-xl font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-brand-teal transition-colors">
            {event.title}
          </h3>
          
          <p className="text-sm text-text-secondary mb-6 line-clamp-3 flex-1">
            {stripMarkdown(event.description)}
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Calendar className="w-3.5 h-3.5 text-brand-navy-light" />
              <span>
                {new Date(event.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                {event.end_date && ` - ${new Date(event.end_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <MapPin className="w-3.5 h-3.5 text-brand-navy-light" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Action Link & Interest */}
          <div className="mt-auto pt-4 border-t border-border-subtle flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
            <a
              href={event.registration_url || "#"}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal group-hover:text-brand-teal-light transition-colors"
            >
              {event.is_upcoming ? "Register Now" : "View Details"}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                handleInterest(e); 
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 relative z-20 cursor-pointer",
                hasLiked 
                  ? "bg-red-500/10 text-red-500" 
                  : "bg-bg-primary text-text-muted hover:bg-bg-surface hover:text-red-400 border border-border-subtle"
              )}
            >
              <Heart 
                className={cn("w-3.5 h-3.5 transition-transform", hasLiked && "fill-current scale-110")} 
              />
              <span>{interestCount}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}
