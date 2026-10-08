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
                className="font-display uppercase text-[0.72rem] tracking-[0.12em] text-mist/60 hover:text-frost transition-colors"
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