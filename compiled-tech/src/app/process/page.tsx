"use client";

import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/content/SectionHeading";
import { FAQ } from "@/components/content/FAQ";
import { CTABand } from "@/components/sections/CTABand";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Footer } from "@/components/layout/Footer";
import { processFAQ } from "@/data/process";
import { generateJsonLd, siteConfig } from "@/lib/seo";

export default function ProcessPage() {
  const processStepsJsonLd = [
    { step: 1, title: "Discover", description: "We learn your goals, users, and constraints, then agree on scope and price." },
    { step: 2, title: "Design", description: "Wireframes and a clickable prototype you approve before any code." },
    { step: 3, title: "Build", description: "Regular demos, testing, deployment, and a handover you can run without us." },
    { step: 4, title: "Launch", description: "Testing, deployment, and a handover you can run without us." },
    { step: 5, title: "Support", description: "Fixes, updates, and new features after go-live." },
  ].map((step) =>
    generateJsonLd({
      type: "Service",
      name: `Step ${step.step}: ${step.title}`,
      description: step.description,
      url: `${siteConfig.url}/process`,
      telephone: siteConfig.phone,
    })
  );

  const faqJsonLd = processFAQ.map((faq) =>
    generateJsonLd({
      type: "Article",
      name: `FAQ: ${faq.q}`,
      description: faq.a,
      url: `${siteConfig.url}/process#faq`,
      headline: faq.q,
      articleSection: "FAQ",
    })
  );

  return (
    <>
      <script
        id="json-ld-process"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [...processStepsJsonLd, ...faqJsonLd] }) }}
      />
      <PageHero
        title="How we work"
        lead="Five steps, the same on every project."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Process" },
        ]}
      />

      <ProcessTimeline />

      <Section id="faq" aria-labelledby="faq-heading" className="bg-night/50">
        <Container>
          <SectionHeading
            id="faq-heading"
            h2="Common Questions"
            className="mb-10"
          />
          <FAQ items={processFAQ} />
        </Container>
      </Section>

      <CTABand />
      <Footer />
    </>
  );
}