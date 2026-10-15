"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FilterChips } from "@/components/content/FilterChips";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Container } from "@/components/layout/Container";

export type Post = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  read_time?: string;
  author: string;
  image: string;
  featured: boolean;
};

// Receives all published posts from the server page and filters locally — no API
// round-trip on category change. Featured post renders full-width on top, same
// pattern as the Work page.
export function BlogGrid({ posts, categories }: { posts: Post[]; categories: string[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const visible =
    activeFilter === "All" ? posts : posts.filter((p) => p.category === activeFilter);

  // First featured post wins the hero slot (matches the blog list behavior);
  // ponytail: only in the "All" view — inside a single category the full-width
  // card would BE the grid, so promoting adds nothing there.
  const featured = activeFilter === "All" ? visible.find((p) => p.featured) : undefined;
  const regular = featured ? visible.filter((p) => p.slug !== featured.slug) : visible;

  return (
    <Container>
      <FilterChips
        filters={categories}
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />

      <div className="space-y-12">
        {featured && (
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ArticleCard
              slug={featured.slug}
              title={featured.title}
              category={featured.category}
              excerpt={featured.excerpt}
              date={featured.date}
              readTime={featured.read_time || featured.readTime || ""}
              author={featured.author}
              image={featured.image}
              featured
            />
          </motion.article>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          layout
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regular.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <ArticleCard
                  slug={post.slug}
                  title={post.title}
                  category={post.category}
                  excerpt={post.excerpt}
                  date={post.date}
                  readTime={post.read_time || post.readTime || ""}
                  author={post.author}
                  image={post.image}
                />
              </motion.article>
            ))}
          </div>

          {regular.length === 0 && !featured && (
            <p className="text-center text-mist/60 text-[1.125rem] leading-[1.65] py-12">
              No posts in this category yet.
            </p>
          )}
        </motion.div>
      </div>
    </Container>
  );
}
