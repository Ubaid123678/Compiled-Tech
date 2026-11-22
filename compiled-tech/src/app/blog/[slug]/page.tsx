import { collectArticleHeadings, type ArticleHeading } from "@/lib/article-headings";
import { compileMDX } from "next-mdx-remote/rsc";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { TableOfContents } from "@/components/content/TableOfContents";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { MDXComponents } from "@/components/mdx/MDXComponents";
import { getPublicContentClient } from "@/lib/public-content";
import { getBlogPost } from "@/lib/blog";
import { notFound } from "next/navigation";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
}

async function getRelatedPosts(currentSlug: string, currentCategory: string, limit = 3) {
  try {
    const { data, error } = await getPublicContentClient()
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .eq("category", currentCategory)
      .neq("slug", currentSlug)
      .order("date", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Blog related-posts query failed:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Blog related-posts lookup failed:", error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  const post = await getBlogPost(slug);
  if (!post) return { robots: { index: false } };

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
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const headings: ArticleHeading[] = [];
  let content;
  try {
    ({ content } = await compileMDX({
      source: post.content,
      components: MDXComponents,
      options: {
        parseFrontmatter: true,
        mdxOptions: { remarkPlugins: [collectArticleHeadings(headings)] },
      },
    }));
  } catch (error) {
    console.error(`Blog post MDX compilation failed for "${slug}":`, error);
    throw new Error("This article could not be rendered");
  }

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
    items: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: post.category, href: `/blog?filter=${encodeURIComponent(post.category)}` },
      { label: post.title },
    ],
  });

  return (
    <>
      <main id="main" tabIndex={-1}>
        <script
          id="json-ld-article"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [articleJsonLd, breadcrumbJsonLd] }) }}
        />
        <PageHero
          title={post.title}
          lead={`${post.date} · ${post.read_time || ""} · ${post.author}`}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.category, href: `/blog?filter=${encodeURIComponent(post.category)}` },
            { label: post.title },
          ]}
          showHexagon={false}
        />

        <Section id="blog-post" className="pb-12 pt-8 lg:pb-20 lg:pt-12">
          <Container>
            <div className="grid lg:grid-cols-[1fr_280px] gap-12">
              <article>
                {post.image && (
                  <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[20px] border border-line">
                    <Image src={post.image} alt="" fill loading="eager" className="object-cover" sizes="(max-width: 1024px) 100vw, 760px" />
                  </div>
                )}

                <div className="blog-prose text-mist text-[1.125rem] leading-[1.65]">
                  {content}
                </div>
              </article>

              <aside className="order-first self-start lg:sticky lg:top-24 lg:order-none">
                <TableOfContents items={headings} />
              </aside>
            </div>
          </Container>
        </Section>

        {relatedPosts.length > 0 && (
          <Section id="related-posts" className="bg-night/50 pb-12 pt-8 lg:pb-20 lg:pt-12">
            <Container>
              <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-8 text-center">
                Related posts
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  // featured={false}: the DB flag would switch ArticleCard to the
                  // full-width layout and break this 3-column grid.
                  <ArticleCard key={related.slug} {...related} readTime={related.read_time} featured={false} />
                ))}
              </div>
            </Container>
          </Section>
        )}

        <CTABand />
      </main>
      <Footer />
    </>
  );
}