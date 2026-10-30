import { Hero } from "@/components/hero/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTABand } from "@/components/sections/CTABand";
import { SectionHeading } from "@/components/content/SectionHeading";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { PricingCards } from "@/components/sections/PricingCards";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";
import { pricingTiers } from "@/data/pricing";

// Reuse generatePageMetadata so home gets the same canonical/OG/Twitter tags every other page gets.
// ponytail: visible page copy (hero, services list) is what actually ranks for these
// keywords; the tags below just point Google at it consistently.
export const metadata = generatePageMetadata({
  title: "Software, Web & AI Development Company",
  description:
    "Custom web apps, mobile apps, SaaS platforms, and AI automation for startups and growing teams. Hire a four-person team that ships. Get a quote today.",
  path: "/",
  type: "website",
  tags: [
    "software development company",
    "web app development",
    "mobile app development",
    "AI automation agency",
    "SaaS development company",
    "custom software development",
    "AI chatbot development",
    "e-commerce development",
  ],
});

export default function Home() {
  const servicesJsonLd = [
    "Web & Mobile App Development",
    "SaaS & Custom Software Development",
    "E-commerce Development",
    "Custom AI & Machine Learning",
    "AI Chatbots & Virtual Assistants",
    "AI Data & Document Processing",
    "AI Automation & AI Agents",
    "AI Consulting",
    "Training Workshops",
    "Maintenance and Support",
  ].map((serviceName) => 
    generateJsonLd({
      type: "Service",
      name: serviceName,
      description: `Professional ${serviceName.toLowerCase()} services by Compiled Tech.`,
      url: `${siteConfig.url}/services`,
      telephone: siteConfig.phone,
    })
  );

  // Prices on the homepage as Offer schema — readable without JS or a login.
  const pricingJsonLd = pricingTiers.map((tier) => ({
    "@type": "Offer",
    name: tier.name,
    description: tier.summary,
    price: tier.from,
    priceCurrency: tier.currency,
    url: `${siteConfig.url}/pricing`,
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  }));

  return (
    <>
      <script
        id="json-ld-pricing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": pricingJsonLd }) }}
      />
      <script
        id="json-ld-services"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": servicesJsonLd }) }}
      />
      <main id="main">
        <Hero />
        <TrustStrip />
        <WhyUs />
        <ServicesSection />
        <ProcessTimeline />
        <Suspense fallback={<div className="py-16 lg:py-26 animate-pulse"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16"><div className="h-80 bg-slate/50 rounded-[20px]" /><div className="h-80 bg-slate/50 rounded-[20px]" /><div className="h-80 bg-slate/50 rounded-[20px]" /></div></div>}>
          <FeaturedWork />
        </Suspense>
        <Section id="pricing" aria-labelledby="pricing-heading">
          <Container>
            <Reveal>
              <SectionHeading
                id="pricing-heading"
                eyebrow="PRICING"
                h2="Starting prices, in the open"
                lead="Every project is scoped and quoted in writing before work begins. No surprises mid-build."
                className="mb-12 lg:mb-16"
              />
            </Reveal>
            <PricingCards />
            <Reveal>
              <p className="mt-8 text-center text-mist/70">
                Final quotes depend on scope —{" "}
                <Link href="/pricing" className="text-steel underline underline-offset-2 hover:text-frost">
                  see full pricing details
                </Link>
                .
              </p>
            </Reveal>
          </Container>
        </Section>
        <CTABand />
      </main>
      <Footer />
    </>
  );
}