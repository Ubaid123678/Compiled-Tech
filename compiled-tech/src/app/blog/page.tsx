"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageHero";
import { FilterChips } from "@/components/content/FilterChips";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import Script from "next/script";
import { generateJsonLd, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  featured: boolean;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          fetch("/api/blog"),
          fetch("/api/blog?category=All"),
        ]);
        const [postsData, catsData] = await Promise.all([
          postsRes.json(),
          catsRes.json(),
        ]);
        setPosts(postsData.posts || []);
        setCategories(catsData.categories || ["All"]);
      } catch (err) {
        console.error("Failed to fetch blog data:", err);
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
        const res = await fetch(`/api/blog?category=${encodeURIComponent(activeFilter)}`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Failed to fetch filtered posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiltered();
  }, [activeFilter]);

  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  const blogPostsJsonLd = posts.map((post) =>
    generateJsonLd({
      type: "Article",
      name: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      author: post.author,
      datePublished: post.date,
      dateModified: post.date,
      headline: post.title,
      articleSection: post.category,
      keywords: [post.category],
    })
  );

  if (loading) {
    return (
      <>
        <PageHero
          title="Insights"
          lead="Notes on software and AI from the Compiled Tech team."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog" },
          ]}
        />
        <Section className="py-16 lg:py-26">
          <Container>
            <div className="animate-pulse space-y-12">
              <div className="h-64 bg-slate/50 rounded-[20px]" />
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
      <Script
        id="json-ld-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": blogPostsJsonLd }) }}
      />
      <PageHero
        title="Insights"
        lead="Notes on software and AI from the Compiled Tech team."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />

      <Section id="blog" className="py-16 lg:py-26">
        <Container>
          <FilterChips
            filters={categories}
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />

          <div className="space-y-12">
            {featuredPost && (
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <ArticleCard {...featuredPost} featured />
              </motion.article>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              layout
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ArticleCard {...post} />
                  </motion.article>
                ))}
              </div>

              {regularPosts.length === 0 && (
                <p className="text-center text-mist/60 text-[1.125rem] leading-[1.65] py-12">
                  No projects in this category yet.
                </p>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>

      <CTABand />
      <Footer />
    </>
  );
}