import { createClient, type PostgrestError } from "@supabase/supabase-js";
import { blogCategories } from "@/data/blog";

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase blog configuration is missing.");
  }

  return createClient(url, key);
}

const allowedCategories = blogCategories.filter((category) => category !== "All");

function handleError<T>(error: unknown, fallback: T): T {
  const details = error as Partial<PostgrestError> & { message?: string };
  console.error("Blog API error:", {
    message: details.message || (error instanceof Error ? error.message : "Unknown blog query error"),
    code: details.code,
    details: details.details,
    hint: details.hint,
  });
  return fallback;
}

export async function getBlogPosts(category?: string) {
  try {
    const run = (orderBy: "sort_order" | "date") => {
      let query = getSupabase()
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .in("category", allowedCategories)
        .order(orderBy, { ascending: orderBy === "sort_order" })
        .order("date", { ascending: false });
      if (category && category !== "All") {
        query = query.eq("category", category);
      }
      return query;
    };

    let { data, error } = await run("sort_order");

    // Deploy-order safety: the sort_order column is added by a SQL migration.
    // If the code ships before the migration, fall back to date ordering
    // instead of silently showing an empty blog.
    if (error?.code === "42703") {
      ({ data, error } = await run("date"));
    }

    if (error) return handleError(error, []);
    return data || [];
  } catch (error) {
    return handleError(error, []);
  }
}

export async function getBlogPost(slug: string) {
  try {
    const { data, error } = await getSupabase()
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) return handleError(error, null);
    return data;
  } catch (error) {
    return handleError(error, null);
  }
}

export async function getBlogCategories() {
  try {
    const { data, error } = await getSupabase()
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