import { NextResponse } from 'next/server';
import { createEvent, deleteEvent, getAdminEvents, updateEvent } from '@/lib/events';
import { requireAdminSession } from '@/lib/admin-auth';
import { z } from 'zod';

const eventSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().optional().default(''),
  galleryImages: z.array(z.string()).optional(),
  date: z.string().min(1),
  category: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

async function assertAdmin() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const events = await getAdminEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to read events:', error);
    return NextResponse.json({ error: 'Failed to read events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const json = await req.json();
    const payload = eventSchema.parse(json);
    const created = await createEvent(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Failed to save event:', error);
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const json = await req.json();
    
    // Zod parses everything except the explicit ID needed for the update query.
    const payload = eventSchema.parse(json);
    
    if (!json.id) {
      return NextResponse.json({ error: 'Event id is required' }, { status: 400 });
    }

    const updated = await updateEvent(json.id, payload);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Event id is required' }, { status: 400 });

    await deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
