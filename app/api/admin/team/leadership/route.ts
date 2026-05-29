import { NextResponse } from 'next/server';
import { requireAdminResponse } from '@/lib/admin-route';
import {
  createLeadershipMember,
  deleteLeadershipMember,
  getAdminLeadershipMembers,
  updateLeadershipMember,
} from '@/lib/leadership';

export async function GET() {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const members = await getAdminLeadershipMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Failed to read leadership members:', error);
    return NextResponse.json({ error: 'Failed to read leadership members' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const payload = await req.json();
    if (!payload.name || !payload.role || !payload.imageUrl) {
      return NextResponse.json(
        { error: 'name, role and imageUrl are required' },
        { status: 400 },
      );
    }

    const created = await createLeadershipMember(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Failed to create leadership member:', error);
    return NextResponse.json({ error: 'Failed to create leadership member' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const payload = await req.json();
    if (!payload.id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updated = await updateLeadershipMember(payload.id, payload);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update leadership member:', error);
    return NextResponse.json({ error: 'Failed to update leadership member' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdminResponse();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await deleteLeadershipMember(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete leadership member:', error);
    return NextResponse.json({ error: 'Failed to delete leadership member' }, { status: 500 });
  }
}
