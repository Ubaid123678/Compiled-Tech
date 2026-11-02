"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = { id: string; label: string };

/**
 * Sticky index for the answers section.
 *
 * The rail stays fixed while the answers scroll past it, and a highlight bar
 * slides between entries — so the number and the question move together rather
 * than each item lighting up independently.
 *
 * Progressive enhancement: plain anchor links, so the index is useful (and
 * crawlable) with no JavaScript. The scroll-spy and the sliding bar are the
 * only client work. IntersectionObserver for the spy — the browser does the
 * work, no rAF loop.
 *
 * The bar is measured, not computed from index × rowHeight: questions wrap to
 * different heights, so arithmetic would drift as soon as one wraps.
 *
 * ponytail: re-measures on resize and after fonts load, which is when row
 * heights actually change. If entries ever grow past ~20, virtualise; a dozen
 * does not justify it.
 */
export function AnswerToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [bar, setBar] = useState<{ top: number; height: number } | null>(null);

  const measure = useCallback(() => {
    const index = items.findIndex((item) => item.id === active);
    const el = itemRefs.current[index];
    if (!el) return;
    setBar({ top: el.offsetTop, height: el.offsetHeight });
  }, [active, items]);

  useEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    // Row heights change once the display fonts swap in.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    // The callback's `entries` only contains what CHANGED, so picking the
    // topmost from it alone skips cards that were already visible — that is why
    // the marker lagged one behind. Track the live set and re-pick every time.
    const visible = new Set<string>();

    const pick = () => {
      if (!visible.size) return;
      // Topmost card inside the band wins.
      const top = [...visible]
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el))
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
      if (top) setActive(top.id);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        pick();
      },
      // A thin band just below the fixed header (72px tall, scroll-padding
      // 96px). Anchors land the target ~150-208px down, so the band has to sit
      // around that row: too high and the card that was just scrolled to falls
      // below it, which is exactly why the marker kept lagging behind.
      { rootMargin: "-140px 0px -75% 0px", threshold: 0 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Questions on this page"
      className="hidden self-start lg:sticky lg:top-24 lg:block"
    >
      <p className="mb-5 font-display text-[0.68rem] uppercase tracking-[0.24em] text-steel">
        On this page
      </p>

      {/* border-l is the static track; the bar rides on top of it. Measured
          against the <ol> because li.offsetTop is relative to its offsetParent. */}
      <ol className="relative border-l border-line">
        {bar && (
          <span
            aria-hidden="true"
            className="absolute left-0 w-px bg-frost transition-[transform,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateY(${bar.top}px)`, height: bar.height }}
          />
        )}

        {items.map((item, index) => {
          const isActive = active === item.id;
          return (
            <li
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
            >
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex items-baseline gap-3 py-2.5 pl-4 pr-2 leading-snug transition-colors duration-200",
                  isActive ? "text-frost" : "text-mist/55 hover:text-steel"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "font-mono text-[0.72rem] transition-all duration-300",
                    isActive ? "text-steel" : "text-steel/40"
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-[0.95rem] transition-all duration-300",
                    isActive ? "translate-x-0.5 font-medium" : ""
                  )}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
