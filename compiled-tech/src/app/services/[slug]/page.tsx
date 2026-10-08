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
import { pillars } from "@/data/services";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return pillars.map((p) => ({ slug: p.slug }));
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const pillar = pillars.find((p) => p.slug === slug);

  if (!pillar) {
    return null; // will trigger 404
  }

  const howItWorks = [
    { step: 1, title: "Discover", description: "We learn your goals, users, and constraints, then agree on scope and price." },
    { step: 2, title: "Design", description: "Wireframes and a clickable prototype you approve before any code." },
    { step: 3, title: "Build & Launch", description: "Regular demos, testing, deployment, and a handover you can run without us." },
  ];

  const techWeUse = [
    "Next.js", "React", "TypeScript", "Node.js", "Python",
    "PostgreSQL", "Tailwind", "Docker", "Vercel", "AWS"
  ];

  const relatedWork = ["saas-analytics", "service-marketplace", "document-extractor"].slice(0, 2);

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

  return (
    <>
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
              <article key={service.name} id={service.name.toLowerCase().replace(/\s+/g, "-")}>
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
                {relatedWork.map((workSlug) => (
                  <CaseCard key={workSlug} slug={workSlug} />
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
    </>
  );
}