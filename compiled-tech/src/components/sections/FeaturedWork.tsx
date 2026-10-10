import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/content/SectionHeading";
import { CaseCard } from "@/components/cards/CaseCard";
import { getWorkProjects } from "@/lib/work";
import { Reveal } from "@/components/motion/Reveal";

import { WorkProject } from "@/lib/work";

export async function FeaturedWork() {
  const projects: WorkProject[] = (await getWorkProjects()).slice(0, 3);

  return (
    <section id="work" aria-labelledby="work-heading">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16 py-12 lg:py-20">
        <Reveal>
          <SectionHeading
            id="work-heading"
            eyebrow="WORK"
            h2="Selected projects"
            lead="Selected projects we have built and shipped."
            className="mb-12 lg:mb-16"
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {projects.map((project) => (
            <Reveal key={project.slug}>
              <CaseCard
                slug={project.slug}
                title={project.title}
                category={project.category}
                excerpt={project.excerpt}
                year={project.year}
                role={project.role}
                image={project.image}
                thumbnail={project.thumbnail}
                featured={false}
              />
            </Reveal>
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