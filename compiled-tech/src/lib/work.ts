import { createClient } from "@supabase/supabase-js";

import { workCategories } from "@/data/work";

const supabase = createClient(
  process.env.SUPABASE_URL || "http://localhost:54321",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy"
);

export type WorkProject = {
  id: string;
  slug: string;
  title: string;
  category: "Web" | "Mobile" | "AI";
  excerpt: string;
  description: string;
  problem: string;
  solution: string;
  result: string;
  year: number;
  role: string;
  image: string;
  thumbnail: string;
  gallery_images: string[];
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

// Inline SVG placeholders as data URLs
const placeholderHero = (title: string, color: string) => 
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect fill="${color}" width="1200" height="675"/><text x="600" y="337" font-family="system-ui" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">${title}</text></svg>`)}`;

const placeholderThumb = (title: string, color: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect fill="${color}" width="400" height="225"/><text x="200" y="112" font-family="system-ui" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">${title}</text></svg>`)}`;

const fallbackProjects: WorkProject[] = [
  {
    id: "1",
    slug: "service-marketplace",
    title: "Service marketplace app",
    category: "Mobile",
    excerpt: "Customers book local services and track them in real time.",
    description: "A mobile marketplace connecting customers with local service providers (plumbers, electricians, cleaners) with real-time booking, tracking, and payments.",
    problem: "Local service providers lacked a platform to manage bookings, dispatch, and real-time tracking. Customers had no visibility into provider ETA or quality.",
    solution: "Built a React Native app with Node.js backend and MongoDB. Features: real-time GPS tracking, automated dispatch, in-app chat, payment integration, provider dashboard, customer reviews.",
    result: "500+ providers onboarded in 3 months. 40% reduction in customer wait time. 4.8★ app store rating. $2M+ GMV in first year.",
    year: 2024,
    role: "Full-cycle development",
    image: placeholderHero("Service marketplace app", "#2563eb"),
    thumbnail: placeholderThumb("Service marketplace", "#2563eb"),
    gallery_images: [placeholderHero("Service marketplace 1", "#1d4ed8"), placeholderHero("Service marketplace 2", "#1e40af"), placeholderHero("Service marketplace 3", "#1e3a8a")],
    tech_stack: ["React Native", "Node.js", "MongoDB", "Redis", "Socket.io", "Stripe", "AWS"],
    github_url: "https://github.com/compiledtech/service-marketplace",
    live_url: "https://servicemarketplace.app",
    featured: true,
    published: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    slug: "document-extractor",
    title: "Document extractor",
    category: "AI",
    excerpt: "Turns invoices and forms into structured data.",
    description: "An AI-powered document processing pipeline that extracts structured data from invoices, receipts, and forms with 95%+ accuracy.",
    problem: "Finance teams manually entered data from thousands of PDF invoices monthly. Error-prone, slow, and expensive.",
    solution: "Built a Python/FastAPI service with layout-aware OCR (LayoutLM), table extraction, and validation rules. Integrated with accounting software via API.",
    result: "95% extraction accuracy. 80% time savings for finance team. Processes 10K+ docs/month. Reduced data entry errors to near zero.",
    year: 2024,
    role: "AI/ML engineering",
    image: placeholderHero("Document extractor", "#7c3aed"),
    thumbnail: placeholderThumb("Document extractor", "#7c3aed"),
    gallery_images: [placeholderHero("Document extractor 1", "#6d28d9"), placeholderHero("Document extractor 2", "#5b21b6")],
    tech_stack: ["Python", "FastAPI", "Next.js", "LayoutLM", "PostgreSQL", "Docker", "AWS"],
    github_url: "https://github.com/compiledtech/document-extractor",
    live_url: "https://extractor.compiled.tech",
    featured: true,
    published: true,
    created_at: "2024-03-20T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z",
  },
  {
    id: "3",
    slug: "saas-analytics",
    title: "SaaS analytics dashboard",
    category: "Web",
    excerpt: "Live charts and reports for a subscription product.",
    description: "A real-time analytics dashboard for a B2B SaaS product showing MRR, churn, cohort retention, and feature adoption.",
    problem: "Product team had no visibility into user behavior. Decisions were guesswork. Existing tools (Mixpanel, Amplitude) were too expensive or rigid.",
    solution: "Built a Next.js dashboard with PostgreSQL, TimescaleDB for time-series data, and Recharts. Custom event pipeline with Redis buffering. Role-based access.",
    result: "Product team now makes data-driven decisions. Identified 3 features driving 60% of retention. Reduced analytics cost by 70% vs Mixpanel.",
    year: 2023,
    role: "Full-stack development",
    image: placeholderHero("SaaS analytics dashboard", "#059669"),
    thumbnail: placeholderThumb("SaaS analytics", "#059669"),
    gallery_images: [placeholderHero("SaaS analytics 1", "#047857"), placeholderHero("SaaS analytics 2", "#065f46"), placeholderHero("SaaS analytics 3", "#064e3b")],
    tech_stack: ["Next.js", "PostgreSQL", "TimescaleDB", "Tailwind", "Recharts", "Redis", "Vercel"],
    github_url: "https://github.com/compiledtech/saas-analytics",
    live_url: "https://analytics.compiled.tech",
    featured: true,
    published: true,
    created_at: "2023-08-10T00:00:00Z",
    updated_at: "2023-08-10T00:00:00Z",
  },
];

function getFallbackProjects(): WorkProject[] {
  return fallbackProjects;
}

function getFallbackFeatured(limit: number): WorkProject[] {
  return fallbackProjects.filter(p => p.featured).slice(0, limit);
}

function getFallbackProject(slug: string): WorkProject | null {
  return fallbackProjects.find(p => p.slug === slug) || null;
}

function getFallbackCategories(): string[] {
  return ["All", ...workCategories];
}

export async function getWorkProjects(category?: string) {
  try {
    let query = supabase
      .from("work_projects")
      .select("*")
      .eq("published", true)
      .order("year", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) return getFallbackProjects().filter(p => !category || category === "All" || p.category === category);
    return (data || []) as WorkProject[];
  } catch {
    return getFallbackProjects().filter(p => !category || category === "All" || p.category === category);
  }
}

export async function getFeaturedWorkProjects(limit = 3) {
  try {
    const { data, error } = await supabase
      .from("work_projects")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("year", { ascending: false })
      .limit(limit);

    if (error) return getFallbackFeatured(limit);
    return (data || []) as WorkProject[];
  } catch {
    return getFallbackFeatured(limit);
  }
}

export async function getWorkProject(slug: string) {
  try {
    const { data, error } = await supabase
      .from("work_projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) return getFallbackProject(slug);
    return data as WorkProject;
  } catch {
    return getFallbackProject(slug);
  }
}

export async function getWorkCategories() {
  try {
    const { error } = await supabase
      .from("work_projects")
      .select("category")
      .eq("published", true);

    if (error) return getFallbackCategories();

    // Always show the full canonical list with "All" first — empty categories are
    // valid (nothing published yet), the chips are navigation not a fallback.
    return ["All", ...workCategories];
  } catch {
    return getFallbackCategories();
  }
}