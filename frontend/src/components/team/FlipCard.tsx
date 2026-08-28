"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Maximize2 } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { TeamMember } from "@/types";

interface MemberCardProps {
  member: TeamMember;
  index: number;
  onImageClick?: () => void;
}
export function FlipCard({ member, index, onImageClick }: MemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getSocialIcon = (url: string) => {
    if (url.includes("github.com")) return <FaGithub className="w-4 h-4" />;
    if (url.includes("linkedin.com")) return <FaLinkedin className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  // Filter out empty values
  const visibleSocials = member.social_links
    ? Object.entries(member.social_links)
        .filter(([, url]) => url && (url as string).trim() !== "")
    : [];

  return (
    <motion.div
      className="relative w-full h-[400px] select-none"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: isHovered ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* ── Front ── */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] glass-card border border-border-default transition-all duration-300 rounded-xl overflow-hidden shadow-lg">
          {member.photo_url ? (
            <Image src={member.photo_url} alt={member.name} fill className="absolute inset-0 w-full h-full object-cover pointer-events-none" sizes="(max-width: 768px) 100vw, 33vw" draggable={false} />
          ) : (
            <div className="absolute inset-0 bg-brand-navy/10 flex items-center justify-center text-6xl font-display font-bold text-brand-teal/40">
              {member.name.charAt(0)}
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Name & Role */}
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-end text-center z-10 pb-8 pointer-events-none">
            <h3 className="text-2xl font-bold text-white mb-1 tracking-wide">{member.name}</h3>
            <p className="text-brand-teal-light text-sm font-semibold">{member.role}</p>
          </div>
        </div>

        {/* ── Back ── */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] glass-card flex flex-col items-center text-center border border-border-default transition-all duration-300 rounded-xl bg-bg-secondary/95 backdrop-blur-xl shadow-lg overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center w-full p-6">
            <h3 className="text-xl font-bold text-text-primary mb-1">{member.name}</h3>
            <p className="text-brand-teal-light text-sm font-semibold mb-4">{member.role}</p>
            
            {member.year && (
              <p className="text-xs text-text-muted uppercase tracking-widest border-b border-border-subtle pb-4 mb-4 w-full">
                {member.year} Year
              </p>
            )}
            
            {member.fun_fact ? (
              <div className="mb-4 relative w-full px-4">
                <span className="text-brand-teal/20 absolute -top-4 -left-0 text-4xl font-serif">&ldquo;</span>
                <p className="text-sm text-text-secondary italic line-clamp-4 relative z-10 leading-relaxed">
                  {member.fun_fact}
                </p>
                <span className="text-brand-teal/20 absolute -bottom-6 -right-0 text-4xl font-serif">&rdquo;</span>
              </div>
            ) : (
              <p className="text-sm text-text-muted italic mb-4 mt-2">No fun fact provided.</p>
            )}
          </div>

          {/* Bottom bar: socials + view image */}
          <div className="w-full border-t border-border-subtle px-6 py-4 flex items-center justify-between gap-3">
            {/* Social links */}
            <div className="flex items-center gap-2">
              {visibleSocials.map(([key, url]) => (
                <Link
                  key={key}
                  href={url as string}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="p-2.5 bg-bg-surface hover:bg-brand-navy hover:text-brand-teal rounded-full text-text-secondary transition-all hover:scale-110 border border-border-subtle"
                >
                  {getSocialIcon(url as string)}
                </Link>
              ))}
            </div>

            {/* View image button */}
            {member.photo_url && onImageClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="p-2.5 bg-bg-surface hover:bg-brand-teal/20 hover:text-brand-teal rounded-full text-text-secondary transition-all hover:scale-110 border border-border-subtle"
                aria-label="View full image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
