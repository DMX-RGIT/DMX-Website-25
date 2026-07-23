"use client";

import { cn } from "@/lib/utils";

interface FilterOption<T extends string> {
  label: string;
  value: T;
}

interface FilterPillsProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterPillsProps<T>) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-3", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border",
            value === option.value
              ? "border-brand-navy-light bg-bg-surface text-text-primary shadow-[0_0_15px_rgba(30,58,138,0.3)]"
              : "border-border-default bg-transparent text-text-secondary hover:text-text-primary hover:border-brand-navy-light"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
