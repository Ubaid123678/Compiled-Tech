import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "sample" | "default";
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-display uppercase text-[0.6rem] tracking-[0.2em] px-2 py-0.5 rounded-[999px]",
        variant === "sample" && "bg-steel/20 text-steel border border-steel/30",
        variant === "default" && "bg-slate text-frost",
        className
      )}
    >
      {children}
    </span>
  );
}