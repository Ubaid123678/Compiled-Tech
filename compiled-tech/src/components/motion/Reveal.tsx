"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Scroll-in reveal for the server-rendered sections it wraps.
 *
 * ponytail: this is a client component, which means the wrapped subtree is
 * serialized into the RSC payload twice (once as HTML, once as props). The
 * CSS `animation-timeline: view()` alternative removes that cost, but it is
 * Chromium-only — in Safari and Firefox the animation silently never runs and
 * the page reads as static. Correct-on-every-browser wins over 15KB; revisit
 * only if scroll-driven animations ship everywhere.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={reduceMotion ? undefined : { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
