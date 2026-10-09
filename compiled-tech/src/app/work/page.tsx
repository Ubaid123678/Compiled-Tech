"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageHero";
import { FilterChips } from "@/components/content/FilterChips";
import { CaseCard } from "@/components/cards/CaseCard";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const dynamic = "force-dynamic";

type WorkProject = {
  slug: string;
  title: string;
  category: "Web" | "Mobile" | "AI";
  excerpt: string;
  year: number;
  role: string;
  image: string;
  thumbnail: string;
  featured: boolean;
};

export default function WorkPage() {
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, catsRes] = await Promise.all([
          fetch("/api/work"),
          fetch("/api/work?category=All"),
        ]);
        const [projectsData, catsData] = await Promise.all([
          projectsRes.json(),
          catsRes.json(),
        ]);
        setProjects(projectsData.projects || []);
        setCategories(catsData.categories || ["All"]);
      } catch (err) {
        console.error("Failed to fetch work data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/work?category=${encodeURIComponent(activeFilter)}`);
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error("Failed to fetch filtered projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiltered();
  }, [activeFilter]);

  if (loading) {
    return (
      <>
        <PageHero
          title="Work"
          lead="Projects we have built and shipped."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Work" },
          ]}
        />
        <Section className="py-16 lg:py-26">
          <Container>
            <div className="animate-pulse space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-slate/50 rounded-[20px]" />
                ))}
              </div>
            </div>
          </Container>
        </Section>
        <CTABand />
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Work"
        lead="Projects we have built and shipped."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Work" },
        ]}
      />

      <Section id="work" className="py-16 lg:py-26">
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
              {projects.map((project, index) => (
                <motion.article
                  key={project.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CaseCard {...project} />
                </motion.article>
              ))}
            </div>

            {projects.length === 0 && (
              <p className="text-center text-mist/60 text-[1.125rem] leading-[1.65] py-12">
                No projects in this category yet.
              </p>
            )}
          </motion.div>
        </Container>
      </Section>

      <CTABand />
      <Footer />
    </>
  );
}