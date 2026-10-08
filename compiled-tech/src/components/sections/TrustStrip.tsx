import { Marquee } from "@/components/motion/Marquee";
import { TechLogo, trustStack } from "@/components/content/TechLogo";
import { SectionHeading } from "@/components/content/SectionHeading";

export function TrustStrip() {
  return (
    <section className="border-y border-line py-6" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16">
        <SectionHeading
          id="trust-heading"
          eyebrow="BUILT WITH"
          className="mb-6 text-center"
        />
        <Marquee speed={40} paused={false}>
          {trustStack.map((name) => (
            <span key={name} className="flex items-center gap-2 px-4">
              <TechLogo name={name} size={28} />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}