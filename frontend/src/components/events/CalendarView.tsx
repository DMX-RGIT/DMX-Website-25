"use client";

import { useState } from "react";
import { Event } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    // Start with current month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Group events by day
  const eventsByDay: Record<number, Event[]> = {};
  events.forEach((event) => {
    const eventDate = new Date(event.date);
    if (
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    ) {
      const day = eventDate.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(event);
    }
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="w-full bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-default">
        <h2 className="text-xl font-bold font-display text-text-primary">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 border-b border-border-default bg-bg-secondary/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-3 text-center text-xs font-semibold text-text-muted uppercase tracking-wider border-r border-border-default last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 bg-bg-primary">
        <AnimatePresence mode="popLayout">
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="min-h-[120px] p-2 border-r border-b border-border-subtle bg-bg-secondary/20" />
          ))}
          {days.map((day) => {
            const dayEvents = eventsByDay[day] || [];
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === currentDate.getMonth() &&
              new Date().getFullYear() === currentDate.getFullYear();

            return (
              <motion.div
                key={`day-${day}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "min-h-[120px] p-2 border-r border-b border-border-subtle flex flex-col gap-1 transition-colors hover:bg-bg-secondary/30",
                  isToday && "bg-brand-navy/5"
                )}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={cn(
                      "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                      isToday ? "bg-brand-teal text-bg-primary" : "text-text-secondary"
                    )}
                  >
                    {day}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[100px] scrollbar-thin">
                  {dayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={cn(
                        "text-left px-2 py-1 text-xs rounded truncate border transition-colors",
                        event.category === "hackathon"
                          ? "bg-brand-teal/10 border-brand-teal/20 text-brand-teal hover:bg-brand-teal/20"
                          : event.category === "workshop"
                          ? "bg-brand-navy-light/10 border-brand-navy-light/20 text-brand-navy-light hover:bg-brand-navy-light/20"
                          : "bg-bg-secondary border-border-default text-text-primary hover:border-text-secondary"
                      )}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
