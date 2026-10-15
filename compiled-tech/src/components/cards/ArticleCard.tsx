import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

type ArticleCardProps = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  image?: string;
  featured?: boolean;
};

export function ArticleCard({ slug, title, category, excerpt, date, readTime, author, image, featured }: ArticleCardProps) {
  const baseClasses = "group relative rounded-[20px] border border-line bg-night overflow-hidden transition-all duration-400 ease-out hover:border-steel/40 hover:shadow-[0_10px_30px_rgb(185_198_212_/_0.25)]";
  const imageSrc = image || "/hero/poster.svg";

  if (featured) {
    return (
      <article className={`${baseClasses} lg:grid lg:grid-cols-[1fr_1fr]`}>
        <Link href={`/blog/${slug}`} className="relative block aspect-[16/10] lg:aspect-auto lg:h-full focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover transition-transform duration-400 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading="eager"
          />
        </Link>
        <div className="p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <span className="inline-block font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-3">{category}</span>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.15] mb-3">
              {title}
            </h2>
            <p className="text-mist/80 text-base leading-[1.6] mb-4">{excerpt}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-mist/60 text-sm">
            <span>{date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" aria-hidden="true" />
              {readTime}
            </span>
            <span>·</span>
            <span>{author}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={baseClasses}>
      <Link href={`/blog/${slug}`} className="relative block aspect-[16/10] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover transition-transform duration-400 ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      </Link>
      <div className="p-6">
        <span className="inline-block font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-3">{category}</span>
        <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.15rem] leading-[1.3] mb-2">
          <Link href={`/blog/${slug}`} className="hover:text-steel transition-colors">{title}</Link>
        </h3>
        <p className="text-mist/80 text-sm leading-[1.5] mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex flex-wrap items-center gap-3 text-mist/60 text-sm">
          <span>{date}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" aria-hidden="true" />
            {readTime}
          </span>
          <span>·</span>
          <span>{author}</span>
        </div>
      </div>
    </article>
  );
}