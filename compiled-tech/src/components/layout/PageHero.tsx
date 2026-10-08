import { Breadcrumbs } from "./Breadcrumbs";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  lead: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
  showHexagon?: boolean;
};

export function PageHero({ title, lead, breadcrumbs, className, showHexagon = true }: PageHeroProps) {
  return (
    <header className={cn("relative py-12 lg:py-16 bg-ink", className)}>
      {showHexagon && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] max-w-[40vw] opacity-[0.03] pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-frost">
            <rect width="32" height="32" rx="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 8 L16 24 M8 16 L24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16 relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
        )}
        <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-3">
          {title}
        </h1>
        <p className="text-mist text-[1.125rem] leading-[1.65] max-w-2xl">
          {lead}
        </p>
      </div>
    </header>
  );
}