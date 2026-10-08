import { Hero } from "@/components/hero/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <TrustStrip />
        <WhyUs />
        <ServicesSection />
        <ProcessTimeline />
        <FeaturedWork />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}