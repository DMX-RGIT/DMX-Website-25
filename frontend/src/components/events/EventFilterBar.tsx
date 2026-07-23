"use client";

import { FilterPills } from "@/components/shared/FilterPills";
import { EventCategory } from "@/types";
import { cn } from "@/lib/utils";

interface EventFilterBarProps {
  currentCategory: EventCategory;
  onCategoryChange: (category: EventCategory) => void;
  isUpcoming: boolean;
  onUpcomingChange: (upcoming: boolean) => void;
}

export function EventFilterBar({
  currentCategory,
  onCategoryChange,
  isUpcoming,
  onUpcomingChange,
}: EventFilterBarProps) {
  const categories = [
    { label: "All Events", value: "all" as EventCategory },
    { label: "Hackathons", value: "hackathon" as EventCategory },
    { label: "Workshops", value: "workshop" as EventCategory },
    { label: "Speaker Sessions", value: "speaker_session" as EventCategory },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
      {/* Category Pills */}
      <FilterPills
        options={categories}
        value={currentCategory}
        onChange={onCategoryChange}
        className="justify-start"
      />

      {/* Upcoming / Past Toggle */}
      <div className="flex items-center gap-1 p-1 rounded-full bg-bg-surface border border-border-default">
        <button
          onClick={() => onUpcomingChange(true)}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
            isUpcoming
              ? "bg-bg-primary text-text-primary shadow-sm border border-brand-navy-light shadow-[0_0_10px_rgba(30,58,138,0.2)]"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          Upcoming
        </button>
        <button
          onClick={() => onUpcomingChange(false)}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
            !isUpcoming
              ? "bg-bg-primary text-text-primary shadow-sm border border-brand-navy-light shadow-[0_0_10px_rgba(30,58,138,0.2)]"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          Past
        </button>
      </div>
    </div>
  );
}
