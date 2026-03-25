-- Supabase schema for DMX events CMS
-- Run in Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  content text not null,
  cover_image_url text,
  event_date timestamptz not null,
  category text,
  tags text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_event_date_idx on public.events (event_date desc);
create index if not exists events_slug_idx on public.events (slug);
create index if not exists events_published_date_idx on public.events (is_published, event_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

alter table public.events enable row level security;

-- Public can read only published past events.
drop policy if exists "public_read_past_published_events" on public.events;
create policy "public_read_past_published_events"
on public.events
for select
using (
  is_published = true
  and event_date < now()
);

-- Authenticated users can read all events (for admin UIs if needed).
drop policy if exists "authenticated_read_all_events" on public.events;
create policy "authenticated_read_all_events"
on public.events
for select
to authenticated
using (true);

-- NOTE:
-- Admin writes are currently executed via server-side service role key in API routes,
-- so insert/update/delete bypass RLS. Keep service role key only on server.
