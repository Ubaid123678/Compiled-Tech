import { createClient } from "@supabase/supabase-js";

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

function handleError(error: any, fallback: any) {
  console.error("Work API error:", error?.message || error);
  return fallback;
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
    if (error) return handleError(error, []);
    return (data || []) as WorkProject[];
  } catch (error) {
    return handleError(error, []);
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

    if (error) return handleError(error, []);
    return (data || []) as WorkProject[];
  } catch (error) {
    return handleError(error, []);
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

    if (error) return handleError(error, null);
    return data as WorkProject;
  } catch (error) {
    return handleError(error, null);
  }
}

export async function getWorkCategories() {
  try {
    const { data, error } = await supabase
      .from("work_projects")
      .select("category")
      .eq("published", true);

    if (error) return handleError(error, ["All"]);
    
    const categories = [...new Set(data?.map((p) => p.category) || [])];
    return ["All", ...categories.sort()];
  } catch (error) {
    return handleError(error, ["All"]);
  }
}