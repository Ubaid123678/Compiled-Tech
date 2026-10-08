import { SectionHeading } from "@/components/content/SectionHeading";
import { coreServices } from "@/data/services";
import { Reveal } from "@/components/motion/Reveal";

export function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-heading">
      <div className="mx-auto max-w-300 px-4 py-16 sm:px-6 lg:px-16 lg:py-26">
        <Reveal>
          <SectionHeading
          id="services-heading"
          eyebrow="SERVICES"
          h2="What we do"
          lead="Focused software services for products, operations, and customer experiences."
          className="mb-12 lg:mb-16"
          />
        </Reveal>
        <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
          {coreServices.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.05}>
            <article className="group border-t border-line py-7 transition-colors duration-300 hover:border-steel">
              <div className="mb-4 flex items-start justify-between gap-5">
                <span className="font-mono text-xs text-steel">0{index + 1}</span>
                <h3 className="max-w-sm text-right font-display text-[clamp(1rem,1.8vw,1.25rem)] font-semibold uppercase leading-[1.3] tracking-[0.02em] text-frost">
                  {service.title}
                </h3>
              </div>
              <p className="ml-auto max-w-sm text-right text-base leading-[1.6] text-mist">
                {service.description}
              </p>
            </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}