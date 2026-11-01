import { aboutData } from "@/data/about";

/**
 * Plain-language company copy on the homepage.
 *
 * Three audit findings pointed here at once: the page was thin (478 words),
 * its prose was too dense for voice answers (Flesch 49), and almost no
 * paragraph was the 15-60 word length a voice assistant can read out. Short
 * sentences, one idea each, with a definition-style opening.
 *
 * Facts come from data/about.ts — this section invents nothing.
 */
export function AboutSection() {
  const { hero } = aboutData;

  return (
    <section id="studio" aria-labelledby="studio-heading" className="border-t border-line">
      <div className="mx-auto max-w-300 px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <p className="mb-3 font-display text-[0.72rem] uppercase tracking-[0.22em] text-steel">
              THE STUDIO
            </p>
            <h2
              id="studio-heading"
              className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-semibold uppercase leading-[1.15] tracking-[0.02em] text-frost"
            >
              Who you are hiring
            </h2>
          </div>

          <div className="max-w-2xl space-y-6 text-[1.05rem] leading-[1.7] text-mist">
            <p data-speakable>
              Compiled Tech is a software studio in Hasilpur, Pakistan. Four people build the
              work, and you speak to them directly. There is no account manager between you and
              the code.
            </p>
            <p data-speakable>
              The team started after watching the same project fail twice. A client paid up front
              and waited. A developer finished half the work and vanished. So we changed the
              order: agree the scope, agree the price, then start.
            </p>
            <p data-speakable>
              Every project begins the same way. We learn your goal and your users. We write down
              what will be built, what it costs, and when it lands. You approve that in writing
              before any code is written.
            </p>
            <p data-speakable>
              {hero.lead} That is small enough to stay reachable, and old enough to have shipped
              work you can inspect on our work page before you decide anything.
            </p>
            <p data-speakable>
              When the build ends you get the code, the documentation, and a handover you can run
              without us. If you want us to stay, our support plan covers fixes, updates, and new
              features. If you want to take it in-house, that is fine too.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
