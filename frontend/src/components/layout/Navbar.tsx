"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { DMXLogo } from "./DMXLogo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks: { href: string; label: string; badge?: boolean }[] = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/sih", label: "SIH 2026", badge: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Hide the public navbar on admin pages (admin has its own sidebar)
  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "relative z-50 transition-all duration-300 bg-bg-primary border-b border-border-default"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <DMXLogo className="h-8 w-auto" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-1.5",
                  isActive
                    ? "text-text-primary"
                    : link.badge
                    ? "text-brand-teal hover:text-brand-teal-light"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                {link.label}
                {link.badge && (
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-brand-teal"
                    style={{ boxShadow: "0 0 0 3px rgba(52,217,166,.2)", animation: "pulse 2s ease-in-out infinite" }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ background: "var(--brand-teal)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side: Search hint, Theme toggle + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-bg-surface/50 text-text-muted text-sm cursor-default hover:bg-bg-surface hover:text-text-secondary transition-colors mr-2">
            <span className="opacity-70">Search</span>
            <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-bg-secondary border border-border-subtle opacity-70">Ctrl K</kbd>
          </div>
          <ThemeToggle />
          <Link
            href="/join"
            className="px-5 py-2 text-sm font-semibold rounded-lg text-bg-primary transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-teal)" }}
          >
            Join DMX
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-glass-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
                      isActive
                        ? "text-text-primary bg-bg-surface"
                        : link.badge
                        ? "text-brand-teal hover:bg-bg-surface"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-surface",
                    )}
                  >
                    {link.label}
                    {link.badge && (
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full bg-brand-teal"
                        style={{ boxShadow: "0 0 0 3px rgba(52,217,166,.2)" }}
                      />
                    )}
                  </Link>
                );
              })}
              <Link
                href="/join"
                className="mt-2 px-4 py-3 text-sm font-semibold text-center rounded-lg text-bg-primary"
                style={{ background: "var(--gradient-teal)" }}
              >
                Join DMX
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
