"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DMXLogo } from "@/components/layout/DMXLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CalendarDays, LogOut } from "lucide-react";

export default function EventsAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/events-admin/login") {
      setChecking(false);
      setAuthed(true);
      return;
    }

    const token = localStorage.getItem("dmx_events_admin_token");
    if (!token) {
      router.replace("/events-admin/login");
      return;
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.role !== "events" && data.role !== "superadmin") throw new Error("Forbidden");
        setAuthed(true);
      })
      .catch(() => {
        localStorage.removeItem("dmx_events_admin_token");
        router.replace("/events-admin/login");
      })
      .finally(() => setChecking(false));
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("dmx_events_admin_token");
    router.replace("/events-admin/login");
  };

  if (pathname === "/events-admin/login") return <>{children}</>;

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-bg-primary -mt-16">
      {/* Top bar */}
      <header className="border-b border-border-default bg-bg-secondary px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DMXLogo className="h-7 w-auto" />
          <div className="h-5 w-px bg-border-default" />
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-teal">
            <CalendarDays className="w-4 h-4" />
            Events Admin Panel
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
