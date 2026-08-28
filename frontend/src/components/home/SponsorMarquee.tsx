"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Sponsor } from "@/types";

const TIER_CONFIG: Record<
  Sponsor["tier"],
  {
    label: string;
    order: number;
    logoSize: string;
    cardBorder: string;
    labelStyle: string;
  }
> = {
  title: {
    label: "Title Sponsor",
    order: 0,
    logoSize: "h-20 md:h-24 px-8",
    cardBorder: "border-brand-teal/50 shadow-[0_0_16px_rgba(52,217,166,0.15)]",
    labelStyle: "text-text-muted border-transparent bg-transparent",
  },
  gold: {
    label: "Gold Sponsor",
    order: 1,
    logoSize: "h-14 md:h-16 px-5",
    cardBorder: "border-border-default/80",
    labelStyle: "text-text-muted border-transparent bg-transparent",
  },
  silver: {
    label: "Silver Sponsor",
    order: 2,
    logoSize: "h-14 md:h-16 px-5",
    cardBorder: "border-border-default/50",
    labelStyle: "text-text-muted border-transparent bg-transparent",
  },
  community: {
    label: "Community Partner",
    order: 3,
    logoSize: "h-9 md:h-10 px-3",
    cardBorder: "border-border-default/30",
    labelStyle: "text-text-muted border-transparent bg-transparent",
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
    <div className="flex flex-col items-center gap-1.5 group shrink-0">
      <div
        className={`flex items-center justify-center bg-white rounded-xl border ${config.cardBorder} ${config.logoSize} grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300`}
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
        className={`text-[9px] font-semibold uppercase tracking-widest px-2 py-px rounded-full border ${config.labelStyle} opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}
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
  const goldSilverSponsors = sponsors.filter(
    (s) => s.tier === "gold" || s.tier === "silver",
  );
  const communitySponsors = sponsors.filter((s) => s.tier === "community");

  const goldSilverItems =
    goldSilverSponsors.length > 3
      ? [...goldSilverSponsors, ...goldSilverSponsors, ...goldSilverSponsors]
      : goldSilverSponsors;

  const communityItems =
    communitySponsors.length > 3
      ? [...communitySponsors, ...communitySponsors, ...communitySponsors]
      : communitySponsors;

  return (
    <section className="py-8 overflow-hidden">
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

      {/* Tier divider line for Gold & Silver */}
      {titleSponsors.length > 0 && goldSilverSponsors.length > 0 && (
        <div className="max-w-xs mx-auto mb-10 flex items-center gap-3 px-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border-subtle" />
          <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium whitespace-nowrap">
            Gold &amp; Silver
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border-subtle" />
        </div>
      )}

      {/* Gold + Silver — marquee scroll */}
      {goldSilverSponsors.length > 0 && (
        <div
          className="relative flex overflow-x-hidden group mb-10"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          {goldSilverSponsors.length <= 3 ? (
            <div className="flex items-center justify-center gap-8 md:gap-12 px-8 w-full flex-wrap">
              {goldSilverSponsors.map((s) => (
                <SponsorCard key={s.id} sponsor={s} />
              ))}
            </div>
          ) : (
            <div className="animate-marquee flex items-center gap-8 md:gap-12 px-8 w-max group-hover:[animation-play-state:paused]">
              {goldSilverItems.map((s, idx) => (
                <SponsorCard key={`${s.id}-${idx}`} sponsor={s} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tier divider line for Community Partners */}
      {(titleSponsors.length > 0 || goldSilverSponsors.length > 0) &&
        communitySponsors.length > 0 && (
          <div className="max-w-xs mx-auto mb-10 flex items-center gap-3 px-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border-subtle" />
            <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium whitespace-nowrap">
              Community Partners
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border-subtle" />
          </div>
        )}

      {/* Community Partners — marquee scroll */}
      {communitySponsors.length > 0 && (
        <div
          className="relative flex overflow-x-hidden group"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          {communitySponsors.length <= 3 ? (
            <div className="flex items-center justify-center gap-8 md:gap-12 px-8 w-full flex-wrap">
              {communitySponsors.map((s) => (
                <SponsorCard key={s.id} sponsor={s} />
              ))}
            </div>
          ) : (
            <div
              className="animate-marquee flex items-center gap-8 md:gap-12 px-8 w-max group-hover:[animation-play-state:paused]"
              style={{ animationDirection: "reverse" }}
            >
              {communityItems.map((s, idx) => (
                <SponsorCard key={`${s.id}-${idx}`} sponsor={s} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
