import { YearSelector } from '@/components/team/year-selector';
import { SpeakerCarousel } from '@/components/team/speaker-carousel';
import current from '@/content/team/members.json';
import y2025 from '@/content/team/2025.json';
import y2024 from '@/content/team/2024.json';

type Member = { name: string; position: string; quote?: string };

export default async function TeamPage() {
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

  // Mock speaker data - replace with your actual speaker data
  const speakers = [
    {
      id: 1,
      name: "Harsh Tiwari",
      title: "President",
      image: "/images/team/harsh.JPG"
    },
    {
      id: 2,
      name: "Bhushan Naikwade",
      title: "Vice President",
      image: "/images/team/bhushan.JPG"
    },
    {
      id: 3,
      name: "Aadish Gotekar",
      title: "Vice President",
      image: "/images/team/aadish.JPG"
    },
    {
      id: 4,
      name: "Yaksh Rajput",
      title: "General Secretary",
      image: "/images/team/yaksh.JPG"
    },
    {
      id: 5,
      name: "Tejas Gawde",
      title: "General Secretary",
      image: "/images/team/tejas.JPG"
    },
    {
      id: 6,
      name: "Somnath Shanbaug",
      title: "General Secretary",
      image: "/images/team/somnath.JPG"
    }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Team Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-12 text-center">Our Team</h1>
          {/* Speaker Carousel Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SpeakerCarousel speakers={speakers} />
        </div>
      </div>
    </div>
          <YearSelector yearToMembers={yearToMembers} defaultYear={mostRecentYear} />
        </div>
      </div>
  );
}
