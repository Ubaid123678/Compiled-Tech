import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type ServiceTileProps = {
  name: string;
  line: string;
  icon: React.ReactNode;
  href?: string;
};

export function ServiceTile({ name, line, icon, href }: ServiceTileProps) {
  const content = (
    <article className="group relative rounded-[20px] border border-line bg-night p-6 transition-all duration-300 ease-out hover:border-steel/40 hover:shadow-[0_10px_30px_rgb(185_198_212_/_0.25)] hover:-translate-y-1">
      <div className="text-steel mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.15rem] leading-[1.3] mb-2">
        {name}
      </h3>
      <p className="text-mist/80 text-base leading-[1.6]">{line}</p>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 mt-4 font-display uppercase text-[0.72rem] tracking-[0.14em] text-steel hover:text-frost transition-colors"
        >
          View details
          <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </article>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}