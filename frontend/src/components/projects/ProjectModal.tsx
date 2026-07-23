"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Code2, ExternalLink, Users } from "lucide-react";
import { Project } from "@/types";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          layoutId={`project-${project.id}`}
          className="relative w-full max-w-3xl max-h-[90vh] bg-bg-primary border border-border-default rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          <div className="flex justify-between items-start p-6 border-b border-border-subtle">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-2">
                {project.domain.replace("_", " ")}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-text-primary">
                {project.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-bg-surface hover:bg-border-subtle rounded-full text-text-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto scrollbar-thin flex-1">
            <p className="text-text-secondary text-base md:text-lg mb-8 leading-relaxed">
              {project.long_description || project.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tech Stack */}
              <div>
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4">
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-bg-surface border border-border-subtle rounded-lg text-sm font-mono text-text-secondary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contributors */}
              <div>
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-teal" />
                  Team
                </h4>
                <ul className="space-y-3">
                  {project.contributors.map((contrib, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-text-primary">{contrib.name}</span>
                      <span className="text-text-muted">{contrib.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="p-6 border-t border-border-subtle bg-bg-secondary flex gap-4">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bg-primary border border-border-default hover:border-brand-navy-light hover:text-brand-teal rounded-lg text-sm font-semibold transition-colors"
              >
                <Code2 className="w-4 h-4" />
                View Source
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-teal hover:bg-brand-teal-light text-bg-primary rounded-lg text-sm font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
