import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/content/SectionHeading";
import { PlusStrip } from "@/components/content/PlusStrip";
import { ServiceTile } from "@/components/cards/ServiceTile";
import { getServiceIcon } from "@/components/content/ServiceIcons";
import { pillars } from "@/data/services";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Footer } from "@/components/layout/Footer";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";
import { slugify } from "@/lib/utils";

export const metadata = generatePageMetadata({
  title: "Web, Mobile, SaaS & AI Development Services",
  description:
    "Web and mobile app development, e-commerce builds, SaaS and custom software, AI chatbots, AI agents, and automation services. See what we build and get a quote.",
  path: "/services",
  type: "website",
  tags: [
    "web development services",
    "mobile app development services",
    "SaaS development services",
    "AI automation services",
    "AI chatbot development services",
    "e-commerce development services",
    "custom software development services",
  ],
});

export default function ServicesPage() {
  const breadcrumbJsonLd = generateJsonLd({
    type: "BreadcrumbList",
    name: "Breadcrumb",
    description: "Breadcrumb navigation",
    url: `${siteConfig.url}/services`,
    items: [{ label: "Home", href: "/" }, { label: "Services" }],
  });

  const servicesJsonLd = pillars.flatMap((pillar) =>
    pillar.services.map((service) =>
      generateJsonLd({
        type: "Service",
        name: service.name,
        description: service.line,
        url: `${siteConfig.url}/services/${pillar.slug}`,
        telephone: siteConfig.phone,
      })
    )
  );

  return (
    <>
      <script
        id="json-ld-services"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [...servicesJsonLd, breadcrumbJsonLd] }) }}
      />
      <PageHero
        title="Services"
        lead="Software and AI, grouped into four pillars."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
      />

      <Section id="services" aria-labelledby="services-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="services-heading"
              eyebrow="SERVICES"
              h2="Four ways we ship software"
              lead="Pick one pillar or combine them. Every project is software only."
              className="mb-12 lg:mb-16"
            />
          </Reveal>

          <div className="space-y-16 lg:space-y-20">
            {pillars.map((pillar, pillarIndex) => (
              <Reveal key={pillar.slug} delay={pillarIndex * 0.1}>
                <section aria-labelledby={`pillar-${pillar.slug}`}>
                  <div className="mb-8">
                    <span className="font-mono text-[0.8rem] text-steel mb-2 block">PILLAR {pillarIndex + 1}</span>
                    <h2
                      id={slugify(pillar.title)}
                      className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.15] mb-2"
                    >
                      {pillar.title}
                    </h2>
                    <p className="text-mist text-[1.125rem] leading-[1.65] max-w-2xl">{pillar.line}</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pillar.services.map((service, i) => (
                      <Reveal key={service.name} delay={i * 0.06}>
                        <ServiceTile
                          name={service.name}
                          line={service.line}
                          icon={getServiceIcon(service.name)}
                          href={`/services/${pillar.slug}`}
                        />
                      </Reveal>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <PlusStrip />
          </Reveal>
        </Container>
      </Section>

      <Footer />
    </>
  );
}