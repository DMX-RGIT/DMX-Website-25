import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const TEAM_DIR = path.join(process.cwd(), 'content', 'team');

export async function GET() {
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
  try {
    const { year, teamData } = await req.json();
    if (!year || !teamData) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    
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
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    if (!year) return NextResponse.json({ error: 'Year is required' }, { status: 400 });
    
    const filePath = path.join(TEAM_DIR, `${year}.json`);
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete team data:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
