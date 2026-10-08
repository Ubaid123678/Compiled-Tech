import { Hero } from "@/components/hero/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTABand } from "@/components/sections/CTABand";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <TrustStrip />
      <ServicesSection />
      <ProcessTimeline />
      <FeaturedWork />
      <WhyUs />
      <CTABand />
    </main>
  );
}