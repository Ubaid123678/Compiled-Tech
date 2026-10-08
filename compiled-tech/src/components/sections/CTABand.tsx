import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

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
    <section className={cn("relative isolate overflow-hidden rounded-frame border border-line bg-linear-to-b from-ink via-night/50 to-ink px-6 py-16 text-center lg:px-12 lg:py-24", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185_198_212/0.03)_0%,transparent_70%)]" aria-hidden="true" />
      <Reveal className="relative z-10 mx-auto max-w-3xl">
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
      </Reveal>
    </section>
  );
}