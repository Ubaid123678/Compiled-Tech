import { Breadcrumbs } from "./Breadcrumbs";
import { cn, slugify } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  lead: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
  showHexagon?: boolean;
};

export function PageHero({ title, lead, breadcrumbs, className, showHexagon = true }: PageHeroProps) {
  return (
    <header suppressHydrationWarning className={cn("relative pb-5 pt-20 lg:pb-6 lg:pt-24 bg-ink", className)}>
      {showHexagon && (
        <div className="pointer-events-none absolute right-0 top-1/2 h-75 w-75 max-w-[40vw] -translate-y-1/2 opacity-[0.03]" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none" className="h-full w-full text-frost">
            <rect width="32" height="32" rx="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 8 L16 24 M8 16 L24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      <div className="relative z-10 mx-auto max-w-300 px-4 sm:px-6 lg:px-16">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className="mb-4" />
        )}
        <h1 id={slugify(title)} className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-2">
          {title}
        </h1>
        <p className="text-mist text-[1.125rem] leading-[1.65] max-w-2xl">
          {lead}
        </p>
      </div>
    </header>
  );
}