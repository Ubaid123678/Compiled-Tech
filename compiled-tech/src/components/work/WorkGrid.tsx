"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FilterChips } from "@/components/content/FilterChips";
import { CaseCard } from "@/components/cards/CaseCard";
import { Container } from "@/components/layout/Container";

export type CaseStudy = {
  slug: string;
  title: string;
  category: "Web" | "Mobile" | "AI";
  excerpt: string;
  year: number;
  role: string;
  image: string;
  thumbnail: string;
  featured?: boolean;
};

// Receives all published projects from the server page and filters locally —
// no API round-trip on category change.
export function WorkGrid({ projects, categories }: { projects: CaseStudy[]; categories: string[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const visible =
    activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  // Same treatment as the blog list: the featured project gets the full-width
  // two-column CaseCard at the top; everything else fills the grid below.
  // ponytail: only in the "All" view — with one project per category the
  // full-width card IS the grid, so featuring inside a category adds nothing.
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
            <CaseCard {...featured} featured />
          </motion.article>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          layout
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regular.map((project, index) => (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <CaseCard {...project} featured={false} />
              </motion.article>
            ))}
          </div>

          {regular.length === 0 && !featured && (
            <p className="text-center text-mist/60 text-[1.125rem] leading-[1.65] py-12">
              No projects in this category yet.
            </p>
          )}
        </motion.div>
      </div>
    </Container>
  );
}
