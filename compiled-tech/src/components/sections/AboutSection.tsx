import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function AboutSection() {
  return (
    <section id="studio" aria-labelledby="studio-heading" className="border-t border-line">
      <div className="mx-auto max-w-300 px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <Reveal>
            <p className="mb-3 font-display text-[0.72rem] uppercase tracking-[0.22em] text-steel">
              THE STUDIO
            </p>
            <h2
              id="studio-heading"
              className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-semibold uppercase leading-[1.15] tracking-[0.02em] text-frost"
            >
              Who you are hiring
            </h2>
            <p className="mt-4 text-[1.05rem] leading-[1.7] text-mist">
              Compiled Tech is four people in Hasilpur, Pakistan, and you speak to the developers
              directly. There is no account manager relaying messages. You get a written scope, a
              fixed price and a delivery date before work starts, and the same people finish it.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="max-w-2xl space-y-6 text-[1.05rem] leading-[1.7] text-mist">
            <p data-speakable>
              At handover, you get the source code, documentation, and a walkthrough for running
              the product. Ongoing support is available for fixes, updates, and new features.
            </p>
            <p>
              <Link href="/work" className="underline underline-offset-4">Explore our work</Link>
              {" or "}
              <Link href="/about" className="underline underline-offset-4">meet the team</Link>.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
