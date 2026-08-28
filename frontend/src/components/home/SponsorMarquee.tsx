"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Sponsor } from "@/types";

const TIER_CONFIG: Record<
  Sponsor["tier"],
  { label: string; order: number; logoSize: string; badgeStyle: string }
> = {
  title: {
    label: "Title Sponsor",
    order: 0,
    logoSize: "h-20 md:h-24 px-8",
    badgeStyle: "text-brand-teal border-brand-teal/40 bg-brand-teal/10",
  },
  gold: {
    label: "Gold Sponsor",
    order: 1,
    logoSize: "h-14 md:h-16 px-5",
    badgeStyle: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  },
  silver: {
    label: "Silver Sponsor",
    order: 2,
    logoSize: "h-11 md:h-12 px-4",
    badgeStyle: "text-slate-300 border-slate-300/40 bg-slate-300/10",
  },
  community: {
    label: "Community Partner",
    order: 3,
    logoSize: "h-9 md:h-10 px-3",
    badgeStyle: "text-text-secondary border-border-default bg-bg-surface",
  },
};

function sortSponsors(sponsors: Sponsor[]) {
  return [...sponsors].sort((a, b) => {
    const tierDiff = TIER_CONFIG[a.tier].order - TIER_CONFIG[b.tier].order;
    if (tierDiff !== 0) return tierDiff;
    return a.display_order - b.display_order;
  });
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const config = TIER_CONFIG[sponsor.tier];
  if (!sponsor.logo_url) return null;

  const card = (
    <div className="flex flex-col items-center gap-2 group shrink-0">
      <div
        className={`flex items-center justify-center bg-white rounded-xl border border-border-default/60 ${config.logoSize} grayscale group-hover:grayscale-0 opacity-75 group-hover:opacity-100 transition-all duration-300 shadow-sm`}
      >
        <Image
          src={sponsor.logo_url}
          alt={sponsor.name}
          width={200}
          height={80}
          className="max-h-full max-w-[180px] w-auto h-auto object-contain"
          unoptimized
        />
      </div>
      <span
        className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${config.badgeStyle} transition-opacity opacity-0 group-hover:opacity-100`}
      >
        {config.label}
      </span>
    </div>
  );

  if (!sponsor.website_url) return card;

  return (
    <Link
      href={sponsor.website_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`Visit ${sponsor.name} — ${config.label}`}
    >
      {card}
    </Link>
  );
}

export function SponsorMarquee() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    api.sponsors
      .list({ active_only: "true" })
      .then((data) => setSponsors(sortSponsors(data)))
      .catch(console.error);
  }, []);

  if (sponsors.length === 0) return null;

  const titleSponsors = sponsors.filter((s) => s.tier === "title");
  const goldSponsors = sponsors.filter((s) => s.tier === "gold");
  const silverSponsors = sponsors.filter((s) => s.tier === "silver");
  const communitySponsors = sponsors.filter((s) => s.tier === "community");

  const marqueeSponsors = [...goldSponsors, ...silverSponsors, ...communitySponsors];
  const marqueeItems =
    marqueeSponsors.length > 3
      ? [...marqueeSponsors, ...marqueeSponsors, ...marqueeSponsors]
      : marqueeSponsors;

  return (
    <section className="py-16 border-t border-border-subtle overflow-hidden bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Supported By
        </h3>
      </div>

      {/* Title sponsors — large, centered, labeled */}
      {titleSponsors.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mb-10 flex flex-wrap items-end justify-center gap-8">
          {titleSponsors.map((s) => (
            <SponsorCard key={s.id} sponsor={s} />
          ))}
        </div>
      )}

      {/* Tier divider line if we have both title and others */}
      {titleSponsors.length > 0 && marqueeSponsors.length > 0 && (
        <div className="max-w-xs mx-auto mb-10 flex items-center gap-3 px-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border-subtle" />
          <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium">Gold &amp; Silver</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border-subtle" />
        </div>
      )}

      {/* Gold + Silver + Community — marquee scroll */}
      {marqueeSponsors.length > 0 && (
        <div className="relative flex overflow-x-hidden group">
          <div className="absolute top-0 left-0 h-full w-16 md:w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />

          {marqueeSponsors.length <= 3 ? (
            <div className="flex items-center justify-center gap-8 md:gap-12 px-8 w-full flex-wrap">
              {marqueeSponsors.map((s) => (
                <SponsorCard key={s.id} sponsor={s} />
              ))}
            </div>
          ) : (
            <div className="animate-marquee flex items-center gap-8 md:gap-12 px-8 w-max group-hover:[animation-play-state:paused]">
              {marqueeItems.map((s, idx) => (
                <SponsorCard key={`${s.id}-${idx}`} sponsor={s} />
              ))}
            </div>
          )}

          <div className="absolute top-0 right-0 h-full w-16 md:w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />
        </div>
      )}
    </section>
  );
}
