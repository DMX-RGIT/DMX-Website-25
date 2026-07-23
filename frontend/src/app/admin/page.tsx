"use client";

import { CalendarDays, FolderKanban, Users, Image, Handshake } from "lucide-react";
import Link from "next/link";

const sections = [
  { href: "/admin/events", label: "Events", icon: CalendarDays, count: "Manage hackathons, workshops, and sessions" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, count: "Add and update research projects" },
  { href: "/admin/team", label: "Team", icon: Users, count: "Manage committee members" },
  { href: "/admin/gallery", label: "Gallery", icon: Image, count: "Upload and organize photos" },
  { href: "/admin/sponsors", label: "Sponsors", icon: Handshake, count: "Manage sponsor logos and links" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Dashboard</h1>
      <p className="text-text-secondary mb-8">Welcome to the DMX admin panel. Manage all website content from here.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group p-6 rounded-xl border border-border-default bg-bg-secondary hover:border-brand-navy-light transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-navy/10 border border-brand-navy-light/20 flex items-center justify-center group-hover:bg-brand-navy/20 transition-colors">
                <section.icon className="w-5 h-5 text-brand-teal" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">{section.label}</h2>
            </div>
            <p className="text-sm text-text-secondary">{section.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
