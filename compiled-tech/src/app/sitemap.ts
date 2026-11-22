import type { MetadataRoute } from "next";
import { pillars } from "@/data/services";
import { getBlogPosts } from "@/lib/blog";
import { getWorkProjects } from "@/lib/work";
import { siteConfig } from "@/lib/seo";

export const revalidate = 3600;

const staticRoutes = [
  "/", "/about", "/blog", "/contact", "/privacy", "/pricing", "/process",
  "/services", "/terms", "/work", ...pillars.map(({ slug }) => `/services/${slug}`),
];

function lastModified(value: unknown): string | undefined {
  return typeof value === "string" && Number.isFinite(Date.parse(value))
    ? new Date(value).toISOString()
    : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getBlogPosts(), getWorkProjects()]);
  return [
    ...staticRoutes.map((path) => ({ url: `${siteConfig.url}${path}` })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: lastModified(post.updated_at) ?? lastModified(post.date),
    })),
    ...projects.map((project) => ({
      url: `${siteConfig.url}/work/${encodeURIComponent(project.slug)}`,
      lastModified: lastModified(project.updated_at),
    })),
  ];
}
