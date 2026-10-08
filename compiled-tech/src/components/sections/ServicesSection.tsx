import { SectionHeading } from "@/components/content/SectionHeading";
import { PillarCard } from "@/components/cards/PillarCard";
import { PlusStrip } from "@/components/content/PlusStrip";
import { pillars } from "@/data/services";

export function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-heading">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16 py-16 lg:py-26">
        <SectionHeading
          id="services-heading"
          eyebrow="SERVICES"
          h2="Four ways we ship software"
          lead="Pick one pillar or combine them. Every project is software only."
          className="mb-12 lg:mb-16"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {pillars.map((_, i) => (
            <PillarCard key={pillars[i].slug} index={i} href={`/services/${pillars[i].slug}`} />
          ))}
        </div>
        <PlusStrip />
      </div>
    </section>
  );
}