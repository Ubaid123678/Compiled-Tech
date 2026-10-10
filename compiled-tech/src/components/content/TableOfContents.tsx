"use client";

import { cn } from "@/lib/utils";

type TOCItem = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  items: TOCItem[];
  className?: string;
};

export function TableOfContents({ items, className }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav className={cn("sticky top-24 space-y-2 max-h-[70vh] overflow-auto hidden lg:block", className)} aria-label="Table of contents">
      <h3 className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-4">
        On this page
      </h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className={cn("pl-4 border-l border-line", item.level === 3 && "pl-6")}>
            <a
              href={`#${item.id}`}
              className="text-mist/60 hover:text-frost transition-colors text-sm leading-[1.5]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}