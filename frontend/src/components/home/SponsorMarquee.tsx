"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { Sponsor } from "@/types";

export function SponsorMarquee() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    async function loadSponsors() {
      try {
        const data = await api.sponsors.list();
        setSponsors(data);
      } catch (e) {
        console.error("Failed to load sponsors", e);
      }
    }
    loadSponsors();
  }, []);

  if (sponsors.length === 0) return null;

  // Duplicate for seamless infinite scrolling
  const marqueeItems = [...sponsors, ...sponsors, ...sponsors];

  return (
    <section className="py-20 border-t border-border-subtle overflow-hidden bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
          Supported By
        </h3>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        {sponsors.length > 2 && (
          <div className="absolute top-0 left-0 h-full w-24 md:w-48 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        )}
        
        {sponsors.length <= 2 ? (
          <div className="flex items-center justify-center gap-16 md:gap-24 px-8 md:px-12 w-full">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                <span className="text-xl md:text-2xl font-bold font-display text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-marquee flex items-center gap-16 md:gap-24 px-8 md:px-12 w-max">
            {marqueeItems.map((sponsor, idx) => (
              <div key={`${sponsor.id}-${idx}`} className="flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                <span className="text-xl md:text-2xl font-bold font-display text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {sponsors.length > 2 && (
          <div className="absolute top-0 right-0 h-full w-24 md:w-48 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />
        )}
      </div>
    </section>
  );
}
