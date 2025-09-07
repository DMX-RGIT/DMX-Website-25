import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { Project } from "@/types";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const filePath = path.join(process.cwd(), 'public', 'images', 'project-files', `${slug}.mdx`);
  
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const { data } = matter(content);
    
    const project: Project = {
      id: slug,
      title: data.title || 'Untitled Project',
      description: data.description || '',
      techStack: data.techStack || [],
      githubLink: data.githubLink || undefined,
      demoLink: data.demoLink || undefined,
      coverImage: data.coverImage || undefined,
      featured: data.featured || false,
    };

    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gradient mb-6">{project.title}</h1>
          <p className="text-lg mb-4">{project.description}</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error reading project:', error);
    return <div>Project not found.</div>;
  }
}
