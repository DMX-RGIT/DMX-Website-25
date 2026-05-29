import { NextResponse } from 'next/server';
import {
  deleteProjectDocument,
  getAllProjectDocuments,
  saveProjectDocument,
} from '@/lib/projects';
import { requireAdminResponse } from '@/lib/admin-route';

export async function GET() {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const projects = await getAllProjectDocuments();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to read projects:', error);
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const { slug, frontmatter, content } = await req.json();
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

    await saveProjectDocument({
      slug,
      frontmatter: frontmatter ?? {},
      content: content ?? '',
    });

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Failed to save project:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

    await deleteProjectDocument(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
