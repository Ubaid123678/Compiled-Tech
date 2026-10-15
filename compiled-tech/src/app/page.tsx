import { Hero } from "@/components/hero/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";
import Script from "next/script";
import { Suspense } from "react";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";

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

  return (
    <>
      <Script
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
        <CTABand />
      </main>
      <Footer />
    </>
  );
}