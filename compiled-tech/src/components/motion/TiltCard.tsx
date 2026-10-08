"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  maxTilt?: number;
  glare?: boolean;
  className?: string;
  as?: React.ElementType;
};

export function TiltCard({
  children,
  maxTilt = 6,
  glare = true,
  className,
  as: Component = "div",
}: TiltCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-1, 1], [maxTilt, -maxTilt]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-1, 1], [-maxTilt, maxTilt]), { stiffness: 150, damping: 15 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handler = () => setIsTouch(true);
    window.addEventListener("touchstart", handler, { passive: true });
    return () => window.removeEventListener("touchstart", handler);
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isTouch || prefersReducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / (rect.width / 2));
    y.set((e.clientY - centerY) / (rect.height / 2));
  };

  const onMouseLeave = () => {
    if (prefersReducedMotion) return;
    x.set(0);
    y.set(0);
  };

  return (
    <Component
      ref={ref}
      className={cn(
        "relative rounded-[20px] border border-line bg-night overflow-hidden transition-all duration-250 ease-out hover:border-steel/40 hover:shadow-[0_10px_30px_rgb(185_198_212_/_0.25)]",
        className
      )}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: prefersReducedMotion ? "none" : undefined,
      }}
    >
      {glare && (
        <motion.div
          className="absolute inset-0 pointer-events-none bg-gradient-to-br from-transparent via-white/5 to-transparent"
          style={{
            opacity: prefersReducedMotion ? 0 : useSpring(useTransform(rotateY, [-maxTilt, maxTilt], [0, 0.15]), { stiffness: 150, damping: 15 }),
          }}
        />
      )}
      <div
        className="relative p-6 lg:p-8"
        style={{
          transform: prefersReducedMotion ? "none" : { rotateX, rotateY, perspective: 1000 },
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </Component>
  );
}