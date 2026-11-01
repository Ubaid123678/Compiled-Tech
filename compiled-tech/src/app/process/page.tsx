"use client";

import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/content/SectionHeading";
import { FAQ } from "@/components/content/FAQ";
import { CTABand } from "@/components/sections/CTABand";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Footer } from "@/components/layout/Footer";
import { processFAQ, processSteps } from "@/data/process";
import {
  generateJsonLd,
  generateFaqJsonLd,
  generateHowToJsonLd,
  generateSpeakableJsonLd,
  siteConfig,
} from "@/lib/seo";

export default function ProcessPage() {
  const processUrl = `${siteConfig.url}/process`;

  const breadcrumbJsonLd = generateJsonLd({
    type: "BreadcrumbList",
    name: "Breadcrumb",
    description: "Breadcrumb navigation",
    url: processUrl,
    items: [{ label: "Home", href: "/" }, { label: "Process" }],
  });

  // The page renders these exact steps and questions, so they get HowTo and
  // FAQPage — previously the FAQs were emitted as Articles, which is wrong.
  const howToJsonLd = generateHowToJsonLd(
    "How Compiled Tech runs a project",
    processSteps.map((step) => ({ title: step.title, text: step.text })),
    processUrl
  );
  const faqJsonLd = generateFaqJsonLd(processFAQ, processUrl, "faq");
  const speakableJsonLd = generateSpeakableJsonLd(processUrl);

  return (
    <>
      <script
        id="json-ld-process"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [breadcrumbJsonLd, howToJsonLd, faqJsonLd, speakableJsonLd] }) }}
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