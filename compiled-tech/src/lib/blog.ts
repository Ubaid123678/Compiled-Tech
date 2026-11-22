import { cache } from "react";
import { blogCategories } from "@/data/blog";
import { contentFailure, getPublicContentClient } from "./public-content";

export const getBlogPosts = cache(async (category?: string) => {
  const client = getPublicContentClient();
  const run = (withSortOrder: boolean) => {
    let query = client.from("blog_posts").select("*").eq("published", true);
    if (withSortOrder) query = query.order("sort_order", { ascending: true });
    query = query.order("date", { ascending: false }).order("slug");
    if (category && category !== "All") query = query.eq("category", category);
    return query;
  };

  let { data, error } = await run(true);
  if (error?.code === "42703") ({ data, error } = await run(false));
  if (error) contentFailure("blog posts", error);
  return data || [];
});

export const getBlogPost = cache(async (slug: string) => {
  const { data, error } = await getPublicContentClient()
    .from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) contentFailure("blog post", error);
  return data;
});

export async function getBlogCategories() {
  const posts = await getBlogPosts();
  const actual = new Set<string>(posts.map((post) => post.category));
  const ordered = blogCategories.filter((category) => category !== "All" && actual.delete(category));
  return ["All", ...ordered, ...[...actual].sort()];
}
