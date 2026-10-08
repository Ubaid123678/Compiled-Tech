import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/content/SectionHeading";
import { PlusStrip } from "@/components/content/PlusStrip";
import { ServiceTile } from "@/components/cards/ServiceTile";
import { getServiceIcon } from "@/components/content/ServiceIcons";
import { pillars, plusStrip } from "@/data/services";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export default function ServicesPage() {
  return (
    <>
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
          <SectionHeading
            id="services-heading"
            eyebrow="SERVICES"
            h2="Four ways we ship software"
            lead="Pick one pillar or combine them. Every project is software only."
            className="mb-12 lg:mb-16"
          />

          <div className="space-y-16 lg:space-y-20">
            {pillars.map((pillar, pillarIndex) => (
              <section key={pillar.slug} aria-labelledby={`pillar-${pillar.slug}`}>
                <div className="mb-8">
                  <span className="font-mono text-[0.8rem] text-steel mb-2 block">PILLAR {pillarIndex + 1}</span>
                  <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.15] mb-2">
                    {pillar.title}
                  </h2>
                  <p className="text-mist text-[1.125rem] leading-[1.65] max-w-2xl">{pillar.line}</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pillar.services.map((service, i) => (
                    <ServiceTile
                      key={service.name}
                      name={service.name}
                      line={service.line}
                      icon={getServiceIcon(service.name)}
                      href={`/services/${pillar.slug}#${service.name.toLowerCase().replace(/\s+/g, "-")}`}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <PlusStrip />
        </Container>
      </Section>
    </>
  );
}