"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Code2, ExternalLink, Users, ChevronLeft, ChevronRight,
  Menu, X, BookOpen, GitBranch, CheckCircle2
} from "lucide-react";
import { Project } from "@/types";
import { api } from "@/lib/api";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { cn } from "@/lib/utils";

const PAGE_BREAK = "---PAGE_BREAK---";

function parsePages(content: string): { title: string; body: string }[] {
  const raw = content.split(PAGE_BREAK).map((s) => s.trim()).filter(Boolean);
  if (raw.length === 0) return [{ title: "Overview", body: content }];
  return raw.map((section, idx) => {
    const headingMatch = section.match(/^#{1,3}\s+(.+)$/m);
    const title = headingMatch ? headingMatch[1].trim() : `Page ${idx + 1}`;
    return { title, body: section };
  });
}

function ReadingProgress({ current, total }: { current: number; total: number }) {
  if (total <= 1) return null;
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-border-subtle">
      <motion.div
        className="h-full bg-gradient-to-r from-brand-navy to-brand-teal"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <button onClick={() => router.back()} className="text-brand-teal hover:underline">Go back</button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border-subtle -mt-16 pt-16">
        <ReadingProgress current={currentPage} total={pages.length} />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${project.level_color || "var(--brand-navy)"}, transparent)` }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-text-secondary hover:text-brand-teal transition-colors mb-8 group text-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Projects
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-brand-navy/30 text-brand-teal text-xs font-bold uppercase tracking-wider rounded-full border border-brand-teal/20">
                  {project.domain.replace(/_/g, " ")}
                </span>
                {project.is_featured && (
                  <span className="px-3 py-1 bg-brand-teal/15 text-brand-teal-light text-xs font-bold uppercase tracking-wider rounded-full border border-brand-teal/30">
                    Featured
                  </span>
                )}
                {project.level && (
                  <span
                    className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${project.level_color || "#34D9A6"}18`,
                      borderColor: `${project.level_color || "#34D9A6"}40`,
                      color: project.level_color || "#34D9A6",
                    }}
                  >
                    {project.level_emoji && <span>{project.level_emoji}</span>}
                    {project.level}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4 leading-tight">
                {project.title}
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">{project.description}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {project.github_url && (
                <Link href={project.github_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bg-surface border border-border-subtle hover:border-brand-navy-light text-text-secondary hover:text-text-primary transition-all text-sm font-medium">
                  <GitBranch className="w-4 h-4" />
                  GitHub
                </Link>
              )}
              {project.demo_url && (
                <Link href={project.demo_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-navy text-white hover:bg-brand-navy-light transition-all text-sm font-medium shadow-[0_0_20px_rgba(30,58,138,0.4)]">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </Link>
              )}
            </div>
          </div>

          {isMultiPage && (
            <div className="flex items-center gap-2 mt-8">
              {pages.map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i)}
                  className={cn("transition-all duration-300 rounded-full",
                    i === currentPage ? "w-6 h-2 bg-brand-teal" : "w-2 h-2 bg-border-default hover:bg-text-secondary"
                  )}
                />
              ))}
              <span className="ml-2 text-xs text-text-muted font-mono">{currentPage + 1} / {pages.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* Docs Sidebar */}
          {showSidebar && (
            <>
              <button onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed bottom-20 right-6 z-40 p-3 rounded-full bg-brand-navy text-white shadow-lg hover:bg-brand-navy-light transition-all">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              )}
              <aside className={cn(
                "shrink-0 w-56",
                "fixed md:sticky md:top-24 left-0 top-0 z-40 h-screen md:h-[calc(100vh-6rem)] overflow-y-auto",
                "bg-bg-secondary md:bg-transparent border-r md:border-r-0 border-border-default",
                "p-4 md:p-0",
                "transition-transform duration-300",
                sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
              )}>
                <div className="md:border md:border-border-subtle md:rounded-xl md:p-4 md:bg-bg-surface/30">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    Contents
                  </p>
                  <nav className="space-y-1">
                    {pages.map((page, idx) => (
                      <button key={idx} onClick={() => { setCurrentPage(idx); setSidebarOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2.5",
                          idx === currentPage
                            ? "bg-brand-navy/20 text-brand-teal border border-brand-navy-light/30"
                            : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                        )}>
                        {idx < currentPage ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal/60 shrink-0" />
                        ) : (
                          <span className="w-5 h-5 shrink-0 rounded-full bg-bg-primary border border-border-default flex items-center justify-center text-[10px] font-mono text-text-muted">
                            {idx + 1}
                          </span>
                        )}
                        <span className="truncate">{page.title}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {isMultiPage && (
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-1 bg-bg-surface rounded-md border border-border-subtle font-mono text-xs text-text-muted">
                  {currentPage + 1}/{pages.length}
                </span>
                <span className="text-sm font-semibold text-text-primary">{pages[currentPage].title}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <MarkdownRenderer content={pages[currentPage].body} />
              </motion.div>
            </AnimatePresence>

            {isMultiPage && (
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-border-subtle">
                {currentPage > 0 ? (
                  <button onClick={() => setCurrentPage(currentPage - 1)}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl border border-border-default text-text-secondary hover:text-text-primary hover:border-brand-navy-light hover:bg-bg-surface transition-all text-sm font-medium group">
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <div className="text-left">
                      <div className="text-xs text-text-muted">Previous</div>
                      <div className="font-semibold">{pages[currentPage - 1].title}</div>
                    </div>
                  </button>
                ) : <div />}
                {currentPage < pages.length - 1 ? (
                  <button onClick={() => setCurrentPage(currentPage + 1)}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl border border-brand-navy-light/40 bg-brand-navy/10 text-text-primary hover:bg-brand-navy/20 hover:border-brand-navy-light transition-all text-sm font-medium group">
                    <div className="text-right">
                      <div className="text-xs text-text-muted">Next</div>
                      <div className="font-semibold">{pages[currentPage + 1].title}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-brand-teal font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    All done!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Meta Sidebar */}
          {(!isMultiPage || !showSidebar || currentPage === 0) && (
            <div className="w-full md:w-64 shrink-0 space-y-5">
              {project.tech_stack.length > 0 && (
                <div className="border border-border-subtle rounded-xl p-5 bg-bg-surface/20">
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-brand-teal" />
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech: string) => (
                      <span key={tech}
                        className="px-3 py-1.5 bg-bg-primary border border-border-subtle rounded-lg text-sm font-mono text-text-primary hover:border-brand-navy-light transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.contributors.length > 0 && (
                <div className="border border-border-subtle rounded-xl p-5 bg-bg-surface/20">
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-brand-teal" />
                    Contributors
                  </h3>
                  <div className="space-y-3">
                    {project.contributors.map((c: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ background: `linear-gradient(135deg, var(--brand-navy), ${project.level_color || "var(--brand-teal)"})`}}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary text-sm">{c.name}</p>
                          <p className="text-xs text-text-secondary">{c.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>
          )}
        </div>
      </div>
    </>
  );
}