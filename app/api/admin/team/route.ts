import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requireAdminSession } from '@/lib/admin-auth';
import { z } from 'zod';

const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  image: z.string().min(1),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
});

const teamPostSchema = z.object({
  year: z.string().regex(/^[0-9A-Za-z-]+$/),
  teamData: z.array(teamMemberSchema),
});

const TEAM_DIR = path.join(process.cwd(), 'content', 'team');

export async function GET() {
  if (!await requireAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fs.mkdir(TEAM_DIR, { recursive: true });
    const files = await fs.readdir(TEAM_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const result: Record<string, unknown> = {};
    for (const file of jsonFiles) {
      const year = file.replace('.json', '');
      const content = await fs.readFile(path.join(TEAM_DIR, file), 'utf8');
      result[year] = JSON.parse(content);
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to read team data:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!await requireAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const { year, teamData } = teamPostSchema.parse(json);
    
    await fs.mkdir(TEAM_DIR, { recursive: true });
    
    const filePath = path.join(TEAM_DIR, `${year}.json`);
    await fs.writeFile(filePath, JSON.stringify(teamData, null, 2), 'utf8');
    return NextResponse.json({ success: true, year });
  } catch (error) {
    console.error('Failed to save team data:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!await requireAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    if (!year) return NextResponse.json({ error: 'Year is required' }, { status: 400 });
    
    // Mitigate Path Traversal
    if (!/^[0-9A-Za-z-]+$/.test(year)) {
      return NextResponse.json({ error: 'Invalid year format' }, { status: 400 });
    }
    
    const filePath = path.join(TEAM_DIR, `${year}.json`);
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete team data:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
