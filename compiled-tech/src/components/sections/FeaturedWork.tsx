import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/content/SectionHeading";
import { CaseCard } from "@/components/cards/CaseCard";
import { featuredWork } from "@/data/work";

export function FeaturedWork() {
  return (
    <section id="work" aria-labelledby="work-heading">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16 py-16 lg:py-26">
        <SectionHeading
          id="work-heading"
          eyebrow="WORK"
          h2="Selected projects"
          lead="Sample projects are shown until client work is published."
          className="mb-12 lg:mb-16"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {featuredWork.map((project) => (
            <CaseCard key={project.slug} slug={project.slug} />
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 font-display uppercase text-[0.72rem] tracking-[0.14em] text-steel hover:text-frost transition-colors"
          >
            View all work
            <ArrowUpRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}