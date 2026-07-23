"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Project, ProjectDomain } from "@/types";
import { api } from "@/lib/api";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionDivider } from "@/components/shared/SectionDivider";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<ProjectDomain>("all");
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const data = await api.projects.list(domain !== "all" ? { domain } : undefined);
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [domain]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4 text-center">
          Research & Projects
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto text-center mb-12">
          Exploring the frontiers of AI. Browse our members&apos; work across computer vision, NLP, and robotics.
        </p>

        <SectionDivider />

        <div className="mt-12">
          <ProjectFilters currentDomain={domain} onDomainChange={setDomain} />

          {loading ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-bg-surface animate-pulse break-inside-avoid" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-32">
              <h3 className="text-xl font-bold text-text-primary mb-2">No projects found</h3>
              <p className="text-text-secondary">Try selecting a different domain filter.</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="break-inside-avoid">
                  <ProjectCard 
                    project={project} 
                    onClick={() => router.push(`/projects/${project.id}`)} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
