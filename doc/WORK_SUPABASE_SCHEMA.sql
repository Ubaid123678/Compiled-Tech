-- Work/Projects table for Supabase
-- Run this in Supabase SQL editor

create table if not exists work_projects (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  category text not null check (category in ('Web', 'Mobile', 'AI')),
  excerpt text,
  description text not null,
  problem text,
  solution text,
  result text,
  year int not null,
  role text,
  image text,                    -- hero image URL
  thumbnail text,                -- grid thumbnail URL
  gallery_images text[] default '{}',  -- array of screenshot URLs
  tech_stack text[] default '{}',      -- array of technologies
  github_url text,               -- GitHub repo URL
  live_url text,                 -- live preview URL
  featured boolean default false,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table work_projects enable row level security;

-- Policy: allow public read of published projects
create policy "Public read published projects"
  on work_projects
  for select
  using (published = true);

-- Policy: allow approved site administrators to manage projects
create policy "Site administrators can manage projects"
  on work_projects
  for all
  to authenticated
  using ((select auth.jwt()) -> 'app_metadata' -> 'compiled_tech_admin' = 'true'::jsonb)
  with check ((select auth.jwt()) -> 'app_metadata' -> 'compiled_tech_admin' = 'true'::jsonb);

-- Indexes
create index if not exists work_projects_category_published_idx
  on work_projects (category, published);

create index if not exists work_projects_slug_idx
  on work_projects (slug);

create index if not exists work_projects_featured_published_idx
  on work_projects (featured, published);
