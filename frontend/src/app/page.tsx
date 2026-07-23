import { HeroSection } from "@/components/hero/HeroSection";
import { ImpactStats } from "@/components/home/ImpactStats";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { FeaturedEvent } from "@/components/home/FeaturedEvent";
import { SponsorMarquee } from "@/components/home/SponsorMarquee";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { ContainerScroll } from "@/components/home/ContainerScroll";
import { TerminalMockup } from "@/components/home/TerminalMockup";
import { Testimonials } from "@/components/home/Testimonials";
import { TechMarquee } from "@/components/home/TechMarquee";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      
      <div className="py-12">
        <ImpactStats />
      </div>
      
      <SectionDivider />
      
      {/* 3D Tablet with Terminal Mockup */}
      <div className="overflow-hidden">
        <ContainerScroll 
          titleComponent={
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-text-primary to-text-secondary">
              Built by Engineers, <br />
              <span className="text-brand-teal text-3xl md:text-5xl mt-2 block">
                For Engineers
              </span>
            </h2>
          }
        >
          <TerminalMockup />
        </ContainerScroll>
      </div>
      
      <SectionDivider />
      
      {/* What We Do — Full Width Zig-Zag */}
      <WhatWeDo />
      
      <SectionDivider />
      
      {/* Tech Stack Marquee */}
      <TechMarquee />
      
      <SectionDivider />
      
      {/* Featured Event */}
      <div className="py-20">
        <FeaturedEvent />
      </div>
      
      <SectionDivider />
      
      {/* Testimonials */}
      <Testimonials />

      {/* Sponsors */}
      <div className="py-20 border-t border-border-subtle bg-bg-secondary/50">
        <SponsorMarquee />
      </div>
    </div>
  );
}
