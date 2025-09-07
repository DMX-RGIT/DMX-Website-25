'use client';

import { YearSelector } from '@/components/team/year-selector';
import { TeamCarousel } from '@/components/team/team-carousel';
import current from '@/content/team/members.json';
import y2025 from '@/content/team/2025.json';
import y2024 from '@/content/team/2024.json';

type Member = { name: string; position: string; quote?: string };

export default function TeamPage() {
  const yearToMembers: Record<number, Member[]> = {
    2024: (y2024 as Member[]),
    2025: (y2025 as Member[]),
  };

  

  // Fallback to support existing members.json shape if needed, with safe parsing
  const currentFile = current as unknown as { year?: number; members?: Member[] } | Member[];
  let detectedYear = 2025;
  let detectedMembers: Member[] = [];

  if (Array.isArray(currentFile)) {
    detectedMembers = currentFile as Member[];
  } else {
    detectedYear = currentFile.year ?? 2025;
    detectedMembers = currentFile.members ?? [];
  }

  if (detectedMembers.length > 0 && !yearToMembers[detectedYear]) {
    yearToMembers[detectedYear] = detectedMembers;
  }

  const mostRecentYear = Math.max(...Object.keys(yearToMembers).map(Number));

  // Team carousel members data - optimized for mobile
  const teamMembers = [
    {
      id: 1,
      name: "Harsh Tiwari",
      title: "President",
      image: "/images/team/harsh.webp"
    },
    {
      id: 2,
      name: "Bhushan Naikwade", 
      title: "Vice President",
      image: "/images/team/bhushan.webp"
    },
    {
      id: 3,
      name: "Aadish Gotekar",
      title: "Vice President", 
      image: "/images/team/aadish.webp"
    },
    {
      id: 4,
      name: "Yaksh Rajput",
      title: "General Secretary",
      image: "/images/team/yaksh.webp"
    },
    {
      id: 5,
      name: "Tejas Gawde",
      title: "General Secretary",
      image: "/images/team/tejas.webp"
    },
    {
      id: 6,
      name: "Somnath Shanbaug", 
      title: "General Secretary",
      image: "/images/team/somnath.webp"
    }
  ];
  
  
  return (
    <div className="min-h-screen metamask-page">
      <style jsx>{`
        .metamask-page {
          background: linear-gradient(135deg, #fef7f4 0%, #fff5f0 50%, #f9f4ff 100%);
          min-height: 100vh;
          padding: 1rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Floating geometric shapes animation */
        .metamask-page::before {
          content: '';
          position: absolute;
          top: 10%;
          left: -5%;
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #ff6b35, #f7931e);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: float1 12s ease-in-out infinite;
          z-index: 1;
        }

        .metamask-page::after {
          content: '';
          position: absolute;
          top: 60%;
          right: -3%;
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border-radius: 50% 20% 50% 20%;
          animation: float2 15s ease-in-out infinite reverse;
          z-index: 1;
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(-180deg); }
        }

        /* Add more floating shapes */
        .floating-shape-1 {
          position: absolute;
          top: 30%;
          right: 10%;
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #06d6a0, #118ab2);
          border-radius: 20px;
          animation: float3 10s ease-in-out infinite;
          z-index: 1;
          transform-origin: center;
        }

        .floating-shape-2 {
          position: absolute;
          bottom: 20%;
          left: 8%;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #ffd60a, #ff8500);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation: float4 14s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-25px) scale(1.1); }
        }

        @keyframes float4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-35px) rotate(120deg); }
        }

        /* Mobile first responsive padding */
        @media (min-width: 640px) {
          .metamask-page {
            padding: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .metamask-page {
            padding: 2rem;
          }
        }

        .glass-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 
            0 20px 40px rgba(139, 92, 246, 0.1),
            0 8px 32px rgba(255, 107, 53, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        /* Responsive design for larger screens */
        @media (min-width: 640px) {
          .glass-container {
            padding: 2rem;
            border-radius: 28px;
            margin-bottom: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .glass-container {
            padding: 2.5rem;
            border-radius: 32px;
            margin-bottom: 3rem;
          }
        }

        .glass-container:hover {
          transform: translateY(-8px);
          box-shadow: 
            0 32px 64px rgba(139, 92, 246, 0.2),
            0 16px 48px rgba(255, 107, 53, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border-color: rgba(139, 92, 246, 0.4);
        }

        /* Animated gradient border effect */
        .glass-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(45deg, 
            #8b5cf6, #06d6a0, #ff6b35, #ffd60a, #8b5cf6);
          background-size: 300% 300%;
          animation: gradientShift 6s ease infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .glass-container:hover::before {
          opacity: 1;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .page-title {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 3.5rem; /* Bold like MetaMask */
          font-weight: 900; /* Extra bold */
          background: linear-gradient(135deg, #8b5cf6, #5b21b6, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: #5b21b6; /* Fallback */
          line-height: 0.9;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
          animation: titlePulse 4s ease-in-out infinite;
        }

        @keyframes titlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        /* Responsive title sizing */
        @media (min-width: 640px) {
          .page-title {
            font-size: 4rem;
            margin-bottom: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .page-title {
            font-size: 5rem;
            margin-bottom: 3rem;
          }
        }

        .section-title {
          color: #6b21a8;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          z-index: 2;
        }

        /* Responsive section title */
        @media (min-width: 640px) {
          .section-title {
            font-size: 1.2rem;
            margin-bottom: 1.75rem;
          }
        }

        @media (min-width: 1024px) {
          .section-title {
            font-size: 1.3rem;
            margin-bottom: 2rem;
          }
        }
      `}</style>

      {/* Floating Shapes */}
      <div className="floating-shape-1"></div>
      <div className="floating-shape-2"></div>

      {/* Page Title */}
      <h1 className="page-title">
        Our Team
      </h1>

      {/* Team Carousel Section */}
      <div className="glass-container">
        <h2 className="section-title">Leadership Team</h2>
        <TeamCarousel speakers={teamMembers} />
      </div>

      {/* Year Selector Section */}
      <div className="glass-container">
        <h2 className="section-title">All Members</h2>
        <YearSelector yearToMembers={yearToMembers} defaultYear={mostRecentYear} />
      </div>
    </div>
  );
}
