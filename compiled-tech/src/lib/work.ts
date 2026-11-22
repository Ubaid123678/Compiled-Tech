import { cache } from "react";
import { workCategories, type WorkCategory } from "@/data/work";
import { contentFailure, getPublicContentClient } from "./public-content";

export type WorkProject = {
  id: string;
  slug: string;
  title: string;
  category: WorkCategory;
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

async function listProjects({ category, featured, limit }: { category?: string; featured?: boolean; limit?: number }) {
  const client = getPublicContentClient();
  const run = (withSortOrder: boolean) => {
    let query = client.from("work_projects").select("*").eq("published", true);
    if (withSortOrder) query = query.order("sort_order", { ascending: true });
    query = query.order("year", { ascending: false }).order("slug");
    if (category && category !== "All") query = query.eq("category", category);
    if (featured) query = query.eq("featured", true);
    if (limit !== undefined) query = query.limit(limit);
    return query;
  };

  let { data, error } = await run(true);
  if (error?.code === "42703") ({ data, error } = await run(false));
  if (error) contentFailure("projects", error);
  return (data || []) as WorkProject[];
}

export const getWorkProjects = cache((category?: string) => listProjects({ category }));

export function getFeaturedWorkProjects(limit = 3) {
  return listProjects({ featured: true, limit });
}

export const getWorkProject = cache(async (slug: string) => {
  const { data, error } = await getPublicContentClient()
    .from("work_projects").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) contentFailure("project", error);
  return data as WorkProject | null;
});

export function getWorkCategories() {
  return ["All", ...workCategories];
}
