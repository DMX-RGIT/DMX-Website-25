"use client";

import { FilterPills } from "@/components/shared/FilterPills";
import { ProjectDomain } from "@/types";

interface ProjectFiltersProps {
  currentDomain: ProjectDomain;
  onDomainChange: (domain: ProjectDomain) => void;
  availableDomains: string[];
}

function formatDomainLabel(domain: string): string {
  // Convert common abbreviations / snake_case to readable labels
  const map: Record<string, string> = {
    cv: "Computer Vision",
    nlp: "NLP",
    genai: "Generative AI",
    ml: "Machine Learning",
    ai: "AI",
  };
  if (map[domain.toLowerCase()]) return map[domain.toLowerCase()];
  return domain
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ProjectFilters({ currentDomain, onDomainChange, availableDomains }: ProjectFiltersProps) {
  const domains = [
    { label: "All Projects", value: "all" as ProjectDomain },
    ...availableDomains.map((d) => ({
      label: formatDomainLabel(d),
      value: d as ProjectDomain,
    })),
  ];

  return (
    <FilterPills
      options={domains}
      value={currentDomain}
      onChange={onDomainChange}
      className="justify-start mb-10"
    />
  );
}
