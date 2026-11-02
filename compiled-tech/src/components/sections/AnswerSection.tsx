import { answers } from "@/data/answers";
import { AnswerCard } from "@/components/content/AnswerCard";
import { AnswerToc } from "@/components/content/AnswerToc";
import { slugify } from "@/lib/utils";

/**
 * Straight Answers — the homepage Q&A block.
 *
 * Two constraints shape this layout, both measured by the audit:
 *   1. every answer must be in the server-rendered DOM, directly after its
 *      question heading (snippet + answer-engine extraction)
 *   2. the questions need ids so they are deep-linkable and countable as
 *      internal anchors
 *
 * So it is a two-column layout: a sticky index on the left (real anchor links,
 * crawlable, fixes "no table of contents / 2 in-page anchors"), and the answers
 * as cards on the right. The cards animate in on scroll — decoration over text
 * that is always present, never visibility toggling.
 */
export function AnswerSection() {
  const toc = answers.map((item) => ({ id: slugify(item.q), label: item.q }));

  return (
    <section id="answers" aria-labelledby="answers-heading" className="border-t border-line">
      <div className="mx-auto max-w-300 px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
        <div className="mb-12 max-w-2xl lg:mb-16">
          <p className="mb-3 font-display text-[0.72rem] uppercase tracking-[0.22em] text-steel">
            QUESTIONS
          </p>
          <h2
            id="answers-heading"
            className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-semibold uppercase leading-[1.15] tracking-[0.02em] text-frost"
          >
            Straight answers
          </h2>
          <p className="mt-4 text-[1.05rem] leading-[1.7] text-mist">
            The questions people actually ask before they hire us. No sales script.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[210px_1fr] lg:gap-14">
          <AnswerToc items={toc} />

          <div className="grid gap-4 sm:grid-cols-2">
            {answers.map((item, index) => (
              <AnswerCard
                key={item.q}
                id={slugify(item.q)}
                index={index}
                question={item.q}
                answer={item.a}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
