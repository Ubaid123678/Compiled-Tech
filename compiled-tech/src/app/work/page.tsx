import { PageHero } from "@/components/layout/PageHero";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { WorkGrid } from "@/components/work/WorkGrid";
import { getWorkProjects, getWorkCategories } from "@/lib/work";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";
import Script from "next/script";

// Reuse generatePageMetadata so work gets the same canonical/OG/Twitter tags.
// ponytail: keywords need matching on-page copy; titles/description carry them.
export const metadata = generatePageMetadata({
  title: "Our Work — Web, Mobile & AI Projects",
  description:
    "Case studies of shipped work: e-commerce stores, business web apps, AI systems, and mobile apps built by Compiled Tech. See the results our clients got.",
  path: "/work",
  type: "website",
  tags: [
    "software development portfolio",
    "web development case studies",
    "mobile app projects",
    "AI development projects",
    "e-commerce website development",
  ],
});

export default async function WorkPage() {
  const [projects, categories] = await Promise.all([getWorkProjects(), getWorkCategories()]);

  const workJsonLd = projects.map((project) =>
    generateJsonLd({
      type: "Service",
      name: project.title,
      description: project.excerpt,
      url: `${siteConfig.url}/work/${project.slug}`,
    })
  );

  return (
    <>
      <Script
        id="json-ld-work"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": workJsonLd }) }}
      />
      <PageHero
        title="Work"
        lead="Projects we have built and shipped."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Work" },
        ]}
      />
      <Section id="work" className="pb-12 pt-8 lg:pb-20 lg:pt-12">
        <WorkGrid projects={projects} categories={categories} />
      </Section>
      <CTABand />
      <Footer />
    </>
  );
}
