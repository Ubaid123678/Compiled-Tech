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
        "inline-flex items-center font-body text-[0.8rem] leading-[1.5] px-3 py-1 rounded-[12px] border border-line bg-night",
        variant === "category" && "text-steel",
        variant === "default" && "text-mist/80",
        className
      )}
    >
      {children}
    </span>
  );
}