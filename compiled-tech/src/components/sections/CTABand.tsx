import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type CTABandProps = {
  title?: string;
  lead?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
};

export function CTABand({
  title = "Have an idea? Let's compile it.",
  lead = "Tell us what you want to build. We reply within one working day.",
  primaryLabel = "Start a Project",
  primaryHref = "/contact",
  secondaryLabel = "Book a Call",
  secondaryHref = "/contact#book",
  className,
}: CTABandProps) {
  return (
    <section className={cn("relative isolate overflow-hidden rounded-[28px] border border-line bg-gradient-to-b from-ink via-night/50 to-ink py-16 lg:py-24 px-6 lg:px-12 text-center", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185_198_212_/_0.03)_0%,transparent_70%)]" aria-hidden="true" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
          {title}
        </h2>
        <p className="text-mist text-[1.125rem] leading-[1.65] mb-8 max-w-xl mx-auto">
          {lead}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href={primaryHref} size="lg" icon={<ArrowUpRight size={16} strokeWidth={1.7} />}>
            {primaryLabel}
          </Button>
          <Button href={secondaryHref} variant="ghost" size="lg">
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}