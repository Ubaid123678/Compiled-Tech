import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/lib/blog";
import { getWorkProjects } from "@/lib/work";
import { siteConfig } from "@/lib/seo";

// Rebuild hourly so posts/projects published via /admin appear without a redeploy.
// ponytail: 1h staleness window; lower it if new pages must surface faster.
export const revalidate = 3600;

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/contact",
  "/privacy",
  "/pricing",
  "/process",
  "/services",
  "/terms",
  "/work",
  "/services/build",
  "/services/ai-ml",
  "/services/automate-analyze",
  "/services/advise-support",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = staticRoutes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  // Live content, not the static seed files, so anything published in /admin is indexed.
  const [posts, projects] = await Promise.all([
    getBlogPosts().catch(() => []),
    getWorkProjects().catch(() => []),
  ]);

  const blogRoutes = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const workRoutes = projects.map((project) => ({
    url: `${siteConfig.url}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes, ...workRoutes];
}
