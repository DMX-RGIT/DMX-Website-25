import { Project } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import ProjectsContent from './ProjectsContent';

// Function to read projects from MDX files
async function getProjectsFromMDX(): Promise<Project[]> {
  const projectsDirectory = path.join(process.cwd(), 'public', 'images', 'project-files');

  try {
    const fileNames = await fs.readdir(projectsDirectory);
    const mdxFiles = fileNames.filter(fileName => fileName.endsWith('.mdx'));

    return await Promise.all(mdxFiles.map(async fileName => {
      const filePath = path.join(projectsDirectory, fileName);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const { data } = matter(fileContents);

      // Extract id from filename (remove .mdx extension)
      const id = fileName.replace(/\.mdx$/, '');

      return {
        id,
        title: data.title,
        description: data.description,
        techStack: data.techStack,
        githubLink: data.githubLink,
        demoLink: data.demoLink,
        coverImage: data.coverImage,
        featured: data.featured
      } as Project;
    }));
  } catch (error) {
    console.error('Error reading MDX files:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjectsFromMDX();

  return <ProjectsContent projects={projects} />;
}
