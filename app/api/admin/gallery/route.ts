import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const GALLERY_FILE = path.join(process.cwd(), 'content', 'gallery.json');

export async function GET() {
  try {
    const data = await fs.readFile(GALLERY_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Failed to read gallery:', error);
    return NextResponse.json({ error: 'Failed to read gallery json' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Validate we're receiving an array of categories
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected an array of categories' }, { status: 400 });
    }
    await fs.writeFile(GALLERY_FILE, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save gallery:', error);
    return NextResponse.json({ error: 'Failed to save gallery data' }, { status: 500 });
  }
}
