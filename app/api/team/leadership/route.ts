import { NextResponse } from 'next/server';
import { getPublicLeadershipMembers } from '@/lib/leadership';

export async function GET() {
  try {
    const members = await getPublicLeadershipMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Failed to read leadership members:', error);
    return NextResponse.json({ error: 'Failed to read leadership members' }, { status: 500 });
  }
}
