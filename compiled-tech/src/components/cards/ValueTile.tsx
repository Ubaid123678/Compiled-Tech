import {
  Shield,
  Users,
  CheckCircle,
  Wrench,
} from "lucide-react";
import { slugify } from "@/lib/utils";

const valueIcons = {
  shield: Shield,
  users: Users,
  "check-circle": CheckCircle,
  wrench: Wrench,
} as const;

type ValueTileProps = {
  title: string;
  text: string;
  icon: keyof typeof valueIcons;
};

export function ValueTile({ title, text, icon }: ValueTileProps) {
  const Icon = valueIcons[icon];

  return (
    <article className="border-t border-line pt-8">
      <div className="text-steel mb-4" aria-hidden="true">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3
        id={slugify(title)}
        className="font-display font-semibold uppercase tracking-[0.06em] text-frost text-[1.15rem] leading-[1.3] mb-2"
      >
        {title}
      </h3>
      <p className="text-mist text-base leading-[1.6]">{text}</p>
    </article>
  );
}