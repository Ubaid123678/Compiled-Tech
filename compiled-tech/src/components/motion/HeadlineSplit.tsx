"use client";

import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

type HeadlineSplitProps = {
  leftTop: string;
  leftBottom: string;
  rightTop: string;
  rightBottom: string;
  className?: string;
};

export function HeadlineSplit({
  leftTop,
  leftBottom,
  rightTop,
  rightBottom,
  className = "",
}: HeadlineSplitProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  const itemVariantsRight = {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <motion.div
      className={`grid grid-cols-2 gap-8 lg:gap-16 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col justify-end">
        <motion.h1 variants={itemVariants} className="font-display font-semibold uppercase tracking-[0.01em] text-frost text-[clamp(1.8rem,4vw,3.7rem)] leading-[1]">
          {leftTop}
        </motion.h1>
        <motion.h1 variants={itemVariants} className="font-display font-medium uppercase tracking-[0.12em] text-steel text-[clamp(1rem,2.15vw,2rem)] leading-[1.1] mt-2">
          {leftBottom}
        </motion.h1>
      </div>
      <div className="flex flex-col justify-end items-end text-right">
        <motion.h1 variants={itemVariantsRight} className="font-display font-semibold uppercase tracking-[0.01em] text-frost text-[clamp(1.8rem,4vw,3.7rem)] leading-[1]">
          {rightTop}
        </motion.h1>
        <motion.h1 variants={itemVariantsRight} className="font-display font-medium uppercase tracking-[0.12em] text-steel text-[clamp(1rem,2.15vw,2rem)] leading-[1.1] mt-2">
          {rightBottom}
        </motion.h1>
      </div>
    </motion.div>
  );
}