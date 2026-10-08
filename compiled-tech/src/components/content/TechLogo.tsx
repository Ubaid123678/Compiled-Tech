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
  siDocker,
  siFirebase,
  siGooglecloud,
  siGraphql,
  siHuggingface,
  siKubernetes,
  siPandas,
  siPytorch,
  siRedis,
  siScikitlearn,
  siShopify,
  siStripe,
  siSupabase,
  siTensorflow,
  siWordpress,
  siZapier,
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
  Docker: { icon: siDocker, color: "#2496ED" },
  Firebase: { icon: siFirebase, color: "#FFCA28" },
  "Google Cloud": { icon: siGooglecloud, color: "#4285F4" },
  GraphQL: { icon: siGraphql, color: "#E10098" },
  "Hugging Face": { icon: siHuggingface, color: "#FFD21E" },
  Kubernetes: { icon: siKubernetes, color: "#326CE5" },
  Pandas: { icon: siPandas, color: "#150458" },
  PyTorch: { icon: siPytorch, color: "#EE4C2C" },
  Redis: { icon: siRedis, color: "#DC382D" },
  "scikit-learn": { icon: siScikitlearn, color: "#F7931E" },
  Shopify: { icon: siShopify, color: "#7AB55C" },
  Stripe: { icon: siStripe, color: "#635BFF" },
  Supabase: { icon: siSupabase, color: "#3ECF8E" },
  TensorFlow: { icon: siTensorflow, color: "#FF6F00" },
  WordPress: { icon: siWordpress, color: "#21759B" },
  Zapier: { icon: siZapier, color: "#FF4A00" },
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

export const movingStack = [
  ...trustStack.filter(
    (name) => !["React", "Next.js", "TypeScript", "Node.js", "Python"].includes(name),
  ),
  "AI Agents",
  "AI Automation",
  "Machine Learning",
  "RAG Systems",
  "Document AI",
  "Data Pipelines",
  "SaaS Platforms",
  "E-commerce",
] as const;