"use client";

import { useEffect, useState } from "react";
import { TeamMember, GalleryImage } from "@/types";
import { api } from "@/lib/api";
import { FlipCard } from "@/components/team/FlipCard";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { FilterPills } from "@/components/shared/FilterPills";
import { Lightbox } from "@/components/gallery/Lightbox";

type TeamFilter = "all" | "core" | "lead" | "member";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TeamFilter>("all");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const data = await api.team.list();
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch team", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  const filterOptions = [
    { label: "Everyone", value: "all" as TeamFilter },
    { label: "Core Committee", value: "core" as TeamFilter },
    { label: "Domain Leads", value: "lead" as TeamFilter },
    { label: "Members", value: "member" as TeamFilter },
  ];

  const filtered = filter === "all" ? members : members.filter(m => m.tier === filter);

  const renderGroup = (list: TeamMember[], title: string) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-20">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {list.map((member, idx) => (
            <FlipCard key={member.id} member={member} index={idx} onImageClick={() => setSelectedMemberId(member.id)} />
          ))}
        </div>
      </div>
    );
  };

  // When filtering by "all", show grouped. Otherwise show flat.
  const renderContent = () => {
    if (filter === "all") {
      const core = filtered.filter(m => m.tier === "core");
      const leads = filtered.filter(m => m.tier === "lead");
      const other = filtered.filter(m => m.tier === "member");
      return (
        <>
          {renderGroup(core, "Core Committee")}
          {renderGroup(leads, "Domain Leads")}
          {renderGroup(other, "Members")}
        </>
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

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">
            The Team
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Meet the researchers, developers, and designers driving DMX forward.
          </p>
        </div>

        <SectionDivider />

        <div className="mt-12 mb-10">
          <FilterPills
            options={filterOptions}
            value={filter}
            onChange={setFilter}
          />
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-bg-surface animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32">
              <h3 className="text-xl font-bold text-text-primary mb-2">No members found</h3>
              <p className="text-text-secondary">Try selecting a different filter.</p>
            </div>
          ) : (
            renderContent()
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
