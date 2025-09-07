import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProjectCard } from '@/components/projects/project-card';
import { Project } from '@/types';
import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';

// Server-side function to fetch all projects from markdown files
async function getProjects(): Promise<Project[]> {
  const projectsDir = path.join(process.cwd(), 'public', 'images', 'project-files');
  
  try {
    const files = await fs.readdir(projectsDir);
    const projects: Project[] = [];

    for (const file of files) {
      if (path.extname(file) === '.mdx' || path.extname(file) === '.md') {
        const filePath = path.join(projectsDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const { data } = matter(content);
        
        projects.push({
          id: path.basename(file, path.extname(file)),
          title: data.title || 'Untitled Project',
          description: data.description || '',
          techStack: data.techStack || [],
          githubLink: data.githubLink || undefined,
          demoLink: data.demoLink || undefined,
          coverImage: data.coverImage || undefined,
          featured: data.featured || false,
        });
      }
    }
    
    return projects.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

// Mock data for development and preview
function getMockProjects(): Project[] {
  return [
    {
      id: "ai-chatbot",
      title: "AI Student Assistant Chatbot",
      description: "Intelligent chatbot using GPT-3 API for student academic assistance, query resolution, and campus information. Integrated with college database for real-time information.",
      techStack: ["Python", "OpenAI GPT-3", "Flask", "React", "PostgreSQL", "Docker"],
      githubLink: "https://github.com/dmx-rgit/ai-chatbot",
      demoLink: "https://dmx-chatbot.vercel.app",
      coverImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: "smart-campus-nav",
      title: "Smart Campus Navigation",
      description: "AR-based indoor navigation system for RGIT campus using computer vision and IoT sensors. Helps students and visitors navigate the campus efficiently.",
      techStack: ["Unity", "ARCore", "Python", "TensorFlow", "IoT Sensors", "Firebase"],
      githubLink: "https://github.com/dmx-rgit/smart-navigation",
      coverImage: "https://images.unsplash.com/photo-1592659762303-90081d34b277?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: "performance-analytics",
      title: "Student Performance Analytics",
      description: "Dashboard for analyzing student performance trends using machine learning algorithms. Provides insights for academic improvement and personalized learning paths.",
      techStack: ["Python", "Pandas", "Scikit-learn", "Plotly", "Streamlit", "MySQL"],
      githubLink: "https://github.com/dmx-rgit/performance-analytics",
      demoLink: "https://dmx-analytics.streamlit.app",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: "blockchain-voting",
      title: "Blockchain Voting System",
      description: "Secure and transparent voting system using blockchain technology for student elections and polls. Ensures vote integrity and transparency.",
      techStack: ["Solidity", "Web3.js", "React", "Ethereum", "MetaMask", "IPFS"],
      githubLink: "https://github.com/dmx-rgit/blockchain-voting",
      coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
      featured: false
    }
  ];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-12">Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
