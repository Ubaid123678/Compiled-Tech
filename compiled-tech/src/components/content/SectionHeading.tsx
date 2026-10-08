import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  h2?: string;
  lead?: string;
  id?: string;
  className?: string;
  eyebrowClassName?: string;
  h2ClassName?: string;
  leadClassName?: string;
};

export function SectionHeading({
  eyebrow,
  h2,
  lead,
  id,
  className,
  eyebrowClassName,
  h2ClassName,
  leadClassName,
}: SectionHeadingProps) {
  return (
    <div id={id} className={cn("text-center", className)}>
      {eyebrow && (
        <p className={cn("font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-3", eyebrowClassName)}>
          {eyebrow}
        </p>
      )}
      {h2 && (
        <h2 className={cn("font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15]", h2ClassName)}>
          {h2}
        </h2>
      )}
      {lead && (
        <p className={cn("mt-4 max-w-2xl mx-auto text-mist text-[1.125rem] leading-[1.65]", leadClassName)}>
          {lead}
        </p>
      )}
    </div>
  );
}