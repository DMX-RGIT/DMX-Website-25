import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { requireAdminSession } from '@/lib/admin-auth';
import { z } from 'zod';

const projectPostSchema = z.object({
  slug: z.string().regex(/^[a-zA-Z0-9_-]+$/),
  content: z.string().optional().default(''),
  frontmatter: z.object({
    title: z.string().min(1).default('Untitled'),
    description: z.string().min(1).default(''),
    date: z.string().optional(),
    githubLink: z.string().optional(),
    demoLink: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
  }).optional().default({ title: 'Untitled', description: '' })
});

const PROJECTS_DIR = path.join(process.cwd(), 'public', 'images', 'project-files');

export async function GET() {
  if (!await requireAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fs.mkdir(PROJECTS_DIR, { recursive: true });
    
    const files = await fs.readdir(PROJECTS_DIR);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));
    
    const projects = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(PROJECTS_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        return {
          slug: file.replace(/\.mdx$/, ''),
          frontmatter: data,
          content
        };
      })
    );
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to read projects:', error);
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!await requireAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const { slug, frontmatter, content } = projectPostSchema.parse(json);
    
    await fs.mkdir(PROJECTS_DIR, { recursive: true });
    const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
    const fileContent = matter.stringify(content || '', frontmatter || {});
    
    await fs.writeFile(filePath, fileContent, 'utf8');
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Failed to save project:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!await requireAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    
    // Mitigate Path Traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
    }
    
    const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
