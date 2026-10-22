-- Adds manual drag-to-reorder support to the admin lists.
-- Run this in Supabase → SQL Editor BEFORE deploying the new code.
-- The site code orders by sort_order first; without this column the blog and
-- work queries would error, so apply this first.

alter table blog_posts    add column if not exists sort_order integer not null default 0;
alter table work_projects add column if not exists sort_order integer not null default 0;

-- Backfill from the current ordering so nothing jumps on first deploy:
-- blogs keep newest-first, projects keep newest-year-first.
with ordered as (
  select id, row_number() over (order by date desc nulls last, created_at desc) - 1 as rn
  from blog_posts
)
update blog_posts b set sort_order = o.rn from ordered o where b.id = o.id;

with ordered as (
  select id, row_number() over (order by year desc nulls last, created_at desc) - 1 as rn
  from work_projects
)
update work_projects p set sort_order = o.rn from ordered o where p.id = o.id;

-- Reads always order by this column.
create index if not exists blog_posts_sort_order_idx    on blog_posts (sort_order);
create index if not exists work_projects_sort_order_idx on work_projects (sort_order);
