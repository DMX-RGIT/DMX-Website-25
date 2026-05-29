-- Supabase schema for DMX team members
-- Run in Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  name text not null,
  position text not null,
  image text,
  linkedin text,
  github text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_members_year_sort_idx
  on public.team_members (year desc, sort_order asc);

create or replace function public.set_team_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_team_members_updated_at on public.team_members;
create trigger trg_team_members_updated_at
before update on public.team_members
for each row
execute function public.set_team_updated_at();

alter table public.team_members enable row level security;

drop policy if exists "public_read_all_team" on public.team_members;
create policy "public_read_all_team"
on public.team_members
for select
using (true);

-- NOTE:
-- Admin writes are executed via service role in API routes.
