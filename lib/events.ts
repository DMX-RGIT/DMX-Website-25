import { Event } from '@/types';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase';

export interface EventInput {
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  date: string;
  category?: string | null;
  tags?: string[];
  isPublished?: boolean;
}

interface EventRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  cover_image_url: string | null;
  event_date: string;
  category: string | null;
  tags: string[] | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

function mapEventRowToEvent(row: EventRow): Event {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    coverImage: row.cover_image_url || '/images/placeholder-event.jpg',
    date: row.event_date,
    category: row.category || undefined,
    tags: row.tags || [],
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublicPastEvents(): Promise<Event[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .lt('event_date', new Date().toISOString())
    .order('event_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return (data as EventRow[]).map(mapEventRowToEvent);
}

export async function getPublicEventBySlug(slug: string): Promise<Event | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error?.code === 'PGRST116') {
    return null;
  }

  if (error) {
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return mapEventRowToEvent(data as EventRow);
}

export async function getAdminEvents(): Promise<Event[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch admin events: ${error.message}`);
  }

  return (data as EventRow[]).map(mapEventRowToEvent);
}

export async function createEvent(input: EventInput): Promise<Event> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from('events')
    .insert({
      slug: input.slug,
      title: input.title,
      description: input.description,
      content: input.content,
      cover_image_url: input.coverImage || null,
      event_date: input.date,
      category: input.category || null,
      tags: input.tags || [],
      is_published: input.isPublished ?? true,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return mapEventRowToEvent(data as EventRow);
}

export async function updateEvent(id: string, input: EventInput): Promise<Event> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from('events')
    .update({
      slug: input.slug,
      title: input.title,
      description: input.description,
      content: input.content,
      cover_image_url: input.coverImage || null,
      event_date: input.date,
      category: input.category || null,
      tags: input.tags || [],
      is_published: input.isPublished ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return mapEventRowToEvent(data as EventRow);
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}
