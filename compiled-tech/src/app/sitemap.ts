import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { featuredWork } from "@/data/work";
import { siteConfig } from "@/lib/seo";

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/contact",
  "/privacy",
  "/process",
  "/services",
  "/terms",
  "/work",
  "/services/build",
  "/services/ai-ml",
  "/services/automate-analyze",
  "/services/advise-support",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = staticRoutes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const workRoutes = featuredWork.map((project) => ({
    url: `${siteConfig.url}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes, ...workRoutes];
}
