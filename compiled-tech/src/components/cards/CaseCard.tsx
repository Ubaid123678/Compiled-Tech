import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Chip } from "@/components/content/Chip";
import { Badge } from "@/components/content/Badge";
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
  return (
    <article className={cn("group relative rounded-[20px] border border-line bg-night overflow-hidden transition-all duration-400 ease-out hover:border-steel/40 hover:shadow-[0_10px_30px_rgb(185_198_212/0.25)]", featured && "lg:grid lg:grid-cols-[1fr_1fr]")}>
      <Link
        href={`/work/${slug}`}
        className={cn("relative block aspect-[16/10] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel", featured && "lg:aspect-auto lg:h-full")}
        aria-label={`View ${title} case study`}
      >
        <Image
          src={featured ? image : thumbnail}
          alt=""
          fill
          className="object-cover transition-transform duration-400 ease-out group-hover:scale-[1.02]"
          sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          priority={featured}
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Chip variant="category">{category}</Chip>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.15rem] leading-[1.3] mb-2 flex items-center gap-2">
            <span className={featured ? "text-[clamp(1.25rem,2vw,1.75rem)]" : ""}>{title}</span>
            <ArrowUpRight size={16} strokeWidth={1.7} className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </h3>
          <p className={cn("text-mist/80 leading-normal", featured ? "text-base" : "text-sm line-clamp-2")}>{excerpt}</p>
        </div>
      </Link>
      {!featured && (
        <div className="p-6 pt-0 flex flex-wrap gap-2" role="list" aria-label="Tech stack">
          <span className="text-mist/60 text-sm">{year}</span>
          <span className="text-mist/60 text-sm">·</span>
          <span className="text-mist/60 text-sm">{role}</span>
        </div>
      )}
    </article>
  );
}