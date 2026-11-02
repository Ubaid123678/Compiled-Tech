"use client";

import { motion, useReducedMotion } from "framer-motion";

type AnswerCardProps = {
  id: string;
  index: number;
  question: string;
  answer: string;
};

/**
 * One question/answer in the Straight Answers section.
 *
 * Deliberately NOT an accordion. Collapsing the body — `<details>`, state, or
 * AnimatePresence — removes the paragraph from the DOM, which breaks the two
 * things this section exists for: the snippet parser looks for a paragraph
 * directly after the question heading, and voice assistants read the answer
 * text without opening anything. It scored 12/19 when every answer was
 * renderable; hiding them would drop it back toward zero.
 *
 * So the animation is entrance and hover, never visibility: each card rises and
 * fades in on scroll, the index and hairline accent animate, and the card lifts
 * on hover. All of that is decoration over text that is always present.
 *
 * ponytail: stagger comes from the index, not a shared timeline. With twelve
 * cards the difference is invisible and there is no orchestrator to maintain.
 */
export function AnswerCard({ id, index, question, answer }: AnswerCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      id={id}
      data-speakable
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 0.5, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }
      }
      className="group relative scroll-mt-28 overflow-hidden rounded-[18px] border border-line bg-night/50 p-5 transition-colors duration-300 hover:border-steel/35 hover:bg-night sm:p-6"
    >
      {/* Hairline accent, grows from the top on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-linear-to-r from-steel/70 via-steel/20 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />

      {/* The number is a CSS ::before counter, not a text node.
          Two rules are in play at once here:
            1. the <p> must be the heading's immediate sibling, so the heading
               cannot sit inside a flex row (that put a <div> in between and the
               snippet check fell from 19/19 to 7/19)
            2. the heading's text must still start with the question word, so
               the counter cannot be markup inside the <h3> either — "01 What is
               ..." stops matching a question pattern
          A generated-content counter satisfies both: no extra element, and the
          number is not part of the accessible or extracted text. */}
      <h3
        id={`${id}-heading`}
        data-index={String(index + 1).padStart(2, "0")}
        className="mb-3 font-display text-[1rem] font-semibold uppercase leading-[1.4] tracking-[0.02em] text-frost before:mr-3 before:font-mono before:text-[0.68rem] before:tracking-[0.2em] before:text-steel/50 before:content-[attr(data-index)] before:transition-colors before:duration-300 group-hover:before:text-steel"
      >
        {question}
      </h3>

      <p className="text-[0.975rem] leading-[1.7] text-mist">{answer}</p>
    </motion.article>
  );
}
