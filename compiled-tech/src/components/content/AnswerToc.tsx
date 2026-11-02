"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = { id: string; label: string };

/**
 * Sticky index for the answers section.
 *
 * Progressive enhancement: rendered as plain anchor links, so it is useful
 * (and crawlable) with no JavaScript at all. The scroll-spy only adds the
 * active marker. IntersectionObserver rather than a scroll listener — the
 * browser does the work, no rAF loop.
 *
 * ponytail: highlights only the section currently nearest the top. If entries
 * ever grow past ~20, switch to a virtualised indicator; a handful does not
 * justify it.
 */
export function AnswerToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A band just under the fixed header (scroll-padding is 6rem). Anchored
      // links land the heading ~208px down, so the band has to cover that row
      // or the marker keeps showing the previous card.
      { rootMargin: "-120px 0px -55% 0px", threshold: 0 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Questions on this page" className="hidden lg:block">
      <p className="mb-4 font-display text-[0.68rem] uppercase tracking-[0.24em] text-steel">
        On this page
      </p>
      <ol className="relative space-y-1 border-l border-line">
        {items.map((item, index) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="relative">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex items-baseline gap-3 py-2 pl-4 pr-2 text-sm leading-snug transition-colors duration-200",
                  isActive ? "text-frost" : "text-mist/60 hover:text-steel"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-0 h-full w-px origin-top bg-steel transition-transform duration-300",
                    isActive ? "scale-y-100" : "scale-y-0"
                  )}
                />
                <span className="font-mono text-[0.68rem] text-steel/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
