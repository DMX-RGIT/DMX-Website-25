import { NextResponse } from 'next/server';
import { requireAdminResponse } from '@/lib/admin-route';
import { deleteTeamData, getAllTeamData, saveTeamData } from '@/lib/team';

export async function GET() {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const result = await getAllTeamData();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to read team data:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const { year, teamData } = await req.json();
    if (!year || !teamData) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    await saveTeamData(year, teamData);
    return NextResponse.json({ success: true, year });
  } catch (error) {
    console.error('Failed to save team data:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    if (!year) return NextResponse.json({ error: 'Year is required' }, { status: 400 });

    await deleteTeamData(year);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete team data:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
