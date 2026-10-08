import Link from "next/link";
import { cn } from "@/lib/utils";

type BreadcrumbsProps = {
  items: Array<{ label: string; href?: string }>;
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-2 text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href || item.label} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-steel" aria-hidden="true">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-9 items-center rounded-full border border-line px-3 font-display uppercase text-[0.72rem] tracking-[0.12em] text-mist/70 transition-[color,border-color,background-color,transform] hover:border-steel/60 hover:bg-slate/60 hover:text-frost active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-display uppercase text-[0.72rem] tracking-[0.12em] text-frost" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}