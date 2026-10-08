"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  speed?: number;
  paused?: boolean;
  className?: string;
};

export function Marquee({
  children,
  speed = 40,
  paused = false,
  className,
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (ref.current) setWidth(ref.current.scrollWidth / 2);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div className={cn("flex flex-wrap gap-8 justify-center py-8", className)} role="list" aria-label="Tech stack">
        {children}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)} aria-hidden="true">
      <div
        ref={ref}
        className="flex whitespace-nowrap will-change-transform"
        style={{
          animation: paused ? "none" : `marquee ${speed}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {children}
        {children}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}