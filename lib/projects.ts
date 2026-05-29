import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Project } from '@/types';

const PROJECTS_DIR = path.join(process.cwd(), 'public', 'images', 'project-files');

export interface ProjectMdxDocument {
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
}

function mapFrontmatterToProject(slug: string, frontmatter: Record<string, unknown>): Project {
  return {
    id: slug,
    title: typeof frontmatter.title === 'string' ? frontmatter.title : 'Untitled Project',
    description: typeof frontmatter.description === 'string' ? frontmatter.description : '',
    techStack: Array.isArray(frontmatter.techStack)
      ? frontmatter.techStack.filter((item): item is string => typeof item === 'string')
      : [],
    githubLink: typeof frontmatter.githubLink === 'string' ? frontmatter.githubLink : undefined,
    demoLink: typeof frontmatter.demoLink === 'string' ? frontmatter.demoLink : undefined,
    coverImage: typeof frontmatter.coverImage === 'string' ? frontmatter.coverImage : undefined,
    featured: typeof frontmatter.featured === 'boolean' ? frontmatter.featured : false,
  };
}

export async function ensureProjectsDirectory(): Promise<void> {
  await fs.mkdir(PROJECTS_DIR, { recursive: true });
}

export async function getAllProjectDocuments(): Promise<ProjectMdxDocument[]> {
  await ensureProjectsDirectory();
  const files = await fs.readdir(PROJECTS_DIR);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  return Promise.all(
    mdxFiles.map(async (file) => {
      const filePath = path.join(PROJECTS_DIR, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        slug: file.replace(/\.mdx$/, ''),
        frontmatter: data,
        content,
      };
    }),
  );
}

export async function getAllProjects(): Promise<Project[]> {
  const docs = await getAllProjectDocuments();
  return docs.map((doc) => mapFrontmatterToProject(doc.slug, doc.frontmatter));
}

export async function getProjectDocumentBySlug(slug: string): Promise<ProjectMdxDocument | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontmatter: data,
      content,
    };
  } catch (error) {
    const fsError = error as NodeJS.ErrnoException;
    if (fsError.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const doc = await getProjectDocumentBySlug(slug);
  if (!doc) return null;

  return mapFrontmatterToProject(slug, doc.frontmatter);
}

export async function saveProjectDocument(input: ProjectMdxDocument): Promise<void> {
  await ensureProjectsDirectory();
  const filePath = path.join(PROJECTS_DIR, `${input.slug}.mdx`);
  const fileContent = matter.stringify(input.content || '', input.frontmatter || {});
  await fs.writeFile(filePath, fileContent, 'utf8');
}

export async function deleteProjectDocument(slug: string): Promise<void> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  await fs.unlink(filePath);
}
