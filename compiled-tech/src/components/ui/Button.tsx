import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  variant?: "primary" | "ghost" | "link" | "outline";
  size?: "md" | "lg" | "icon-sm";
  href?: string;
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  asChild?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  loading = false,
  children,
  className,
  onClick,
  type = "button",
  asChild = false,
}: ButtonProps) {
  const classes = cn(
    "group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-display text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-all duration-250 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    size === "lg" ? "h-12 px-6" : size === "icon-sm" ? "size-7 px-0" : "h-11 px-6",
    variant === "primary" &&
      "bg-steel text-ink hover:-translate-y-0.5 hover:bg-frost hover:shadow-[0_10px_30px_rgb(185_198_212_/_0.25)]",
    variant === "ghost" &&
      "border border-line bg-transparent text-frost hover:-translate-y-0.5 hover:border-steel/50 hover:bg-slate",
    variant === "outline" &&
      "border border-line bg-transparent text-frost hover:border-steel/50 hover:bg-slate",
    variant === "link" && "px-0 text-frost hover:text-steel",
    className,
  );

  const content = (
    <>
      {loading && (
        <span
          className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
      {!loading && icon}
    </>
  );

  if (asChild) {
    return <span className={classes}>{children}</span>;
  }

  if (href) {
    return (
      <Link className={classes} href={href} aria-disabled={loading} tabIndex={loading ? -1 : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} disabled={loading} onClick={onClick}>
      {content}
    </button>
  );
}
