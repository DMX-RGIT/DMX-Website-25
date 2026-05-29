import { NextResponse } from 'next/server';
import { getAllTeamData } from '@/lib/team';

export async function GET() {
  try {
    const data = await getAllTeamData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    return NextResponse.json({ error: 'Failed to read team members' }, { status: 500 });
  }
}
