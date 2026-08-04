"use client";

import { useEffect, useState } from "react";
import { Maximize2 } from "lucide-react";
import { TeamMember, GalleryImage } from "@/types";
import { api } from "@/lib/api";
import { FlipCard } from "@/components/team/FlipCard";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { FilterPills } from "@/components/shared/FilterPills";
import { Lightbox } from "@/components/gallery/Lightbox";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { cn } from "@/lib/utils";

type TeamFilter = "all" | "core" | "lead" | "member";
type TeamTab = "current" | "alumni";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TeamFilter>("all");
  const [tab, setTab] = useState<TeamTab>("current");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [teamPhotoUrl, setTeamPhotoUrl] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    async function fetchTeamAndContent() {
      try {
        const [teamData, contentData] = await Promise.all([
          api.team.list(),
          api.stats.get().catch(() => ({})),
        ]);
        setMembers(teamData);
        if (contentData?.team_photo_url) {
          setTeamPhotoUrl(contentData.team_photo_url);
        }
      } catch (error) {
        console.error("Failed to fetch team data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamAndContent();
  }, []);

  const filterOptions = [
    { label: "Everyone", value: "all" as TeamFilter },
    { label: "Core Committee", value: "core" as TeamFilter },
    { label: "Domain Leads", value: "lead" as TeamFilter },
    { label: "Members", value: "member" as TeamFilter },
  ];

  // Separate current and alumni members
  const currentMembers = members.filter(m => !m.is_alumni);
  const alumniMembers = members.filter(m => m.is_alumni);

  // Get unique batch years for alumni, sorted descending
  const batchYears = [...new Set(alumniMembers.map(m => m.batch_year).filter(Boolean))].sort().reverse() as string[];
  const activeYear = selectedYear || (batchYears.length > 0 ? batchYears[0] : "");

  // Apply tier filter
  const activeMembers = tab === "current" ? currentMembers : alumniMembers.filter(m => m.batch_year === activeYear);
  const filtered = filter === "all" ? activeMembers : activeMembers.filter(m => m.tier === filter);

  const hasAlumni = alumniMembers.length > 0;

  const renderGroup = (list: TeamMember[], title: string) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-16">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-6 text-center">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {list.map((member, idx) => (
            <FlipCard key={member.id} member={member} index={idx} onImageClick={() => setSelectedMemberId(member.id)} />
          ))}
        </div>
      </div>
    );
  };

  const renderCurrentContent = () => {
    if (filter === "all") {
      const core = filtered.filter(m => m.tier === "core");
      const leads = filtered.filter(m => m.tier === "lead");
      const other = filtered.filter(m => m.tier === "member");
      return (
        <div className="space-y-8">
          {renderGroup(core, "Core Committee")}
          {renderGroup(leads, "Domain Leads")}
          {renderGroup(other, "Members")}
          
          {teamPhotoUrl && (
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-display font-bold text-text-primary mb-6 text-center">The DMX Team</h2>
              <div 
                className="w-full max-w-[90vw] mx-auto h-[40vh] sm:h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden border border-border-default shadow-xl relative cursor-pointer group"
                onClick={() => setSelectedMemberId("team-photo")}
              >
                <img 
                  src={teamPhotoUrl} 
                  alt="DMX Team" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-bg-primary/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                  <span className="px-6 py-3 bg-brand-navy/80 backdrop-blur-md border border-brand-navy-light/30 rounded-full text-white text-sm font-semibold flex items-center gap-2">
                    <Maximize2 className="w-4 h-4" /> View Full Photo
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((member, idx) => (
          <FlipCard key={member.id} member={member} index={idx} onImageClick={() => setSelectedMemberId(member.id)} />
        ))}
      </div>
    );
  };

  const renderAlumniContent = () => {
    if (filter === "all") {
      const core = filtered.filter(m => m.tier === "core");
      const leads = filtered.filter(m => m.tier === "lead");
      const other = filtered.filter(m => m.tier === "member");
      return (
        <div className="space-y-8">
          {renderGroup(core, "Core Committee")}
          {renderGroup(leads, "Domain Leads")}
          {renderGroup(other, "Members")}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((member, idx) => (
          <FlipCard key={member.id} member={member} index={idx} onImageClick={() => setSelectedMemberId(member.id)} />
        ))}
      </div>
    );
  };

  // Prepare images for lightbox
  const lightboxImages: GalleryImage[] = filtered
    .filter(m => m.photo_url)
    .map(m => ({
      id: m.id,
      image_url: m.photo_url as string,
      caption: `${m.name} - ${m.role}`,
      category: "social",
      event_id: null,
      created_at: m.created_at,
    }));

  if (teamPhotoUrl) {
    lightboxImages.push({
      id: "team-photo",
      image_url: teamPhotoUrl,
      caption: "The DMX Team",
      category: "social",
      event_id: null,
      created_at: new Date().toISOString(),
    });
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4 text-center">
          The Team
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto text-center mb-12">
          Meet the researchers, developers, and designers driving DMX forward.
        </p>

        <SectionDivider />

        {/* Current / Alumni Tabs */}
        {hasAlumni && (
          <div className="flex items-center justify-center mt-10 mb-8">
            <div className="flex items-center gap-1 p-1 rounded-full bg-bg-surface border border-border-default">
              <button
                onClick={() => { setTab("current"); setFilter("all"); }}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                  tab === "current" 
                    ? "bg-bg-primary text-text-primary shadow-sm border border-brand-navy-light shadow-[0_0_10px_rgba(30,58,138,0.2)]" 
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                Current Year
              </button>
              <button
                onClick={() => { setTab("alumni"); setFilter("all"); }}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                  tab === "alumni" 
                    ? "bg-bg-primary text-text-primary shadow-sm border border-brand-navy-light shadow-[0_0_10px_rgba(30,58,138,0.2)]" 
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                Alumni
              </button>
            </div>
          </div>
        )}

        <div className={hasAlumni ? "mt-4 mb-8" : "mt-12 mb-10"}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <FilterPills
              options={filterOptions}
              value={filter}
              onChange={setFilter}
            />
            {tab === "alumni" && batchYears.length > 0 && (
              <div className="w-48">
                <CustomSelect
                  value={activeYear}
                  onChange={setSelectedYear}
                  options={batchYears.map(year => ({ label: `Batch ${year}`, value: year }))}
                  className="h-10 text-sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-bg-surface animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {tab === "alumni" ? "No alumni records yet" : "No members found"}
              </h3>
              <p className="text-text-secondary">
                {tab === "alumni" ? "Past team members can be added from the admin panel." : "Try selecting a different filter."}
              </p>
            </div>
          ) : tab === "current" ? (
            renderCurrentContent()
          ) : (
            renderAlumniContent()
          )}
        </div>
      </div>

      <Lightbox 
        images={lightboxImages}
        initialIndex={lightboxImages.findIndex(img => img.id === selectedMemberId)} 
        isOpen={!!selectedMemberId}
        onClose={() => setSelectedMemberId(null)} 
      />
    </div>
  );
}
