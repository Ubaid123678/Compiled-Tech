import { PageHero } from "@/components/layout/PageHero";
import { CaseCard } from "@/components/cards/CaseCard";
import { GalleryLightbox } from "@/components/work/GalleryLightbox";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getWorkProject } from "@/lib/work";
import { notFound } from "next/navigation";
import Script from "next/script";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

type WorkProjectPageProps = {
  params: Promise<{ slug: string }>;
}

async function getRelatedProjects(currentSlug: string, currentCategory: string, limit = 3) {
  const supabase = (await import("@supabase/supabase-js")).createClient(
    process.env.SUPABASE_URL || "http://localhost:54321",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy"
  );

  const { data } = await supabase
    .from("work_projects")
    .select("*")
    .eq("published", true)
    .eq("category", currentCategory)
    .neq("slug", currentSlug)
    .order("year", { ascending: false })
    .limit(limit);

  return data || [];
}

export async function generateMetadata({ params }: WorkProjectPageProps) {
  const { slug } = await params;
  
  try {
    const project = await getWorkProject(slug);
    if (!project) {
      return {
        title: "Project Not Found | Compiled Tech",
        description: "The requested project could not be found.",
      };
    }

    return generatePageMetadata({
      title: project.title,
      description: project.excerpt,
      path: `/work/${slug}`,
      type: "website",
    });
  } catch {
    return {
      title: "Project Not Found | Compiled Tech",
      description: "The requested project could not be found.",
    };
  }
}

export default async function WorkProjectPage({ params }: WorkProjectPageProps) {
  const { slug } = await params;

  let project;
  try {
    project = await getWorkProject(slug);
  } catch {
    notFound();
  }

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(slug, project.category);
  const galleryImages = (project.gallery_images || []).filter(
    (image: unknown): image is string => typeof image === "string" && image.length > 0
  );

  const projectJsonLd = generateJsonLd({
    type: "Service",
    name: project.title,
    description: project.excerpt,
    url: `${siteConfig.url}/work/${slug}`,
    telephone: siteConfig.phone,
  });

  const breadcrumbJsonLd = generateJsonLd({
    type: "BreadcrumbList",
    name: "Breadcrumb",
    description: "Breadcrumb navigation",
    url: `${siteConfig.url}/work/${slug}`,
    items: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
      { label: project.category, href: `/work?filter=${project.category}` },
      { label: project.title },
    ],
  });

  return (
    <>
      <Script
        id="json-ld-work"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [projectJsonLd, breadcrumbJsonLd] }) }}
      />
      <PageHero
        title={project.title}
        lead={`${project.category} · ${project.year} · ${project.role}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/work" },
          { label: project.category, href: `/work?filter=${project.category}` },
          { label: project.title },
        ]}
        showHexagon={false}
      />

      <Section id="work-detail" className="pb-12 pt-8 lg:pb-20 lg:pt-12">
        <Container>
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            <article>
              <div className="mb-8">
                <span className="inline-block font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-3">{project.category}</span>
                <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-mist/60 text-sm mb-6">
                  <span>{project.year}</span>
                  <span>·</span>
                  <span>{project.role}</span>
                </div>
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-steel hover:text-frost transition-colors text-sm mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                    GitHub
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-steel hover:text-frost transition-colors text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Live Preview
                  </a>
                )}
              </div>

              <div className="blog-prose max-w-none mt-8">
                <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">The Problem</h2>
                <p className="text-mist text-[1.125rem] leading-[1.65] mb-8">{project.problem}</p>

                <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">What We Built</h2>
                <p className="text-mist text-[1.125rem] leading-[1.65] mb-8">{project.solution}</p>

                <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">Result</h2>
                <p className="text-mist text-[1.125rem] leading-[1.65] mb-8">{project.result}</p>

                <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {project.tech_stack.map((tech: string, index: number) => (
                    <span key={`${tech}-${index}`} className="inline-flex items-center font-body text-[0.8rem] leading-[1.5] px-3 py-1 rounded-[12px] border border-line bg-night text-mist/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <aside className="hidden lg:block sticky top-24 self-start">
              <div className="rounded-[12px] border border-line bg-night p-6">
                <h3 className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-4">Links</h3>
                <div className="space-y-3">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-mist hover:text-frost transition-colors text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                      GitHub Repository
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-mist hover:text-frost transition-colors text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Live Preview
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {galleryImages.length > 0 && (
        <Section id="project-gallery" className="bg-night/50 pb-12 pt-8 lg:pb-20 lg:pt-12">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <span className="font-display text-[0.72rem] uppercase tracking-[0.22em] text-steel">Project gallery</span>
                <h2 className="mt-3 font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-semibold uppercase leading-[1.15] tracking-[0.02em] text-frost">
                  Inside the build
                </h2>
              </div>
              <span className="text-sm text-mist/60">{galleryImages.length} images</span>
            </div>
            <GalleryLightbox images={galleryImages} title={project.title} />
          </Container>
        </Section>
      )}

      {relatedProjects.length > 0 && (
        <Section id="related-work" className="bg-night/50 pb-12 pt-8 lg:pb-20 lg:pt-12">
          <Container>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-8 text-center">
              Related projects
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((related) => (
                <CaseCard key={related.slug} {...related} />
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