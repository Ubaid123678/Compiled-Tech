import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[999px] border font-display font-semibold text-[0.72rem] uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-250 ease-out outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50 active:translate-y-[1px]",
  {
    variants: {
      variant: {
        primary:
          "bg-steel text-ink hover:bg-frost hover:shadow-[0_10px_30px_rgba(185,198,212,0.25)]",
        ghost:
          "border-line text-frost hover:bg-slate hover:border-steel/40 hover:shadow-[0_10px_30px_rgba(185,198,212,0.25)]",
        outline:
          "border-line text-frost hover:bg-slate hover:border-steel/40",
        link: "text-frost underline-offset-4 hover:underline",
      },
      size: {
        md: "h-11 px-6 gap-2",
        lg: "h-12 px-7 gap-2.5",
        "icon-sm": "size-7 rounded-[999px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };