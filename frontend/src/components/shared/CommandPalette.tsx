"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Search, Calendar, FolderKanban, Users, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
      {/* Click outside to close */}
      <div 
        className="absolute inset-0 z-[-1]" 
        onClick={() => setOpen(false)} 
      />
      
      <div className="w-full max-w-xl mx-4 glass-card overflow-hidden shadow-2xl">
        <Command
          className="w-full bg-transparent flex flex-col"
          loop
        >
          <div className="flex items-center border-b border-border-subtle px-4">
            <Search className="w-5 h-5 text-text-muted shrink-0" />
            <Command.Input
              className="w-full h-14 bg-transparent outline-none border-none placeholder:text-text-muted text-text-primary px-3 text-lg font-sans"
              placeholder="Type a command or search..."
              autoFocus
            />
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="py-6 text-center text-sm text-text-muted">
              No results found.
            </Command.Empty>

            <Command.Group heading={<div className="px-2 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider">Navigation</div>}>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/events"))}
                className="flex items-center gap-2 px-2 py-3 rounded-lg text-sm text-text-secondary cursor-pointer aria-selected:bg-bg-surface aria-selected:text-text-primary transition-colors"
              >
                <Calendar className="w-4 h-4 text-brand-teal" />
                <span>Events & Hackathons</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/projects"))}
                className="flex items-center gap-2 px-2 py-3 rounded-lg text-sm text-text-secondary cursor-pointer aria-selected:bg-bg-surface aria-selected:text-text-primary transition-colors"
              >
                <FolderKanban className="w-4 h-4 text-brand-teal" />
                <span>Research & Projects</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/team"))}
                className="flex items-center gap-2 px-2 py-3 rounded-lg text-sm text-text-secondary cursor-pointer aria-selected:bg-bg-surface aria-selected:text-text-primary transition-colors"
              >
                <Users className="w-4 h-4 text-brand-teal" />
                <span>Team Members</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/gallery"))}
                className="flex items-center gap-2 px-2 py-3 rounded-lg text-sm text-text-secondary cursor-pointer aria-selected:bg-bg-surface aria-selected:text-text-primary transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-brand-teal" />
                <span>Gallery</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading={<div className="px-2 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider mt-2">Quick Actions</div>}>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/join"))}
                  className="flex items-center gap-2 px-2 py-3 rounded-lg text-sm text-text-secondary cursor-pointer aria-selected:bg-bg-surface aria-selected:text-text-primary transition-colors"
                >
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-brand-teal text-bg-primary text-[10px] font-bold">
                    +
                  </span>
                  <span>Join DMX</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    const theme = document.documentElement.getAttribute("data-theme");
                    const newTheme = theme === "dark" ? "light" : "dark";
                    document.documentElement.setAttribute("data-theme", newTheme);
                    localStorage.setItem("dmx-theme", newTheme);
                    runCommand(() => window.dispatchEvent(new Event("storage"))); // Optional depending on how ThemeProvider listens
                  }}
                  className="flex items-center gap-2 px-2 py-3 rounded-lg text-sm text-text-secondary cursor-pointer aria-selected:bg-bg-surface aria-selected:text-text-primary transition-colors"
                >
                  <span className="w-4 h-4 text-brand-teal flex items-center justify-center">🌓</span>
                  <span>Toggle Theme</span>
                </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
