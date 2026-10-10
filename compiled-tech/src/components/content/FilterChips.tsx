"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type FilterChipsProps = {
  filters: readonly string[];
  activeFilter: string;
  onChange: (filter: string) => void;
  className?: string;
};

export function FilterChips({ filters, activeFilter, onChange, className }: FilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-3 mb-10", className)} role="group" aria-label="Filter articles">
      <AnimatePresence>
        {filters.map((filter) => (
          <motion.button
            key={filter}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onChange(filter)}
            className={cn(
              "font-display uppercase text-[0.72rem] tracking-[0.22em] px-4 py-2 rounded-[999px] border transition-all duration-200 ease-out",
              activeFilter === filter
                ? "border-frost bg-frost text-ink"
                : "border-line text-mist/60 hover:border-steel/50 hover:text-frost"
            )}
            aria-pressed={activeFilter === filter}
          >
            {filter}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}