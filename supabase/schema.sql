-- ============================================================
-- BrollScan — Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan_type text default 'free' check (plan_type in ('free', 'creator', 'studio')),
  scripts_used_this_month int default 0,
  usage_reset_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 2. Scripts
create table if not exists public.scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  raw_text text not null,
  scene_count int,
  created_at timestamptz default now()
);

-- 3. Scenes
create table if not exists public.scenes (
  id uuid primary key default gen_random_uuid(),
  script_id uuid references public.scripts(id) on delete cascade not null,
  scene_order int not null,
  text_content text not null,
  keywords text[] not null,
  scene_title text
);

-- 4. B-roll Results
create table if not exists public.broll_results (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid references public.scenes(id) on delete cascade not null,
  source text not null check (source in ('pexels', 'pixabay')),
  thumbnail_url text not null,
  video_url text not null,
  duration_seconds numeric,
  relevance_score numeric,
  external_id text
);

-- 5. Saved Clips
create table if not exists public.saved_clips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  broll_result_id uuid references public.broll_results(id) on delete cascade not null,
  saved_at timestamptz default now(),
  unique(user_id, broll_result_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.scripts enable row level security;
alter table public.scenes enable row level security;
alter table public.broll_results enable row level security;
alter table public.saved_clips enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Scripts: users can CRUD their own scripts
create policy "Users can view own scripts"
  on public.scripts for select
  using (auth.uid() = user_id);

create policy "Users can insert own scripts"
  on public.scripts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own scripts"
  on public.scripts for delete
  using (auth.uid() = user_id);

-- Scenes: users can access scenes of their own scripts
create policy "Users can view scenes of own scripts"
  on public.scenes for select
  using (
    exists (
      select 1 from public.scripts
      where scripts.id = scenes.script_id
        and scripts.user_id = auth.uid()
    )
  );

create policy "Users can insert scenes for own scripts"
  on public.scenes for insert
  with check (
    exists (
      select 1 from public.scripts
      where scripts.id = scenes.script_id
        and scripts.user_id = auth.uid()
    )
  );

-- B-roll Results: users can access results of their own scripts' scenes
create policy "Users can view broll results of own scripts"
  on public.broll_results for select
  using (
    exists (
      select 1 from public.scenes
      join public.scripts on scripts.id = scenes.script_id
      where scenes.id = broll_results.scene_id
        and scripts.user_id = auth.uid()
    )
  );

create policy "Users can insert broll results for own scripts"
  on public.broll_results for insert
  with check (
    exists (
      select 1 from public.scenes
      join public.scripts on scripts.id = scenes.script_id
      where scenes.id = broll_results.scene_id
        and scripts.user_id = auth.uid()
    )
  );

-- Saved Clips: users can CRUD their own saved clips
create policy "Users can view own saved clips"
  on public.saved_clips for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved clips"
  on public.saved_clips for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own saved clips"
  on public.saved_clips for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Service Role Policies (for API routes using service role key)
-- ============================================================

-- Allow service role to manage profiles (for usage tracking)
create policy "Service role can manage profiles"
  on public.profiles for all
  using (auth.jwt()->>'role' = 'service_role');

create policy "Service role can manage scripts"
  on public.scripts for all
  using (auth.jwt()->>'role' = 'service_role');

create policy "Service role can manage scenes"
  on public.scenes for all
  using (auth.jwt()->>'role' = 'service_role');

create policy "Service role can manage broll_results"
  on public.broll_results for all
  using (auth.jwt()->>'role' = 'service_role');

-- ============================================================
-- Auto-create profile on signup (trigger)
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Indexes for performance
-- ============================================================

create index if not exists idx_scripts_user_id on public.scripts(user_id);
create index if not exists idx_scripts_created_at on public.scripts(created_at desc);
create index if not exists idx_scenes_script_id on public.scenes(script_id);
create index if not exists idx_scenes_order on public.scenes(script_id, scene_order);
create index if not exists idx_broll_results_scene_id on public.broll_results(scene_id);
create index if not exists idx_saved_clips_user_id on public.saved_clips(user_id);
