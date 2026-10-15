import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Chip } from "@/components/content/Chip";
import { cn } from "@/lib/utils";

type CaseCardProps = {
  slug: string;
  title: string;
  category: "Web" | "Mobile" | "AI";
  excerpt: string;
  year: number;
  role: string;
  image: string;
  thumbnail: string;
  featured?: boolean;
};

export function CaseCard({ slug, title, category, excerpt, year, role, image, thumbnail, featured }: CaseCardProps) {
  const imageSrc = featured ? image || thumbnail : thumbnail || image;

  return (
    <article className={cn(
      "group overflow-hidden rounded-[20px] border border-line bg-night transition-all duration-300 ease-out hover:-translate-y-1 hover:border-steel/40 hover:shadow-[0_18px_42px_rgb(0_0_0_/_0.28)]",
      featured && "lg:grid lg:grid-cols-[1.1fr_0.9fr]"
    )}>
      <Link
        href={`/work/${slug}`}
        className={cn("relative block aspect-[16/10] overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel", featured && "lg:aspect-auto lg:min-h-96")}
        aria-label={`View ${title} case study`}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${title} project preview`}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes={featured ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            loading={featured ? "eager" : "lazy"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate text-center font-display text-sm uppercase tracking-[0.14em] text-mist/70">
            {title}
          </div>
        )}
      </Link>

      <div className={cn("flex flex-col p-6", featured && "lg:p-8") }>
        <div className="mb-5 flex items-center justify-between gap-4">
          <Chip variant="category">{category}</Chip>
          <span className="text-sm text-mist/60">{year}</span>
        </div>
        <Link href={`/work/${slug}`} className="group/title focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel">
          <h3 className={cn("mb-3 flex items-start justify-between gap-3 font-display text-[1.15rem] font-semibold uppercase leading-[1.3] tracking-[0.02em] text-frost", featured && "text-[clamp(1.35rem,2vw,1.8rem)]")}>
            {title}
            <ArrowUpRight size={18} strokeWidth={1.7} className="mt-0.5 shrink-0 text-steel transition-transform duration-300 group-hover/title:translate-x-1 group-hover/title:-translate-y-1" aria-hidden="true" />
          </h3>
        </Link>
        <p className={cn("text-mist/80 leading-[1.6]", featured ? "text-base" : "line-clamp-3 text-sm")}>{excerpt}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-6 text-sm text-mist/60" aria-label="Project role">
          <span>{role}</span>
        </div>
      </div>
    </article>
  );
}