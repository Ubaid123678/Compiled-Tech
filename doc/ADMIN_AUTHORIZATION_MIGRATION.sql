-- Set compiled_tech_admin = true in Auth app metadata for approved accounts
-- before applying this migration. See HOSTINGER_DEPLOYMENT.md.
begin;

alter table public.work_projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.newsletter enable row level security;

drop policy if exists "Authenticated users can manage projects" on public.work_projects;
drop policy if exists "Site administrators can manage projects" on public.work_projects;
create policy "Site administrators can manage projects"
  on public.work_projects for all to authenticated
  using ((select auth.jwt()) -> 'app_metadata' -> 'compiled_tech_admin' = 'true'::jsonb)
  with check ((select auth.jwt()) -> 'app_metadata' -> 'compiled_tech_admin' = 'true'::jsonb);

drop policy if exists "Authenticated users can manage posts" on public.blog_posts;
drop policy if exists "Site administrators can manage posts" on public.blog_posts;
create policy "Site administrators can manage posts"
  on public.blog_posts for all to authenticated
  using ((select auth.jwt()) -> 'app_metadata' -> 'compiled_tech_admin' = 'true'::jsonb)
  with check ((select auth.jwt()) -> 'app_metadata' -> 'compiled_tech_admin' = 'true'::jsonb);

drop policy if exists "Authenticated users can read subscribers" on public.newsletter;
drop policy if exists "Site administrators can read subscribers" on public.newsletter;
create policy "Site administrators can read subscribers"
  on public.newsletter for select to authenticated
  using ((select auth.jwt()) -> 'app_metadata' -> 'compiled_tech_admin' = 'true'::jsonb);

commit;
