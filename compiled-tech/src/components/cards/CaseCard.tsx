import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Chip } from "@/components/content/Chip";
import { Badge } from "@/components/content/Badge";
import { cn } from "@/lib/utils";
import { featuredWork } from "@/data/work";

type CaseCardProps = {
  slug: string;
};

export function CaseCard({ slug }: CaseCardProps) {
  const project = featuredWork.find((w) => w.slug === slug);
  if (!project) return null;

  return (
    <article className="group relative rounded-[20px] border border-line bg-night overflow-hidden transition-all duration-400 ease-out hover:border-steel/40 hover:shadow-[0_10px_30px_rgb(185_198_212_/_0.25)]">
      <Link
        href={`/work/${project.slug}`}
        className="block relative aspect-[16/10] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel"
        aria-label={`View ${project.title} case study`}
      >
        <Image
          src={project.image}
          alt=""
          fill
          className="object-cover transition-transform duration-400 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Chip variant="category">{project.category}</Chip>
          {project.sample && <Badge variant="sample">SAMPLE PROJECT</Badge>}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.15rem] leading-[1.3] mb-2 flex items-center gap-2">
            {project.title}
            <ArrowUpRight size={16} strokeWidth={1.7} className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </h3>
          <p className="text-mist/80 text-sm leading-[1.5] line-clamp-2">{project.line}</p>
        </div>
      </Link>
      <div className="p-6 pt-0 flex flex-wrap gap-2" role="list" aria-label="Tech stack">
        {project.stack.map((tech, i) => (
          <Chip key={i} variant="default">{tech}</Chip>
        ))}
      </div>
    </article>
  );
}