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
};

// Receives all published projects from the server page and filters locally —
// no API round-trip on category change.
export function WorkGrid({ projects, categories }: { projects: CaseStudy[]; categories: string[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const visible =
    activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <Container>
      <FilterChips
        filters={categories}
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        layout
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) => (
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

        {visible.length === 0 && (
          <p className="text-center text-mist/60 text-[1.125rem] leading-[1.65] py-12">
            No projects in this category yet.
          </p>
        )}
      </motion.div>
    </Container>
  );
}
