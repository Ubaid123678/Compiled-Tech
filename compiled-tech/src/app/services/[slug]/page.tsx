import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/content/SectionHeading";
import { ServiceTile } from "@/components/cards/ServiceTile";
import { getServiceIcon } from "@/components/content/ServiceIcons";
import { CaseCard } from "@/components/cards/CaseCard";
import { FAQ } from "@/components/content/FAQ";
import { PlusStrip } from "@/components/content/PlusStrip";
import { CTABand } from "@/components/sections/CTABand";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Chip } from "@/components/content/Chip";
import { Footer } from "@/components/layout/Footer";
import { pillars } from "@/data/services";
import { Suspense } from "react";
import Script from "next/script";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";
import { getWorkProjects } from "@/lib/work";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return pillars.map((p) => ({ slug: p.slug }));
}

async function getRelatedWork(serviceSlug: string) {
  const projects = await getWorkProjects();
  const categoryMap: Record<string, Array<"Web" | "Mobile" | "AI">> = {
    build: ["Web", "Mobile"],
    "ai-ml": ["AI"],
    "automate-analyze": ["AI", "Web"],
    "advise-support": ["Web", "Mobile", "AI"],
  };
  const categories = categoryMap[serviceSlug] || ["Web", "Mobile", "AI"];
  const related = projects.filter((project) => categories.includes(project.category));
  return (related.length > 0 ? related : projects).slice(0, 2);
}

function serviceAnchor(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function ServiceDetailContent({ slug }: { slug: string }) {
  const pillar = pillars.find((p) => p.slug === slug);

  if (!pillar) {
    return null;
  }

  const howItWorks = [
    { step: 1, title: "Discover", description: "We learn your goals, users, and constraints, then agree on scope and price." },
    { step: 2, title: "Design", description: "Wireframes and a clickable prototype you approve before any code." },
    { step: 3, title: "Build & Launch", description: "Regular demos, testing, deployment, and a handover you can run without us." },
  ];

  const techWeUse = [
    "React", "Next.js", "TypeScript", "Node.js", "Python",
    "Flutter", "React Native", "Angular", "Laravel",
    "MongoDB", "MySQL", "PostgreSQL"
  ];

  const relatedProjects = await getRelatedWork(slug);

  const faq = [
    {
      q: `How long does a ${pillar.title.toLowerCase()} project take?`,
      a: "Typically 4–12 weeks for build phase, depending on scope. We agree on timeline upfront."
    },
    {
      q: "Do you provide ongoing support after launch?",
      a: "Yes. Our Advise and Support pillar covers maintenance, monitoring, and iterative improvements."
    },
    {
      q: "Can you integrate with our existing systems?",
      a: "Absolutely. We build APIs and connectors for your current stack — CRM, ERP, databases, or custom software."
    },
    {
      q: "What's your pricing model?",
      a: "Fixed-price for defined scope, or time-and-materials for exploratory work. We always provide a written estimate before starting."
    },
  ];

  const servicesJsonLd = pillar.services.map((service) =>
    generateJsonLd({
      type: "Service",
      name: service.name,
      description: service.line,
      url: `${siteConfig.url}/services/${pillar.slug}#${service.name.toLowerCase().replace(/\s+/g, "-")}`,
      telephone: siteConfig.phone,
    })
  );

  const breadcrumbJsonLd = generateJsonLd({
    type: "BreadcrumbList",
    name: "Breadcrumb",
    description: "Breadcrumb navigation",
    url: `${siteConfig.url}/services/${pillar.slug}`,
    items: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: pillar.title },
    ],
  });

  return (
    <>
      <Script
        id="json-ld-services"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [...servicesJsonLd, breadcrumbJsonLd] }) }}
      />
      <PageHero
        title={pillar.title}
        lead={pillar.line}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: pillar.title },
        ]}
      />

      <Section id="services" aria-labelledby="services-heading">
        <Container>
          <div className="space-y-16 lg:space-y-20">
            {pillar.services.map((service) => (
                <article key={service.name} id={serviceAnchor(service.name)}>
                <ServiceTile
                  name={service.name}
                  line={service.line}
                  icon={getServiceIcon(service.name)}
                />
              </article>
            ))}

            <div className="pt-8 border-t border-line">
              <SectionHeading
                id="how-it-works"
                eyebrow="PROCESS"
                h2="How it works"
                className="mb-10"
              />
              <div className="grid gap-6 sm:grid-cols-3">
                {howItWorks.map((step) => (
                  <div key={step.step} className="rounded-[20px] border border-line bg-night p-6">
                    <span className="font-mono text-[0.8rem] text-steel mb-2 block">STEP {step.step}</span>
                    <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.15rem] leading-[1.3] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-mist text-base leading-[1.6]">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-line">
              <SectionHeading
                id="tech-we-use"
                eyebrow="TECHNOLOGY"
                h2="Tech we use"
                className="mb-6"
              />
              <div className="flex flex-wrap gap-3">
                {techWeUse.map((tech) => (
                  <Chip key={tech} variant="default">{tech}</Chip>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-line">
              <SectionHeading
                id="related-work"
                eyebrow="WORK"
                h2="Related projects"
                className="mb-8"
              />
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedProjects.map((project) => (
                  <CaseCard
                    key={project.slug}
                    slug={project.slug}
                    title={project.title}
                    category={project.category}
                    excerpt={project.excerpt}
                    year={project.year}
                    role={project.role}
                    image={project.image}
                    thumbnail={project.thumbnail}
                    featured={false}
                  />
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-line">
              <FAQ items={faq} />
            </div>
          </div>

          <PlusStrip />
        </Container>
      </Section>

      <CTABand />
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const pillar = pillars.find((p) => p.slug === slug);

  if (!pillar) {
    return generatePageMetadata({
      title: "Service Not Found",
      description: "The requested service could not be found.",
      path: `/services/${slug}`,
    });
  }

  return generatePageMetadata({
    title: pillar.title,
    description: pillar.line,
    path: `/services/${slug}`,
    type: "website",
  });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="py-16 lg:py-26" />}>
      <ServiceDetailContent slug={slug} />
    </Suspense>
  );
}