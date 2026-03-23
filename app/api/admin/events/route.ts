import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const EVENTS_DIR = path.join(process.cwd(), 'public', 'images', 'event-files');

export async function GET() {
  try {
    // Ensure directory exists
    await fs.mkdir(EVENTS_DIR, { recursive: true });
    
    const files = await fs.readdir(EVENTS_DIR);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));
    
    const events = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(EVENTS_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        return {
          slug: file.replace(/\.mdx$/, ''),
          frontmatter: data,
          content
        };
      })
    );
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to read events:', error);
    return NextResponse.json({ error: 'Failed to read events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { slug, frontmatter, content } = await req.json();
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    
    await fs.mkdir(EVENTS_DIR, { recursive: true });
    const filePath = path.join(EVENTS_DIR, `${slug}.mdx`);
    const fileContent = matter.stringify(content || '', frontmatter || {});
    
    await fs.writeFile(filePath, fileContent, 'utf8');
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Failed to save event:', error);
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    
    const filePath = path.join(EVENTS_DIR, `${slug}.mdx`);
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
