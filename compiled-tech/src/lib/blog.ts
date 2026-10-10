import { createClient } from "@supabase/supabase-js";
import { blogCategories } from "@/data/blog";

const supabase = createClient(
  process.env.SUPABASE_URL || "http://localhost:54321",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy"
);

const allowedCategories = blogCategories.filter((category) => category !== "All");

function handleError<T>(error: unknown, fallback: T): T {
  console.error("Blog API error:", error instanceof Error ? error.message : error);
  return fallback;
}

export async function getBlogPosts(category?: string) {
  try {
    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .in("category", allowedCategories)
      .order("date", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) return handleError(error, []);
    return data || [];
  } catch (error) {
    return handleError(error, []);
  }
}

export async function getBlogPost(slug: string) {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) return handleError(error, null);
    return data;
  } catch (error) {
    return handleError(error, null);
  }
}

export async function getBlogCategories() {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("category")
      .eq("published", true)
      .in("category", allowedCategories);

    if (error) return handleError(error, ["All"]);
    
    const categories = new Set(data?.map((p) => p.category) || []);
    return ["All", ...allowedCategories.filter((category) => categories.has(category))];
  } catch (error) {
    return handleError(error, ["All"]);
  }
}