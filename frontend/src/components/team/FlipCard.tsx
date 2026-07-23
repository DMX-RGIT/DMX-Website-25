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
    if (url.includes("github.com")) return <FaGithub className="w-4 h-4" />;
    if (url.includes("linkedin.com")) return <FaLinkedin className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <motion.div
      className="group relative w-full h-full glass-card p-6 flex flex-col items-center text-center border border-border-default hover:border-brand-teal/30 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
    >
      {member.photo_url ? (
        <div className="w-full h-48 mb-6 overflow-hidden rounded-lg">
          <img 
            src={member.photo_url} 
            alt={member.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
      ) : (
        <div className="w-24 h-24 rounded-2xl bg-brand-navy/10 border border-brand-teal/20 flex items-center justify-center mb-6 text-4xl font-display font-bold text-brand-teal group-hover:scale-110 transition-transform shadow-inner">
          {member.name.charAt(0)}
        </div>
      )}
      
      <h3 className="text-xl font-bold text-text-primary mb-1 group-hover:text-brand-teal transition-colors">{member.name}</h3>
      <p className="text-brand-teal-light text-sm font-semibold mb-2">{member.role}</p>
      
      {member.year && (
        <p className="text-xs text-text-muted mb-4 uppercase tracking-widest">
          {member.year} Year
        </p>
      )}

      {member.fun_fact && (
        <div className="mt-2 mb-6">
          <p className="text-sm text-text-secondary italic line-clamp-3 relative">
            <span className="text-brand-teal opacity-50 absolute -top-2 -left-2 text-2xl">"</span>
            {member.fun_fact}
            <span className="text-brand-teal opacity-50 absolute -bottom-4 -right-2 text-2xl">"</span>
          </p>
        </div>
      )}

      {member.social_links && Object.keys(member.social_links).length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-auto pt-4 w-full border-t border-border-subtle">
          {Object.entries(member.social_links).map(([key, url]) => {
            // Skip twitter/X as requested
            if ((url as string).includes("twitter.com") || (url as string).includes("x.com")) return null;
            return (
              <a
                key={key}
                href={url as string}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-bg-surface hover:bg-brand-navy/20 hover:text-brand-teal rounded-full text-text-secondary transition-colors"
              >
                {getSocialIcon(url as string)}
              </a>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
