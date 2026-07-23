"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { DMXLogo } from "@/components/layout/DMXLogo";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  FolderKanban,
  Users,
  Image,
  Handshake,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/join", label: "Applications", icon: Users },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/sponsors", label: "Sponsors", icon: Handshake },
  { href: "/admin/content", label: "Site Content", icon: LayoutDashboard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Don't check auth on the login page itself
    if (pathname === "/admin/login") {
      setChecking(false);
      setAuthed(true); // Let the login page render
      return;
    }

    const token = localStorage.getItem("dmx_admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    // Verify token
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        setAuthed(true);
      })
      .catch(() => {
        localStorage.removeItem("dmx_admin_token");
        router.replace("/admin/login");
      })
      .finally(() => setChecking(false));
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("dmx_admin_token");
    router.replace("/admin/login");
  };

  // Login page — render without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border-default bg-bg-secondary flex flex-col">
        <div className="p-6 border-b border-border-default">
          <DMXLogo className="h-7 w-auto" />
          <p className="text-xs text-text-secondary mt-2 font-mono">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-navy/20 text-brand-teal border border-brand-navy-light/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-default">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
