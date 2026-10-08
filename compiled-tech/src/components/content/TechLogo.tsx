import { cn } from "@/lib/utils";
import type { SimpleIcon } from "simple-icons";
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siNodedotjs,
  siPython,
  siFlutter,
  siAngular,
  siLaravel,
  siMongodb,
  siMysql,
  siPostgresql,
} from "simple-icons";

const techLogos: Record<string, { icon: SimpleIcon; color?: string }> = {
  React: { icon: siReact, color: "#61DAFB" },
  "Next.js": { icon: siNextdotjs, color: "#000000" },
  TypeScript: { icon: siTypescript, color: "#3178C6" },
  "Node.js": { icon: siNodedotjs, color: "#339933" },
  Python: { icon: siPython, color: "#3776AB" },
  Flutter: { icon: siFlutter, color: "#02569B" },
  "React Native": { icon: siReact, color: "#61DAFB" },
  Angular: { icon: siAngular, color: "#DD0031" },
  Laravel: { icon: siLaravel, color: "#FF2D20" },
  MongoDB: { icon: siMongodb, color: "#47A248" },
  MySQL: { icon: siMysql, color: "#4479A1" },
  PostgreSQL: { icon: siPostgresql, color: "#4169E1" },
};

type TechLogoProps = {
  name: keyof typeof techLogos;
  size?: number;
  className?: string;
};

export function TechLogo({ name, size = 32, className }: TechLogoProps) {
  const { icon, color } = techLogos[name];

  return (
    <svg
      className={cn("shrink-0 text-steel transition-colors hover:text-frost", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color || "currentColor"}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}

export const trustStack = Object.keys(techLogos) as Array<keyof typeof techLogos>;

export const movingStack = trustStack.filter(
  (name) => !["React", "Next.js", "TypeScript", "Node.js", "Python"].includes(name),
);