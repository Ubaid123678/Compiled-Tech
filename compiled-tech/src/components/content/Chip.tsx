import { cn } from "@/lib/utils";

type ChipProps = {
  children: React.ReactNode;
  variant?: "default" | "category";
  className?: string;
};

export function Chip({ children, variant = "default", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl border border-line bg-night px-3 py-1 font-body text-[0.8rem] leading-normal",
        variant === "category" && "text-steel",
        variant === "default" && "text-mist/80",
        className
      )}
    >
      {children}
    </span>
  );
}