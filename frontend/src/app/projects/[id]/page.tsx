"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Code2, ExternalLink, Users } from "lucide-react";
import { Project } from "@/types";
import { api } from "@/lib/api";
import { SectionDivider } from "@/components/shared/SectionDivider";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await api.projects.get(id);
        setProject(data);
      } catch (error) {
        console.error("Failed to fetch project", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <button onClick={() => router.back()} className="text-brand-teal hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Projects
        </button>

        <div className="pt-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-brand-navy/30 text-brand-teal text-xs font-bold uppercase tracking-wider rounded-full border border-brand-teal/20">
                  {project.domain.replace("_", " ")}
                </span>
                {project.is_featured && (
                  <span className="px-3 py-1 bg-brand-teal/20 text-brand-teal-light text-xs font-bold uppercase tracking-wider rounded-full border border-brand-teal/30">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">
                {project.title}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {project.github_url && (
                <a 
                  href={project.github_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 rounded-full bg-bg-surface border border-border-subtle hover:border-brand-teal/50 hover:text-brand-teal transition-all"
                >
                  <Code2 className="w-5 h-5" />
                </a>
              )}
              {project.demo_url && (
                <a 
                  href={project.demo_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 rounded-full bg-brand-navy text-white hover:bg-brand-navy-light transition-all shadow-[0_0_15px_rgba(30,58,138,0.5)]"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <p className="text-xl text-text-secondary leading-relaxed mb-8">
            {project.description}
          </p>

          <SectionDivider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 my-12">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-display font-bold text-text-primary">About the Project</h2>
              <div className="text-text-secondary leading-relaxed space-y-4 whitespace-pre-wrap">
                {project.long_description || project.description}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-brand-teal" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1.5 bg-bg-surface border border-border-subtle rounded-md text-sm font-mono text-text-primary shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-teal" />
                  Contributors
                </h3>
                <div className="space-y-4">
                  {project.contributors.map((contributor, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-navy/20 flex items-center justify-center text-sm font-bold text-brand-teal">
                        {contributor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary text-sm">{contributor.name}</p>
                        <p className="text-xs text-text-secondary">{contributor.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
