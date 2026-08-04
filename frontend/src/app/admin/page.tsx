"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { CalendarDays, FolderKanban, Users, Image, Handshake, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const sections = [
  { href: "/admin/events", label: "Events", icon: CalendarDays, count: "Manage hackathons, workshops, and sessions" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, count: "Add and update research projects" },
  { href: "/admin/team", label: "Team", icon: Users, count: "Manage committee members" },
  { href: "/admin/gallery", label: "Gallery", icon: Image, count: "Upload and organize photos" },
  { href: "/admin/sponsors", label: "Sponsors", icon: Handshake, count: "Manage sponsor logos and links" },
];

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  type: "event" | "project";
  meta: string;
}

export default function AdminDashboard() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const fetchTimeline = useCallback(async () => {
    setLoadingTimeline(true);
    try {
      const token = localStorage.getItem("dmx_admin_token") || "";
      const headers = { Authorization: `Bearer ${token}` };

      const [eventsRes, projectsRes, contentRes] = await Promise.all([
        fetch(`${API_BASE}/events`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/projects`, { headers }).then(r => r.json()),
        fetch(`${API_BASE}/content`, { headers }).then(r => r.json()).catch(() => ({})),
      ]);

      setShowTimeline(contentRes.show_timeline ?? false);

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
      console.error("Failed to load timeline", err);
    } finally {
      setLoadingTimeline(false);
    }
  }, []);

  useEffect(() => { fetchTimeline(); }, [fetchTimeline]);

  const toggleTimeline = async () => {
    const newVal = !showTimeline;
    setShowTimeline(newVal);
    try {
      const token = localStorage.getItem("dmx_admin_token") || "";
      // Fetch current content first to preserve all fields
      const currentRes = await fetch(`${API_BASE}/content`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const current = await currentRes.json();
      
      await fetch(`${API_BASE}/admin/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...current, show_timeline: newVal }),
      });
    } catch (err) {
      console.error("Failed to toggle timeline", err);
      setShowTimeline(!newVal); // Revert on error
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Dashboard</h1>
      <p className="text-text-secondary mb-6">Welcome to the DMX admin panel. Manage all website content from here.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group p-5 rounded-xl border border-border-default bg-bg-secondary hover:border-brand-navy-light transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-brand-navy/10 border border-brand-navy-light/20 flex items-center justify-center group-hover:bg-brand-navy/20 transition-colors">
                <section.icon className="w-5 h-5 text-brand-teal" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">{section.label}</h2>
            </div>
            <p className="text-sm text-text-secondary">{section.count}</p>
          </Link>
        ))}
      </div>

      {/* Timeline Section */}
      <div className="border border-border-default rounded-xl bg-bg-secondary overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border-default">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Activity Timeline</h2>
            <p className="text-xs text-text-secondary mt-0.5">Combined chronological view of events and projects</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary">Show on frontend</span>
            <button 
              onClick={toggleTimeline}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
                showTimeline ? "bg-brand-teal" : "bg-bg-surface border-border-default"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
                  showTimeline ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        <div className="p-5">
          {loadingTimeline ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 rounded-lg bg-bg-surface animate-pulse" />
              ))}
            </div>
          ) : timeline.length === 0 ? (
            <p className="text-center text-text-secondary py-8 text-sm">No events or projects to display.</p>
          ) : (
            <div className="relative group/timeline">
              <button 
                onClick={() => scroll("left")} 
                className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-30 p-2 text-text-secondary hover:text-brand-teal opacity-0 group-hover/timeline:opacity-60 hover:!opacity-100 transition-all duration-300 hidden md:flex items-center justify-center hover:scale-110"
              >
                <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
              </button>
              
              <button 
                onClick={() => scroll("right")} 
                className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-30 p-2 text-text-secondary hover:text-brand-teal opacity-0 group-hover/timeline:opacity-60 hover:!opacity-100 transition-all duration-300 hidden md:flex items-center justify-center hover:scale-110"
              >
                <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
              </button>

              <div ref={scrollRef} className="relative w-full overflow-x-auto pb-6 pt-4 no-scrollbar [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="flex items-center gap-6 min-w-max px-4 relative h-[200px]">
                  {/* Timeline line */}
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-border-default -translate-y-1/2 z-0" />
                  
                  {timeline.slice(0, 20).map((item, idx) => (
                  <div key={`${item.type}-${item.id}`} className="relative w-[240px] h-full shrink-0 flex items-center justify-center group">
                    {/* Card */}
                    <div className={`absolute left-0 right-0 bg-bg-primary border border-border-default p-4 rounded-xl shadow-sm z-10 transition-transform group-hover:-translate-y-1 ${idx % 2 === 0 ? 'bottom-[120px]' : 'top-[120px]'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                          item.type === "event" 
                            ? "bg-brand-teal/10 text-brand-teal" 
                            : "bg-brand-navy/10 text-brand-navy-light"
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-xs text-text-secondary truncate">{item.meta}</span>
                      </div>
                      <h3 className="text-sm font-bold text-text-primary mb-1 truncate">{item.title}</h3>
                      <p className="text-xs text-text-secondary font-mono">
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>

                    {/* Dot */}
                    <div className={`absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 rounded-full bg-bg-secondary border-4 border-bg-primary flex items-center justify-center z-20 shadow-sm group-hover:border-brand-teal/30 transition-colors`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${item.type === "event" ? "bg-brand-teal" : "bg-brand-navy-light"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
