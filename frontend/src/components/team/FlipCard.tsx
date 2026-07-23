"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { TeamMember } from "@/types";

interface MemberCardProps {
  member: TeamMember;
  index: number;
}

export function FlipCard({ member, index }: MemberCardProps) {
  const getSocialIcon = (url: string) => {
    if (url.includes("github.com")) return <FaGithub className="w-5 h-5" />;
    if (url.includes("linkedin.com")) return <FaLinkedin className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  return (
    <motion.div
      className="group relative w-full h-[380px]"
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
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] glass-card p-6 flex flex-col items-center text-center border border-border-default hover:border-brand-teal/30 transition-all duration-300 rounded-xl">
          {member.photo_url ? (
            <a 
              href={member.photo_url} 
              target="_blank" 
              rel="noreferrer" 
              className="w-full h-48 mb-6 overflow-hidden rounded-lg cursor-pointer block relative z-10 group/img"
            >
              <img 
                src={member.photo_url} 
                alt={member.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" 
              />
            </a>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-brand-navy/10 border border-brand-teal/20 flex items-center justify-center mb-6 text-4xl font-display font-bold text-brand-teal shadow-inner">
              {member.name.charAt(0)}
            </div>
          )}
          
          <h3 className="text-xl font-bold text-text-primary mb-1 mt-auto group-hover:text-brand-teal transition-colors">{member.name}</h3>
          <p className="text-brand-teal-light text-sm font-semibold mb-2">{member.role}</p>
          
          {member.year && (
            <p className="text-xs text-text-muted uppercase tracking-widest">
              {member.year} Year
            </p>
          )}
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] glass-card p-6 flex flex-col items-center text-center border border-border-default hover:border-brand-teal/30 transition-all duration-300 rounded-xl">
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <h3 className="text-xl font-bold text-text-primary mb-1">{member.name}</h3>
            <p className="text-brand-teal-light text-sm font-semibold mb-6">{member.role}</p>
            
            {member.fun_fact ? (
              <div className="mb-6 relative w-full px-4">
                <span className="text-brand-teal opacity-50 absolute -top-4 -left-0 text-4xl font-serif">"</span>
                <p className="text-sm text-text-secondary italic line-clamp-5 relative z-10">
                  {member.fun_fact}
                </p>
                <span className="text-brand-teal opacity-50 absolute -bottom-6 -right-0 text-4xl font-serif">"</span>
              </div>
            ) : (
              <p className="text-sm text-text-muted italic mb-6">No fun fact provided.</p>
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
                    className="p-3 bg-bg-secondary hover:bg-brand-navy hover:text-brand-teal rounded-full text-text-secondary transition-all transform hover:scale-110"
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
