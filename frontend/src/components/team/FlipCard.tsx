"use client";

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
  const getSocialIcon = (url: string) => {
    if (url.includes("github.com")) return <FaGithub className="w-5 h-5" />;
    if (url.includes("linkedin.com")) return <FaLinkedin className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  return (
    <motion.div
      className="group relative w-full h-[400px]"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
    >
      <div 
        className="w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] glass-card border border-border-default hover:border-brand-teal/30 transition-all duration-300 rounded-xl overflow-hidden shadow-lg">
          {member.photo_url ? (
            <img 
              src={member.photo_url} 
              alt={member.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="absolute inset-0 bg-brand-navy/10 flex items-center justify-center text-6xl font-display font-bold text-brand-teal/40">
              {member.name.charAt(0)}
            </div>
          )}
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-end text-center z-10 pb-10">
            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-brand-teal transition-colors tracking-wide">{member.name}</h3>
            <p className="text-brand-teal-light text-sm font-semibold mb-5">{member.role}</p>
            
            {member.photo_url && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (onImageClick) onImageClick();
                }}
                className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-brand-teal/80 transition-all duration-300 hover:scale-110 shadow-lg border border-white/10"
                aria-label="View Image"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] glass-card p-6 flex flex-col items-center text-center border border-border-default hover:border-brand-teal/30 transition-all duration-300 rounded-xl bg-bg-secondary/95 backdrop-blur-xl shadow-lg">
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <h3 className="text-xl font-bold text-text-primary mb-1">{member.name}</h3>
            <p className="text-brand-teal-light text-sm font-semibold mb-4">{member.role}</p>
            
            {member.year && (
              <p className="text-xs text-text-muted uppercase tracking-widest border-b border-border-subtle pb-4 mb-4 w-full">
                {member.year} Year
              </p>
            )}
            
            {member.fun_fact ? (
              <div className="mb-6 relative w-full px-4">
                <span className="text-brand-teal/20 absolute -top-4 -left-0 text-4xl font-serif">"</span>
                <p className="text-sm text-text-secondary italic line-clamp-5 relative z-10 leading-relaxed">
                  {member.fun_fact}
                </p>
                <span className="text-brand-teal/20 absolute -bottom-6 -right-0 text-4xl font-serif">"</span>
              </div>
            ) : (
              <p className="text-sm text-text-muted italic mb-6 mt-4">No fun fact provided.</p>
            )}
          </div>

          {member.social_links && Object.keys(member.social_links).length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-auto pt-4 w-full border-t border-border-subtle relative z-10">
              {Object.entries(member.social_links).map(([key, url]) => {
                if ((url as string).includes("twitter.com") || (url as string).includes("x.com")) return null;
                return (
                  <a
                    key={key}
                    href={url as string}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-bg-surface hover:bg-brand-navy hover:text-brand-teal rounded-full text-text-secondary transition-all transform hover:scale-110 border border-border-subtle"
                  >
                    {getSocialIcon(url as string)}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
