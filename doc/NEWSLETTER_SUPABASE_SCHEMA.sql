-- Newsletter subscribers table for Supabase
-- Run this once in the Supabase SQL editor.

create table if not exists newsletter (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamptz default now()
);

alter table newsletter enable row level security;

create policy "Public can subscribe"
  on newsletter
  for insert
  to anon, authenticated
  with check (true);

create policy "Site administrators can read subscribers"
  on newsletter
  for select
  to authenticated
  using ((select auth.jwt()) -> 'app_metadata' -> 'compiled_tech_admin' = 'true'::jsonb);