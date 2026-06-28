-- Capacity Lab founding beta data model
-- Apply with Supabase CLI or paste into the Supabase SQL editor before public beta.

create extension if not exists pgcrypto;

create table if not exists public.capacity_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  overall_score integer not null check (overall_score between 0 and 100),
  primary_focus text not null check (primary_focus in ('energy','sleep','regulation','recovery','readiness')),
  created_at timestamptz not null default now()
);

create index if not exists capacity_assessments_user_created_idx
  on public.capacity_assessments(user_id, created_at desc);

create table if not exists public.capacity_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null,
  energy integer not null check (energy between 0 and 100),
  sleep integer not null check (sleep between 0 and 100),
  regulation integer not null check (regulation between 0 and 100),
  recovery integer not null check (recovery between 0 and 100),
  readiness integer not null check (readiness between 0 and 100),
  cycle_context text not null default 'Not recorded',
  symptoms text[] not null default '{}',
  note text not null default '' check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, checkin_date)
);

create index if not exists capacity_checkins_user_date_idx
  on public.capacity_checkins(user_id, checkin_date desc);

alter table public.capacity_assessments enable row level security;
alter table public.capacity_checkins enable row level security;

create policy "Members read their assessments"
  on public.capacity_assessments for select
  using (auth.uid() = user_id);
create policy "Members create their assessments"
  on public.capacity_assessments for insert
  with check (auth.uid() = user_id);
create policy "Members delete their assessments"
  on public.capacity_assessments for delete
  using (auth.uid() = user_id);

create policy "Members read their checkins"
  on public.capacity_checkins for select
  using (auth.uid() = user_id);
create policy "Members create their checkins"
  on public.capacity_checkins for insert
  with check (auth.uid() = user_id);
create policy "Members update their checkins"
  on public.capacity_checkins for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "Members delete their checkins"
  on public.capacity_checkins for delete
  using (auth.uid() = user_id);
