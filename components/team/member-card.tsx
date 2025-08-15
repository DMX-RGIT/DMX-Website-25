'use client';

import Image from 'next/image';
import { TeamMember } from '@/types';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 card-hover">
      <div className="relative h-64 w-full">
        <Image
          src={member.photoUrl}
          alt={member.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dmx-dark via-dmx-dark/50 to-transparent opacity-60" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white">{member.name}</h3>
        <p className="text-dmx-primary text-sm mb-2">{member.role}</p>
        <div className="flex gap-3">
          {member.socialLinks.github && (
            <a
              href={member.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.linkedin && (
            <a
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.twitter && (
            <a
              href={member.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
