"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { DMXLogo } from "@/components/layout/DMXLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  FolderKanban,
  Users,
  Image,
  Handshake,
  LogOut,
  LayoutDashboard,
  Lock,
} from "lucide-react";

const ALL_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["superadmin"] },
  { href: "/admin/join", label: "Applications", icon: Users, roles: ["superadmin"] },
  { href: "/admin/events", label: "Events", icon: CalendarDays, roles: ["superadmin", "events"] },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, roles: ["superadmin"] },
  { href: "/admin/team", label: "Team", icon: Users, roles: ["superadmin"] },
  { href: "/admin/gallery", label: "Gallery", icon: Image, roles: ["superadmin", "events"] },
  { href: "/admin/sponsors", label: "Sponsors", icon: Handshake, roles: ["superadmin"] },
  { href: "/admin/content", label: "Site Content", icon: LayoutDashboard, roles: ["superadmin", "events"] },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [role, setRole] = useState<string>("superadmin");

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      setAuthed(true);
      return;
    }

    const token = localStorage.getItem("dmx_admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        const userRole: string = data.role || "superadmin";
        setRole(userRole);
        localStorage.setItem("dmx_admin_role", userRole);

        // Enforce route access — events admins can only visit /admin/events
        const allowedLinks = ALL_LINKS.filter((l) => l.roles.includes(userRole));
        const allowedHrefs = allowedLinks.map((l) => l.href);
        if (!allowedHrefs.some((href) => pathname === href || pathname.startsWith(href + "/"))) {
          router.replace("/admin/events");
          return;
        }

        setAuthed(true);
      })
      .catch(() => {
        localStorage.removeItem("dmx_admin_token");
        localStorage.removeItem("dmx_admin_role");
        router.replace("/admin/login");
      })
      .finally(() => setChecking(false));
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("dmx_admin_token");
    localStorage.removeItem("dmx_admin_role");
    router.replace("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) return null;

  const sidebarLinks = ALL_LINKS.filter((l) => l.roles.includes(role));
  const lockedLinks = ALL_LINKS.filter((l) => !l.roles.includes(role));

  return (
    <div className="h-screen flex bg-bg-primary overflow-hidden -mt-16">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border-default bg-bg-secondary flex flex-col">
        <div className="p-6 border-b border-border-default">
          <Link href="/">
            <DMXLogo className="h-7 w-auto" />
          </Link>
          <p className="text-xs text-text-secondary mt-2 font-mono">
            {role === "events" ? "Events Admin" : "Admin Panel"}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Accessible links */}
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
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-surface",
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}

          {/* Locked links — shown but non-clickable for events role */}
          {lockedLinks.length > 0 && role === "events" && (
            <>
              <div className="pt-3 pb-1 px-4">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Restricted</p>
              </div>
              {lockedLinks.map((link) => (
                <div
                  key={link.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-text-muted opacity-40 cursor-not-allowed select-none"
                  title="Super admin access required"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  <Lock className="w-3 h-3 ml-auto" />
                </div>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border-default space-y-2">
          <div className="px-4 py-2 flex items-center justify-between text-sm text-text-secondary">
            <span>Theme</span>
            <ThemeToggle />
          </div>
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
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
