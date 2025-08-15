'use client';

import Image from 'next/image';
import { Project } from '@/types';
import { Github, ExternalLink } from 'lucide-react';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 card-hover">
      {project.coverImage && (
        <div className="relative h-48 w-full">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dmx-dark/80 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition">
          {project.title}
        </h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs bg-dmx-primary/20 text-dmx-primary rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-white transition"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-white transition"
            >
              <ExternalLink className="w-4 h-4" />
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
