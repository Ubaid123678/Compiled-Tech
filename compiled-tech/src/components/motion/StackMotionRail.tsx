"use client";

import { motion, useReducedMotion } from "framer-motion";

type StackMotionRailProps = {
  items: readonly string[];
};

export function StackMotionRail({ items }: StackMotionRailProps) {
  const reduceMotion = useReducedMotion();
  const rows = [items.slice(0, 5), items.slice(5, 10), items.slice(3, 8)];

  return (
    <div className="relative min-h-64 overflow-hidden border border-line bg-night/50 py-8" aria-label="Technology stack in motion">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-night to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-night to-transparent" />
      <div className="space-y-5">
        {rows.map((row, index) => (
          <motion.div
            key={index}
            className="flex w-max gap-3"
            animate={reduceMotion ? undefined : { x: ["12%", "-42%"] }}
            transition={reduceMotion ? undefined : { duration: 18 + index * 3, repeat: Infinity, ease: "linear" }}
          >
            {[...row, ...row].map((item, itemIndex) => (
              <span key={`${item}-${itemIndex}`} className="border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-steel">
                {item}
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
