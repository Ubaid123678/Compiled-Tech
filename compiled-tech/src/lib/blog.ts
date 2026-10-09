import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "http://localhost:54321",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy"
);

export async function getBlogPosts(category?: string) {
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) throw error;
  return data;
}

export async function getBlogCategories() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("category")
    .eq("published", true);

  if (error) throw error;
  
  const categories = [...new Set(data?.map((p) => p.category) || [])];
  return ["All", ...categories.sort()];
}