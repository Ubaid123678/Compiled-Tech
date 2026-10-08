import { TechLogo, trustStack } from "@/components/content/TechLogo";
import { SectionHeading } from "@/components/content/SectionHeading";
import { industries } from "@/data/services";
import { Reveal } from "@/components/motion/Reveal";
import { StackMotionRail } from "@/components/motion/StackMotionRail";

export function TrustStrip() {
  return (
    <section className="border-y border-line py-16 lg:py-20" aria-labelledby="trust-heading">
      <div className="mx-auto grid max-w-300 gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-16">
        <Reveal className="min-w-0">
          <SectionHeading id="trust-heading" eyebrow="STACK WE BUILD ON" className="mb-6 text-left" />
          <p className="mb-6 font-display text-xs uppercase tracking-widest text-steel">Moving through the stack</p>
          <StackMotionRail items={trustStack} />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3" role="list" aria-label="Technology stack">
            {trustStack.slice(0, 6).map((name, index) => (
              <Reveal key={name} delay={index * 0.04}>
                <div className="flex min-h-14 items-center gap-3 border border-line bg-night/40 px-4 transition-colors duration-300 hover:border-steel hover:bg-slate/30" role="listitem">
                  <TechLogo name={name} size={22} />
                  <span className="font-body text-sm text-mist">{name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <Reveal className="min-w-0" delay={0.12}>
          <SectionHeading eyebrow="INDUSTRIES" className="mb-6 text-left" />
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 sm:grid-cols-4" role="list">
            {industries.map((industry) => (
              <li key={industry} className="border-b border-line pb-3 text-sm text-mist">{industry}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}