import { compileMDX } from "next-mdx-remote/rsc";
import { PageHero } from "@/components/layout/PageHero";
import { TableOfContents } from "@/components/content/TableOfContents";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { MDXComponents } from "@/components/mdx/MDXComponents";
import { getBlogPost } from "@/lib/blog";
import { notFound } from "next/navigation";
import Script from "next/script";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
}

function extractHeadings(content: string) {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const lines = content.split("\n");
  
  lines.forEach((line) => {
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);
    
    if (h2Match) {
      const text = h2Match[1].trim();
      headings.push({
        id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        text,
        level: 2,
      });
    } else if (h3Match) {
      const text = h3Match[1].trim();
      headings.push({
        id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        text,
        level: 3,
      });
    }
  });
  
  return headings;
}

async function getRelatedPosts(currentSlug: string, currentCategory: string, limit = 3) {
  const supabase = (await import("@supabase/supabase-js")).createClient(
    process.env.SUPABASE_URL || "http://localhost:54321",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy"
  );

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .eq("category", currentCategory)
    .neq("slug", currentSlug)
    .order("date", { ascending: false })
    .limit(limit);

  return data || [];
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  try {
    const post = await getBlogPost(slug);
    if (!post) {
      return {
        title: "Post Not Found | Compiled Tech",
        description: "The requested blog post could not be found.",
      };
    }

    return generatePageMetadata({
      title: post.title,
      description: post.excerpt,
      path: `/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      tags: [post.category],
    });
  } catch {
    return {
      title: "Post Not Found | Compiled Tech",
      description: "The requested blog post could not be found.",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogPost(slug);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    components: MDXComponents,
    options: { parseFrontmatter: true },
  });

  const headings = extractHeadings(post.content);
  const relatedPosts = await getRelatedPosts(slug, post.category);

  const articleJsonLd = generateJsonLd({
    type: "Article",
    name: post.title,
    description: post.excerpt,
    url: `${siteConfig.url}/blog/${slug}`,
    author: post.author,
    datePublished: post.date,
    dateModified: post.date,
    headline: post.title,
    articleSection: post.category,
    keywords: [post.category],
  });

  const breadcrumbJsonLd = generateJsonLd({
    type: "BreadcrumbList",
    name: "Breadcrumb",
    description: "Breadcrumb navigation",
    url: `${siteConfig.url}/blog/${slug}`,
  });

  return (
    <>
      <Script
        id="json-ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [articleJsonLd, breadcrumbJsonLd] }) }}
      />
      <PageHero
        title={post.title}
        lead={`${post.date} · ${post.readTime} · ${post.author}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.category, href: `/blog?filter=${post.category}` },
          { label: post.title },
        ]}
        showHexagon={false}
      />

      <Section id="blog-post" className="py-16 lg:py-26">
        <Container>
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            <article>
              <div className="mb-8">
                <span className="inline-block font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-3">{post.category}</span>
                <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-mist/60 text-sm">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    {post.readTime}
                  </span>
                  <span>·</span>
                  <span>{post.author}</span>
                </div>
              </div>

              <div className="text-mist text-[1.125rem] leading-[1.65]">
                {content}
              </div>
            </article>

            <aside className="hidden lg:block sticky top-24 self-start">
              <TableOfContents items={headings} />
            </aside>
          </div>
        </Container>
      </Section>

      {relatedPosts.length > 0 && (
        <Section id="related-posts" className="bg-night/50 py-16 lg:py-26">
          <Container>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-8 text-center">
              Related posts
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <ArticleCard key={related.slug} {...related} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CTABand />
      <Footer />
    </>
  );
}