"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FAQItem = {
  q: string;
  a: string;
};

type FAQProps = {
  items: readonly FAQItem[];
  className?: string;
};

export function FAQ({ items, className }: FAQProps) {
  return (
    <section className={cn("space-y-4", className)} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="sr-only">
        Frequently asked questions
      </h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <FAQItemComponent key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

function FAQItemComponent({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group rounded-[12px] border border-line bg-night overflow-hidden">
      <button
        className="flex items-center justify-between w-full px-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-steel focus-visible:outline-offset-3"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel pr-4">
          Q{index + 1}
        </span>
        <p className="flex-1 text-frost text-base leading-[1.6]">{item.q}</p>
        <motion.div
          className="flex-shrink-0 text-steel transition-colors group-hover:text-frost"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronDown className="w-5 h-5" aria-hidden="true" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-line">
              <p className="text-mist text-base leading-[1.65]">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}