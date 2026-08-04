"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { CalendarDays, FolderKanban, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { SectionDivider } from "@/components/shared/SectionDivider";

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  type: "event" | "project";
  meta: string;
}

export function TimelineSection() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    async function loadTimeline() {
      try {
        const content = await api.stats.get().catch(() => ({}));
        if (!content.show_timeline) {
          setShowTimeline(false);
          setLoading(false);
          return;
        }
        setShowTimeline(true);

        const [eventsRes, projectsRes] = await Promise.all([
          api.events.list(),
          api.projects.list()
        ]);

        const items: TimelineItem[] = [
          ...eventsRes.map((e: any) => ({
            id: e.id,
            title: e.title,
            date: e.date,
            type: "event" as const,
            meta: e.category,
          })),
          ...projectsRes.map((p: any) => ({
            id: p.id,
            title: p.title,
            date: p.created_at,
            type: "project" as const,
            meta: p.domain,
          })),
        ];

        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTimeline(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, []);

  if (loading || !showTimeline || timeline.length === 0) return null;

  return (
    <>
    <div className="py-20 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Activity Timeline</h2>
          <p className="text-lg text-text-secondary">A chronological view of our latest events and research projects.</p>
        </div>

        <div className="relative group ">
          <button 
            onClick={() => scroll("left")} 
            className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-30 p-2 text-text-secondary hover:text-brand-teal opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-all duration-300 hidden md:flex items-center justify-center hover:scale-110"
          >
            <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
          </button>
          
          <button 
            onClick={() => scroll("right")} 
            className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-30 p-2 text-text-secondary hover:text-brand-teal opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-all duration-300 hidden md:flex items-center justify-center hover:scale-110"
          >
            <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
          </button>

          <div ref={scrollRef} className="relative w-full overflow-x-auto pb-8 pt-4 no-scrollbar [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex items-center gap-8 min-w-max px-8 relative h-[320px]">
              {/* Horizontal line */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-border-default -translate-y-1/2 z-0" />
              
              {timeline.slice(0, 10).map((item, idx) => (
                <motion.div 
                  key={`${item.type}-${item.id}`}
                  className="relative w-[280px] h-full shrink-0 flex items-center justify-center group/card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className={`absolute left-0 right-0 bg-bg-surface border border-border-subtle p-5 rounded-xl shadow-sm z-10 transition-transform group-hover/card:-translate-y-1 ${idx % 2 === 0 ? 'bottom-[180px]' : 'top-[180px]'}`}>
                    <p className="text-xs text-text-secondary font-mono mb-2">
                      {new Date(item.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    <h3 className="text-lg font-bold text-text-primary mb-1">{item.title}</h3>
                    <p className="text-xs text-brand-teal uppercase tracking-wider font-semibold">{item.meta.replace("_", " ")}</p>
                  </div>

                  <div className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 rounded-full bg-bg-secondary border-4 border-bg-primary flex items-center justify-center z-20 shadow-lg group-hover/card:border-brand-teal/20 transition-colors">
                    {item.type === "event" ? <CalendarDays className="w-5 h-5 text-brand-teal" /> : <FolderKanban className="w-5 h-5 text-brand-navy-light" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <SectionDivider />
    </>
  );
}
