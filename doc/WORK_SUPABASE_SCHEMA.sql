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

-- Policy: allow authenticated users to manage projects
create policy "Authenticated users can manage projects"
  on work_projects
  for all
  to authenticated
  using (true);

-- Indexes
create index if not exists work_projects_category_published_idx
  on work_projects (category, published);

create index if not exists work_projects_slug_idx
  on work_projects (slug);

create index if not exists work_projects_featured_published_idx
  on work_projects (featured, published);

-- Insert sample data
insert into work_projects (slug, title, category, excerpt, description, problem, solution, result, year, role, image, thumbnail, gallery_images, tech_stack, github_url, live_url, featured, published) values
(
  'service-marketplace',
  'Service marketplace app',
  'Mobile',
  'Customers book local services and track them in real time.',
  'A mobile marketplace connecting customers with local service providers (plumbers, electricians, cleaners) with real-time booking, tracking, and payments.',
  'Local service providers lacked a platform to manage bookings, dispatch, and real-time tracking. Customers had no visibility into provider ETA or quality.',
  'Built a React Native app with Node.js backend and MongoDB. Features: real-time GPS tracking, automated dispatch, in-app chat, payment integration, provider dashboard, customer reviews.',
  '500+ providers onboarded in 3 months. 40% reduction in customer wait time. 4.8★ app store rating. $2M+ GMV in first year.',
  2024,
  'Full-cycle development',
  '/work/service-marketplace-hero.webp',
  '/work/service-marketplace-thumb.webp',
  '["/work/service-marketplace-1.webp", "/work/service-marketplace-2.webp", "/work/service-marketplace-3.webp"]',
  '["React Native", "Node.js", "MongoDB", "Redis", "Socket.io", "Stripe", "AWS"]',
  'https://github.com/compiledtech/service-marketplace',
  'https://servicemarketplace.app',
  true,
  true
),
(
  'document-extractor',
  'Document extractor',
  'AI',
  'Turns invoices and forms into structured data.',
  'An AI-powered document processing pipeline that extracts structured data from invoices, receipts, and forms with 95%+ accuracy.',
  'Finance teams manually entered data from thousands of PDF invoices monthly. Error-prone, slow, and expensive.',
  'Built a Python/FastAPI service with layout-aware OCR (LayoutLM), table extraction, and validation rules. Integrated with accounting software via API.',
  '95% extraction accuracy. 80% time savings for finance team. Processes 10K+ docs/month. Reduced data entry errors to near zero.',
  2024,
  'AI/ML engineering',
  '/work/document-extractor-hero.webp',
  '/work/document-extractor-thumb.webp',
  '["/work/document-extractor-1.webp", "/work/document-extractor-2.webp"]',
  '["Python", "FastAPI", "Next.js", "LayoutLM", "PostgreSQL", "Docker", "AWS"]',
  'https://github.com/compiledtech/document-extractor',
  'https://extractor.compiled.tech',
  true,
  true
),
(
  'saas-analytics',
  'SaaS analytics dashboard',
  'Web',
  'Live charts and reports for a subscription product.',
  'A real-time analytics dashboard for a B2B SaaS product showing MRR, churn, cohort retention, and feature adoption.',
  'Product team had no visibility into user behavior. Decisions were guesswork. Existing tools (Mixpanel, Amplitude) were too expensive or rigid.',
  'Built a Next.js dashboard with PostgreSQL, TimescaleDB for time-series data, and Recharts. Custom event pipeline with Redis buffering. Role-based access.',
  'Product team now makes data-driven decisions. Identified 3 features driving 60% of retention. Reduced analytics cost by 70% vs Mixpanel.',
  2023,
  'Full-stack development',
  '/work/saas-analytics-hero.webp',
  '/work/saas-analytics-thumb.webp',
  '["/work/saas-analytics-1.webp", "/work/saas-analytics-2.webp", "/work/saas-analytics-3.webp"]',
  '["Next.js", "PostgreSQL", "TimescaleDB", "Tailwind", "Recharts", "Redis", "Vercel"]',
  'https://github.com/compiledtech/saas-analytics',
  'https://analytics.compiled.tech',
  true,
  true
);