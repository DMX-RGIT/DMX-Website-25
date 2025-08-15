import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MemberCard } from '@/components/team/member-card';
import { TeamMember } from '@/types';

// Server-side function to fetch all team members from Firestore
async function getTeamMembers(): Promise<TeamMember[]> {
  // For development/preview - use mock data directly
  if (process.env.NODE_ENV === 'development') {
    return getMockTeamMembers();
  }
  
  try {
    const teamCol = collection(db, 'team');
    const snapshot = await getDocs(teamCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
  } catch (error) {
    console.error('Error fetching team members:', error);
    // Return mock data for development/preview
    return getMockTeamMembers();
  }
}

// Mock data for development and preview
function getMockTeamMembers(): TeamMember[] {
  return [
    {
      id: "arjun-patel",
      name: "Arjun Patel",
      role: "President & AI Research Lead",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Computer Science senior specializing in AI/ML research. Leading initiatives in computer vision and natural language processing.",
      socialLinks: {
        github: "https://github.com/arjunpatel",
        linkedin: "https://linkedin.com/in/arjunpatel",
        twitter: "https://twitter.com/arjunpatel"
      },
      year: 4
    },
    {
      id: "sneha-reddy",
      name: "Sneha Reddy",
      role: "Vice President & ML Engineer",
      photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b743?w=400&h=400&fit=crop&crop=face",
      bio: "Passionate about deep learning and computer vision applications. Working on cutting-edge research in medical image analysis.",
      socialLinks: {
        github: "https://github.com/snehareddy",
        linkedin: "https://linkedin.com/in/snehareddy"
      },
      year: 3
    },
    {
      id: "rahul-sharma",
      name: "Rahul Sharma",
      role: "Technical Lead & Full Stack Developer",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Expert in modern web technologies and system architecture. Building scalable solutions for campus automation projects.",
      socialLinks: {
        github: "https://github.com/rahulsharma",
        linkedin: "https://linkedin.com/in/rahulsharma"
      },
      year: 3
    },
    {
      id: "ananya-singh",
      name: "Ananya Singh",
      role: "Data Science Head",
      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Data science enthusiast working on predictive analytics and business intelligence solutions for educational insights.",
      socialLinks: {
        github: "https://github.com/ananyasingh",
        linkedin: "https://linkedin.com/in/ananyasingh"
      },
      year: 2
    },
    {
      id: "karthik-reddy",
      name: "Karthik Reddy",
      role: "Blockchain Developer",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      bio: "Blockchain technology advocate developing decentralized applications for transparency and security in academic processes.",
      socialLinks: {
        github: "https://github.com/karthikreddy",
        linkedin: "https://linkedin.com/in/karthikreddy"
      },
      year: 2
    },
    {
      id: "priya-nair",
      name: "Priya Nair",
      role: "UI/UX Designer & Frontend Developer",
      photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      bio: "Creative designer focused on user experience and interface design. Making technology accessible through thoughtful design.",
      socialLinks: {
        github: "https://github.com/priyanair",
        linkedin: "https://linkedin.com/in/priyanair"
      },
      year: 2
    }
  ];
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-12">Our Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
