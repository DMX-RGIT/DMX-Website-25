"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Event, EventCategory } from "@/types";
import { api } from "@/lib/api";
import { EventFilterBar } from "@/components/events/EventFilterBar";
import { EventCard } from "@/components/events/EventCard";
import { Countdown } from "@/components/events/Countdown";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { CalendarView } from "@/components/events/CalendarView";
import { LayoutGrid, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const [category, setCategory] = useState<EventCategory>("all");
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");

  // We find the nearest upcoming flagship event
  const flagshipEvent = events.find(e => e.is_flagship && e.is_upcoming);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const params: any = { upcoming: isUpcoming ? "true" : "false" };
        if (category !== "all") params.category = category;
        
        const data = await api.events.list(params);
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, [category, isUpcoming]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">
          Events
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
          From 36-hour hackathons to deep learning workshops, join us to build, learn, and connect.
        </p>
        
        {flagshipEvent && (
          <div className="inline-block p-6 rounded-2xl glass-card border border-brand-teal/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-sm font-semibold text-brand-teal uppercase tracking-wider mb-2">Next Flagship Event</p>
            <h3 className="text-xl font-bold text-text-primary mb-4">{flagshipEvent.title}</h3>
            <Countdown targetDate={flagshipEvent.date} />
          </div>
        )}
      </div>

      <SectionDivider />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <EventFilterBar 
            currentCategory={category}
            onCategoryChange={setCategory}
            isUpcoming={isUpcoming}
            onUpcomingChange={setIsUpcoming}
          />

          <div className="flex items-center bg-bg-surface border border-border-default rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md flex items-center gap-2 text-sm font-semibold transition-colors",
                viewMode === "grid" ? "bg-bg-primary text-brand-teal shadow-sm" : "text-text-muted hover:text-text-primary"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "p-2 rounded-md flex items-center gap-2 text-sm font-semibold transition-colors",
                viewMode === "calendar" ? "bg-bg-primary text-brand-teal shadow-sm" : "text-text-muted hover:text-text-primary"
              )}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-xl bg-bg-surface animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="text-xl font-bold text-text-primary mb-2">No events found</h3>
            <p className="text-text-secondary">Check back later or adjust your filters.</p>
          </div>
        ) : viewMode === "calendar" ? (
          <CalendarView events={events} onEventClick={(e) => router.push(`/events/${e.id}`)} />
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  index={index} 
                  onClick={() => router.push(`/events/${event.id}`)}
                />
              ))}
            </div>
            {/* Mobile Swipeable Stack (Horizontal Scroll Snap) */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-4 scrollbar-hide">
              {events.map((event, index) => (
                <div key={event.id} className="snap-center shrink-0 w-[85vw]">
                  <EventCard 
                    event={event} 
                    index={index} 
                    onClick={() => router.push(`/events/${event.id}`)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
