import { PageHero } from "@/components/layout/PageHero";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { getBlogPosts, getBlogCategories } from "@/lib/blog";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Was missing entirely: the page inherited the layout default and rendered
// "<default title> | Compiled Tech" — duplicated brand name, generic description.
export const metadata = generatePageMetadata({
  title: "Blog — Software, AI & Development Guides",
  description:
    "Practical notes from the Compiled Tech team: AI chatbots, RAG, Next.js, TypeScript, and how to scope and ship software projects without surprises.",
  path: "/blog",
  type: "website",
  tags: [
    "software development blog",
    "AI development guides",
    "Next.js tutorials",
    "hire software developer tips",
    "AI chatbot development guide",
  ],
});

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getBlogPosts(), getBlogCategories()]);

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

  return (
    <>
      <script
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

      <Section id="blog" className="pb-12 pt-8 lg:pb-20 lg:pt-12">
        <BlogGrid posts={posts} categories={categories} />
      </Section>

      <CTABand />
      <Footer />
    </>
  );
}
