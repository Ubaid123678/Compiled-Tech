import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type StepPanelProps = {
  number: number;
  title: string;
  text: string;
  active?: boolean;
  className?: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export function StepPanel({ number, title, text, active, className }: StepPanelProps) {
  return (
    <motion.div
      className={cn("min-h-[60vh] flex items-center", className)}
      initial={{ opacity: 0, x: 16 }}
      animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
      transition={{ duration: 0.4, ease: easeOut }}
      role={active ? "article" : undefined}
      aria-labelledby={`step-${number}-title`}
    >
      <div className="w-full max-w-xl">
        <h3 id={`step-${number}-title`} className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
          Step {number}: {title}
        </h3>
        <p className="text-mist text-[1.125rem] leading-[1.65]">{text}</p>
      </div>
    </motion.div>
  );
}