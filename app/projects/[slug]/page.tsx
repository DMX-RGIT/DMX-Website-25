import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { Project } from "@/types";
import ProjectDetailContent from "./ProjectDetailContent";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), 'public', 'images', 'project-files', `${slug}.mdx`);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const { data, content: body } = matter(content);

    // Convert markdown to HTML
    const html = await remark().use(remarkHtml).process(body);
    const htmlString = html.toString();

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

    return <ProjectDetailContent project={project} htmlContent={htmlString} />;
  } catch (error) {
    console.error('Error reading project:', error);
    return <div>Project not found.</div>;
  }
}
