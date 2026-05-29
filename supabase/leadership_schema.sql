-- Supabase schema for DMX leadership carousel
-- Run in Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.leadership_team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leadership_team_sort_idx
  on public.leadership_team (sort_order asc, created_at asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_leadership_team_updated_at on public.leadership_team;
create trigger trg_leadership_team_updated_at
before update on public.leadership_team
for each row
execute function public.set_updated_at();

alter table public.leadership_team enable row level security;

drop policy if exists "public_read_active_leadership" on public.leadership_team;
create policy "public_read_active_leadership"
on public.leadership_team
for select
using (is_active = true);

drop policy if exists "authenticated_read_all_leadership" on public.leadership_team;
create policy "authenticated_read_all_leadership"
on public.leadership_team
for select
to authenticated
using (true);

-- NOTE:
-- Admin writes are executed via service role in API routes.
