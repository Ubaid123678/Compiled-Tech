"use client";

import { motion, useReducedMotion } from "framer-motion";

type StackMotionRailProps = {
  items: readonly string[];
};

export function StackMotionRail({ items }: StackMotionRailProps) {
  const reduceMotion = useReducedMotion();
  const rows = [items.slice(0, 7), items.slice(4, 11), items.slice(7, 14)];

  return (
    <div className="relative min-h-64 overflow-hidden py-5" aria-label="Technology stack in motion">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-night to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-night to-transparent" />
      <div className="space-y-6">
        {rows.map((row, index) => (
          <div key={index} className="overflow-hidden">
            <motion.div
              className="flex w-max gap-8"
              animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
              transition={reduceMotion ? undefined : { duration: 22 + index * 4, repeat: Infinity, ease: "linear" }}
            >
              {[...row, ...row].map((item, itemIndex) => (
                <span key={`${item}-${itemIndex}`} className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.12em] text-steel transition-colors duration-300 hover:text-frost">
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
