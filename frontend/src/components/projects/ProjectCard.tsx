"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink, Users } from "lucide-react";
import { Project } from "@/types";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/shared/TiltCard";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <TiltCard className="h-full">
      <motion.div
        onClick={onClick}
        className={cn(
          "group cursor-pointer bg-bg-secondary rounded-xl border border-border-default hover:border-brand-teal/50 transition-colors p-6 flex flex-col h-full",
          project.is_featured && "border-l-4 border-l-brand-teal"
        )}
        layoutId={`project-${project.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex justify-between items-start mb-4" style={{ transform: "translateZ(40px)" }}>
          <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-teal transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-text-secondary">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-text-primary transition-colors">
                <Code2 className="w-4 h-4" />
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-text-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-6 flex-1 line-clamp-3" style={{ transform: "translateZ(30px)" }}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4" style={{ transform: "translateZ(20px)" }}>
          {project.tech_stack.slice(0, 4).map((tech) => (
            <span key={tech} className="px-2 py-1 bg-bg-surface border border-border-subtle rounded-md text-xs font-mono text-text-muted">
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 4 && (
            <span className="px-2 py-1 bg-bg-surface border border-border-subtle rounded-md text-xs font-mono text-text-muted">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-text-muted mt-auto pt-4 border-t border-border-subtle" style={{ transform: "translateZ(10px)" }}>
          <Users className="w-3.5 h-3.5" />
          <span>{project.contributors.length} contributors</span>
        </div>
      </motion.div>
    </TiltCard>
  );
}
