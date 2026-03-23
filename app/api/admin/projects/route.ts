import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const PROJECTS_DIR = path.join(process.cwd(), 'public', 'images', 'project-files');

export async function GET() {
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
  try {
    const { slug, frontmatter, content } = await req.json();
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    
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
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    
    const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
