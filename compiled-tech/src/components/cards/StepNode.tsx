import { cn } from "@/lib/utils";

type StepNodeProps = {
  number: number;
  title: string;
  active?: boolean;
  className?: string;
};

export function StepNode({ number, title, active, className }: StepNodeProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-16 shrink-0 items-center justify-center rounded-full border-2 font-display font-semibold uppercase text-[1.2rem] tracking-[0.02em] transition-all duration-400 ease-out",
          active
            ? "border-frost bg-frost text-ink shadow-[0_0_30px_rgb(233_239_246/0.4)]"
            : "border-line text-mist/60 hover:border-steel/50"
        )}
        aria-current={active ? "step" : undefined}
      >
        {number}
      </div>
      <h4 className={cn(
        "font-display uppercase text-[0.72rem] tracking-[0.12em] text-center transition-colors",
        active ? "text-frost" : "text-mist/60"
      )}>
        {title}
      </h4>
    </div>
  );
}