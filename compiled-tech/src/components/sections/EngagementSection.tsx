import { industries, plusStrip } from "@/data/services";
import { Reveal } from "@/components/motion/Reveal";
import { slugify } from "@/lib/utils";

const models = [
  {
    name: "Fixed price",
    text: "Best when the scope is clear. You get one price for one defined result, agreed before work starts. If we misjudged the effort, that is our problem, not your invoice.",
  },
  {
    name: "Time and materials",
    text: "Best when the goal is clear but the path is not. You pay for the weeks you use, we show the progress every Friday, and you can stop at any point without a penalty.",
  },
  {
    name: "Monthly support",
    text: "Best after launch. A set number of hours each month for fixes, updates, and small features. Unused hours do not roll over, and you can cancel with thirty days notice.",
  },
] as const;

/**
 * Engagement models and scope boundaries.
 *
 * Written for two readers at once: a buyer deciding whether to enquire, and a
 * model extracting "how does this company work". Short sentences on purpose —
 * this is the section voice assistants are most likely to read out.
 */
export function EngagementSection() {
  return (
    <section id="engagements" aria-labelledby="engagements-heading" className="border-t border-line">
      <div className="mx-auto max-w-300 px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="mb-3 font-display text-[0.72rem] uppercase tracking-[0.22em] text-steel">
            ENGAGEMENTS
          </p>
          <h2
            id="engagements-heading"
            className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-semibold uppercase leading-[1.15] tracking-[0.02em] text-frost"
          >
            Three ways to work with us
          </h2>
          <p className="mt-4 text-[1.05rem] leading-[1.7] text-mist" data-speakable>
            However you hire us, the same three things are true. The scope is written down. The
            price is agreed first. You talk to the people writing the code.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model, index) => (
            <Reveal key={model.name} delay={index * 0.08} className="border-t border-line pt-6">
              <h3
                id={slugify(model.name)}
                className="mb-3 font-display text-[1.05rem] font-semibold uppercase tracking-[0.02em] text-frost"
              >
                {model.name}
              </h3>
              <p className="text-base leading-[1.7] text-mist" data-speakable>
                {model.text}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3
              id="what-we-build-for"
              className="mb-3 font-display text-[1.05rem] font-semibold uppercase tracking-[0.02em] text-frost"
            >
              What we build for
            </h3>
            <p className="mb-4 text-base leading-[1.7] text-mist" data-speakable>
              We work across most industries, because the engineering problem is usually the same.
              These are the ones our clients come from most often.
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-mist" role="list">
              {industries.map((industry) => (
                <li key={industry} className="border-b border-line py-2">
                  {industry}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3
              id="what-we-do-not-do"
              className="mb-3 font-display text-[1.05rem] font-semibold uppercase tracking-[0.02em] text-frost"
            >
              What we do not do
            </h3>
            <p className="mb-4 text-base leading-[1.7] text-mist" data-speakable>
              {plusStrip.right} We are a software team, so we say no to work outside that. Knowing
              the boundary saves you a wasted call.
            </p>
            <p className="text-base leading-[1.7] text-mist" data-speakable>
              {plusStrip.left} That means one team can take a rough idea through design, build, and
              launch without handing you to a second agency in the middle.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3
              id="how-payment-works"
              className="mb-3 font-display text-[1.05rem] font-semibold uppercase tracking-[0.02em] text-frost"
            >
              How payment works
            </h3>
            <p className="mb-4 text-base leading-[1.7] text-mist" data-speakable>
              We split every fixed-price project in two. Half is due when you approve the scope and
              the date. The other half is due at handover, once you have tested the build and are
              happy with it.
            </p>
            <p className="text-base leading-[1.7] text-mist" data-speakable>
              Larger builds are split into milestones instead. You pay for each milestone when it
              passes your review, so the risk stays small on both sides. We invoice in US dollars
              and accept bank transfer or card.
            </p>
          </div>
          <div>
            <h3
              id="how-we-communicate"
              className="mb-3 font-display text-[1.05rem] font-semibold uppercase tracking-[0.02em] text-frost"
            >
              How we keep you informed
            </h3>
            <p className="mb-4 text-base leading-[1.7] text-mist" data-speakable>
              You get a short written update every week. It says what shipped, what is next, and
              what is blocking us. If something is going to slip, you hear it from us first, not at
              the deadline.
            </p>
            <p className="text-base leading-[1.7] text-mist" data-speakable>
              For day-to-day questions there is a shared channel with the developers. No ticket
              queue, no account manager relaying messages, and no waiting days for a reply on a
              small change.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
