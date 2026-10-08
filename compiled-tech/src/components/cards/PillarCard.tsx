import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/motion/TiltCard";
import { pillars } from "@/data/services";

type PillarCardProps = {
  index: number;
  href: string;
};

export function PillarCard({ index, href }: PillarCardProps) {
  const pillar = pillars[index];
  if (!pillar) return null;

  return (
    <TiltCard as="article" className="flex flex-col h-full">
      <div className="flex flex-col flex-1">
        <span className="font-mono text-[0.8rem] text-steel mb-2">PILLAR {index + 1}</span>
        <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.15rem,2vw,1.35rem)] leading-[1.3] mb-3">
          {pillar.title}
        </h3>
        <p className="text-mist text-base leading-[1.6] mb-6 flex-1">{pillar.line}</p>
        <ul className="space-y-2 mb-6" role="list">
          {pillar.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-normal text-mist/80">
              <span className="font-mono text-steel mt-1">–</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 font-display uppercase text-[0.72rem] tracking-[0.14em] text-steel hover:text-frost transition-colors"
      >
        View services
        <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </TiltCard>
  );
}