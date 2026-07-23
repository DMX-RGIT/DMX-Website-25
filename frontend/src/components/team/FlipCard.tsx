"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { TeamMember } from "@/types";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  member: TeamMember;
  index: number;
}

export function FlipCard({ member, index }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const getSocialIcon = (url: string) => {
    if (url.includes("github.com")) return <FaGithub className="w-4 h-4" />;
    if (url.includes("linkedin.com")) return <FaLinkedin className="w-4 h-4" />;
    if (url.includes("twitter.com") || url.includes("x.com")) return <FaXTwitter className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className="group relative w-full aspect-[3/4] perspective-1000 cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className={cn(
          "w-full h-full transition-all duration-500 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Spotlight Effect */}
        <div
          className="absolute inset-0 pointer-events-none z-10 preserve-3d"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(52, 217, 166, 0.1), transparent 40%)`,
          }}
        />

        {/* Front */}
        <div className="absolute inset-0 backface-hidden w-full h-full glass-card overflow-hidden">
          {member.photo_url ? (
            <img 
              src={member.photo_url} 
              alt={member.name} 
              className="w-full h-full object-cover grayscale opacity-80"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-navy/20 to-brand-teal/20" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-xl font-bold text-text-primary mb-1">{member.name}</h3>
            <p className="text-brand-teal text-sm font-semibold">{member.role}</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden w-full h-full glass-card p-6 rotate-y-180 flex flex-col justify-center items-center text-center border-brand-teal/30">
          <h3 className="text-xl font-bold text-text-primary mb-2">{member.name}</h3>
          <p className="text-brand-teal text-sm font-semibold mb-6">{member.role}</p>
          
          {member.fun_fact && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-2 font-semibold">Fun Fact</p>
              <p className="text-sm text-text-secondary italic">&quot;{member.fun_fact}&quot;</p>
            </div>
          )}

          {member.social_links && Object.keys(member.social_links).length > 0 && (
            <div className="flex items-center gap-3 mt-auto">
              {Object.entries(member.social_links).map(([key, url]) => (
                <a
                  key={key}
                  href={url as string}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-bg-surface hover:bg-border-subtle hover:text-brand-teal rounded-full text-text-secondary transition-colors"
                >
                  {getSocialIcon(url as string)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
