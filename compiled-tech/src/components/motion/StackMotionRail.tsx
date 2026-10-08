"use client";

import { motion, useReducedMotion } from "framer-motion";

type StackMotionRailProps = {
  items: readonly string[];
};

export function StackMotionRail({ items }: StackMotionRailProps) {
  const reduceMotion = useReducedMotion();
  const rows = Array.from({ length: 3 }, (_, rowIndex) =>
    items.filter((_, itemIndex) => itemIndex % 3 === rowIndex),
  );

  return (
    <div className="relative min-h-64 overflow-hidden pt-9 pb-4" aria-label="Technology stack in motion">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-night to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-night to-transparent" />
      <div className="space-y-5">
        {rows.map((row, index) => (
          <div key={index} className="overflow-hidden">
            <motion.div
              className="flex w-max gap-4 will-change-transform sm:gap-6"
              animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
              transition={reduceMotion ? undefined : { duration: 24 + index * 4, repeat: Infinity, ease: "linear" }}
            >
              {[...row, ...row].map((item, itemIndex) => (
                <span
                  key={`${item}-${itemIndex}`}
                  className="whitespace-nowrap rounded-lg border border-line bg-slate/35 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-steel transition-all duration-300 hover:border-steel/70 hover:bg-slate hover:text-frost sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
