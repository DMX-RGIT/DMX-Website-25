"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Code2, ExternalLink, Users, ChevronLeft, ChevronRight, Menu, X, Award } from "lucide-react";
import { Project } from "@/types";
import { api } from "@/lib/api";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { cn } from "@/lib/utils";

const PAGE_BREAK = "---PAGE_BREAK---";

function parsePages(content: string): { title: string; body: string }[] {
  const raw = content.split(PAGE_BREAK).map((s) => s.trim()).filter(Boolean);
  if (raw.length === 0) return [{ title: "Overview", body: content }];

  return raw.map((section, idx) => {
    // Extract first heading as page title
    const headingMatch = section.match(/^#{1,3}\s+(.+)$/m);
    const title = headingMatch ? headingMatch[1].trim() : `Page ${idx + 1}`;
    return { title, body: section };
  });
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const pages = useMemo(() => {
    if (!project) return [];
    return parsePages(project.long_description || project.description);
  }, [project]);

  const isMultiPage = pages.length > 1;
  const showSidebar = project?.show_sidebar && isMultiPage;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
    <div className="min-h-screen pt-4 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Projects
        </button>

        {/* Header */}
        <div className="pt-2">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="px-3 py-1 bg-brand-navy/30 text-brand-teal text-xs font-bold uppercase tracking-wider rounded-full border border-brand-teal/20">
                  {project.domain.replace("_", " ")}
                </span>
                {project.is_featured && (
                  <span className="px-3 py-1 bg-brand-teal/20 text-brand-teal-light text-xs font-bold uppercase tracking-wider rounded-full border border-brand-teal/30">
                    Featured
                  </span>
                )}
                {project.level && (
                  <span 
                    className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border flex items-center gap-1.5"
                    style={{ 
                      backgroundColor: `${project.level_color || '#34D9A6'}15`,
                      borderColor: `${project.level_color || '#34D9A6'}40`,
                      color: project.level_color || '#34D9A6'
                    }}
                  >
                    {project.level_emoji && <span>{project.level_emoji}</span>}
                    {project.level}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-3">
                {project.title}
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
                {project.description}
              </p>
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

          <SectionDivider />

          {/* Main Content with Optional Sidebar */}
          <div className={cn("my-6", showSidebar ? "flex gap-6" : "")}>
            
            {/* Sidebar — docs navigation */}
            {showSidebar && (
              <>
                {/* Mobile sidebar toggle */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden fixed bottom-6 right-6 z-40 p-3 rounded-full bg-brand-navy text-white shadow-lg hover:bg-brand-navy-light transition-all"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Mobile overlay */}
                {sidebarOpen && (
                  <div className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                )}

                <aside className={cn(
                  "shrink-0 w-60",
                  // Mobile: slide in from left
                  "fixed md:sticky md:top-24 left-0 top-0 z-40 h-screen md:h-auto",
                  "bg-bg-secondary md:bg-transparent border-r md:border-r-0 border-border-default",
                  "p-4 md:p-0",
                  "transition-transform duration-300",
                  sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}>
                  <nav className="space-y-1">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 px-3">
                      Contents
                    </p>
                    {pages.map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setCurrentPage(idx); setSidebarOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          idx === currentPage
                            ? "bg-brand-navy/20 text-brand-teal border border-brand-navy-light/30"
                            : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                        )}
                      >
                        <span className="text-xs text-text-muted mr-2">{String(idx + 1).padStart(2, '0')}</span>
                        {page.title}
                      </button>
                    ))}
                  </nav>
                </aside>
              </>
            )}

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                "grid gap-6",
                (showSidebar && currentPage !== 0) ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
              )}>
                {/* Main doc content */}
                <div className={(showSidebar && currentPage !== 0) ? "" : "md:col-span-2"}>
                  {isMultiPage && (
                    <div className="flex items-center gap-2 mb-4 text-xs text-text-secondary">
                      <span className="px-2 py-1 bg-bg-surface rounded border border-border-subtle font-mono">
                        {currentPage + 1} / {pages.length}
                      </span>
                      <span className="font-semibold">{pages[currentPage].title}</span>
                    </div>
                  )}
                  <MarkdownRenderer content={pages[currentPage].body} />

                  {/* Prev / Next Navigation */}
                  {isMultiPage && (
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-border-subtle">
                      {currentPage > 0 ? (
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-default text-text-secondary hover:text-text-primary hover:border-brand-navy-light transition-all text-sm font-medium group"
                        >
                          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                          <div className="text-left">
                            <div className="text-xs text-text-muted">Previous</div>
                            <div>{pages[currentPage - 1].title}</div>
                          </div>
                        </button>
                      ) : <div />}

                      {currentPage < pages.length - 1 ? (
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-brand-navy-light/30 bg-brand-navy/10 text-text-primary hover:bg-brand-navy/20 transition-all text-sm font-medium group"
                        >
                          <div className="text-right">
                            <div className="text-xs text-text-muted">Next</div>
                            <div>{pages[currentPage + 1].title}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      ) : <div />}
                    </div>
                  )}
                </div>

                {/* Right sidebar: Tech Stack & Contributors */}
                {(!showSidebar || currentPage === 0) && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
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
                      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-brand-teal" />
                        Contributors
                      </h3>
                      <div className="space-y-3">
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
                )}
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
