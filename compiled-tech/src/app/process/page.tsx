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

export default function ProcessPage() {
  return (
    <>
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