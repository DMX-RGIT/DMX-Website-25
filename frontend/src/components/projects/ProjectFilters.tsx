"use client";

import { FilterPills } from "@/components/shared/FilterPills";
import { ProjectDomain } from "@/types";

interface ProjectFiltersProps {
  currentDomain: ProjectDomain;
  onDomainChange: (domain: ProjectDomain) => void;
}

export function ProjectFilters({ currentDomain, onDomainChange }: ProjectFiltersProps) {
  const domains = [
    { label: "All Projects", value: "all" as ProjectDomain },
    { label: "Computer Vision", value: "cv" as ProjectDomain },
    { label: "NLP", value: "nlp" as ProjectDomain },
    { label: "Generative AI", value: "genai" as ProjectDomain },
    { label: "Robotics", value: "robotics" as ProjectDomain },
    { label: "Data Science", value: "data_science" as ProjectDomain },
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
