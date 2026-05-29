"use client";

import Link from "next/link";
import { ArrowRight, Calendar, FolderOpen, Image as ImageIcon, Users, Activity, Database, Server } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Events", value: "Active", icon: Calendar, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Projects", value: "Online", icon: FolderOpen, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Database", value: "Connected", icon: Database, color: "text-dmx-primary", bg: "bg-dmx-primary/10" },
    { label: "System", value: "Healthy", icon: Server, color: "text-dmx-secondary", bg: "bg-dmx-secondary/10" },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 md:p-6 flex items-center gap-4 shadow-sm hover:border-white/10 transition-colors">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-400 font-medium">{stat.label}</p>
              <p className="text-lg md:text-xl font-bold text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="text-dmx-primary" size={24} />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { title: "Manage Events", desc: "Create, update, or remove hackathons and workshops.", link: "/admin/events", icon: Calendar },
            { title: "Manage Projects", desc: "Showcase student innovations and repositories.", link: "/admin/projects", icon: FolderOpen },
            { title: "Manage Gallery", desc: "Upload and organize event photographs.", link: "/admin/gallery", icon: ImageIcon },
            { title: "Manage Team", desc: "Update core committee and alumni members.", link: "/admin/team", icon: Users },
          ].map((module, index) => (
            <Link 
              key={index} 
              href={module.link}
              className="group bg-slate-900/50 border border-white/5 hover:border-dmx-primary/50 hover:bg-white/[0.02] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden h-[200px]"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:translate-x-2 duration-500">
                <module.icon size={100} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-dmx-primary/20 group-hover:text-dmx-primary transition-colors">
                  <module.icon size={24} />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">
                  {module.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{module.desc}</p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-sm text-dmx-primary font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Open Module <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Block */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/30 border border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-dmx-primary/20 blur-[100px] rounded-full point-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-dmx-secondary/10 blur-[100px] rounded-full point-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dmx-primary/10 text-dmx-primary text-sm font-semibold mb-6 border border-dmx-primary/20">
            <Database size={16} /> Data Architecture
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Welcome to the DMX CMS</h2>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6">
            This dashboard utilizes an advanced, real-time database architecture backed by Supabase. 
            All modifications to events, projects, and the gallery are synchronized instantly across the global CDN, ensuring users always see the latest content.
          </p>
          <div className="bg-black/30 border border-white/5 rounded-xl p-4 md:p-6 flex items-start gap-4">
             <div className="p-2 bg-dmx-accent/10 text-dmx-accent rounded-lg shrink-0 mt-1">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
             </div>
             <div>
                <h4 className="text-white font-medium mb-1">Configuration Required</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Before onboarding new administrators, ensure strict access control by updating the explicitly allowed admin emails in the <code>ADMIN_EMAILS</code> environment variable. Use strong authentication protocols for operational security.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
