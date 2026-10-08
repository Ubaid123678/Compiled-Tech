import { cn } from "@/lib/utils";

const techLogos: Record<string, { icon: string; color?: string }> = {
  React: { icon: "siReact" },
  "Next.js": { icon: "siNextdotjs" },
  TypeScript: { icon: "siTypescript" },
  Node.js: { icon: "siNodedotjs" },
  Python: { icon: "siPython" },
  Flutter: { icon: "siFlutter" },
  "React Native": { icon: "siReact" },
  Angular: { icon: "siAngular" },
  Laravel: { icon: "siLaravel" },
  MongoDB: { icon: "siMongodb" },
  MySQL: { icon: "siMysql" },
  PostgreSQL: { icon: "siPostgresql" },
};

type TechLogoProps = {
  name: keyof typeof techLogos;
  size?: number;
  className?: string;
};

export function TechLogo({ name, size = 32, className }: TechLogoProps) {
  const { icon, color } = techLogos[name];
  const Icon = require(`simple-icons`)[icon];

  return (
    <Icon
      className={cn("flex-shrink-0 text-steel transition-colors hover:text-frost", className)}
      width={size}
      height={size}
      style={color ? { color } : undefined}
      aria-hidden="true"
    />
  );
}

export const trustStack = Object.keys(techLogos) as Array<keyof typeof techLogos>;