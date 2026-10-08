import { SectionHeading } from "@/components/content/SectionHeading";
import { WhyItem } from "@/components/cards/WhyItem";
import { Check, Users, FileText, Shield } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const whyItems = [
  {
    title: "Software only",
    text: "We build web, apps, and AI. Nothing else, so we do it well.",
    icon: <Check className="w-6 h-6" aria-hidden="true" />,
  },
  {
    title: "Direct access",
    text: "You talk to the developers who build your product.",
    icon: <Users className="w-6 h-6" aria-hidden="true" />,
  },
  {
    title: "Clear scope",
    text: "You get a written scope and price before work starts.",
    icon: <FileText className="w-6 h-6" aria-hidden="true" />,
  },
  {
    title: "Built to last",
    text: "Clean code, documentation, and a proper handover.",
    icon: <Shield className="w-6 h-6" aria-hidden="true" />,
  },
] as const;

export function WhyUs() {
  return (
    <section id="why" aria-labelledby="why-heading">
      <div className="mx-auto max-w-300 px-4 sm:px-6 lg:px-16 py-16 lg:py-26">
        <Reveal>
          <SectionHeading
            id="why-heading"
            h2="Why CompiledTech"
            className="mb-12 lg:mb-16"
          />
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <WhyItem {...item} />
            </Reveal>
          ))}
        </div>
        {/* Testimonial slot - hidden until real quotes exist */}
        <div className="hidden" aria-hidden="true">
          {/* TestimonialCard will go here when real quotes are available */}
        </div>
      </div>
    </section>
  );
}