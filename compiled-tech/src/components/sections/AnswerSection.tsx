import { answers } from "@/data/answers";
import { Reveal } from "@/components/motion/Reveal";
import { slugify } from "@/lib/utils";

/**
 * Answer section for the homepage.
 *
 * Rendered on the server with no client state, for three reasons the audit
 * measures directly: the answer text is in the initial HTML, each question is
 * a real <h2> with an id (deep-linkable, question-shaped), and every answer
 * paragraph is 40-60 words so it can be lifted whole as a featured snippet.
 *
 * ponytail: plain grid, not an accordion. Collapsed text is invisible to
 * crawlers and voice assistants, which defeats the purpose.
 */
export function AnswerSection() {
  return (
    <section id="answers" aria-labelledby="answers-heading">
      <div className="mx-auto max-w-300 px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
        <div className="text-center">
          <p className="mb-3 font-display text-[0.72rem] uppercase tracking-[0.22em] text-steel">
            QUESTIONS
          </p>
          <h2
            id="answers-heading"
            className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-semibold uppercase leading-[1.15] tracking-[0.02em] text-frost"
          >
            Straight answers
          </h2>
        </div>

        {/* Plain h3 + p, not <dl>/<dt>/<dd>: answer engines and featured-snippet
            extraction look for a paragraph immediately following the question
            heading, and <dt> wraps the <h3> while <dd> wraps the <p>, so the
            two are never adjacent. The semantic list cost a HIGH-priority
            finding and bought a low-priority advisory. */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-x-12 gap-y-10 sm:grid-cols-2 lg:mt-16">
          {answers.map((item, index) => (
            <Reveal key={item.q} delay={index * 0.06} className="border-t border-line pt-6">
              <h3
                id={slugify(item.q)}
                className="mb-3 font-display text-[1.05rem] font-semibold uppercase leading-[1.35] tracking-[0.02em] text-frost"
              >
                {item.q}
              </h3>
              <p data-speakable className="text-base leading-[1.65] text-mist">
                {item.a}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
