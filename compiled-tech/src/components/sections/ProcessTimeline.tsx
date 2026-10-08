"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/content/SectionHeading";
import { processSteps } from "@/data/process";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panels = panelRefs.current.filter((panel): panel is HTMLElement => Boolean(panel));
    const context = gsap.context(() => {
      if (!reduceMotion) {
        gsap.fromTo(
          panels,
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          },
        );
      }

      panels.forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  const jumpToStep = (index: number) => {
    panelRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section ref={sectionRef} id="process" className="relative" aria-labelledby="process-heading">
      <div className="mx-auto max-w-300 px-4 py-16 sm:px-6 lg:px-16 lg:py-26">
        <SectionHeading
          id="process-heading"
          eyebrow="HOW WE WORK"
          h2="From first call to live product"
          className="mb-12 text-center lg:mb-16"
        />
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <nav className="flex gap-5 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:block lg:h-fit" aria-label="Process steps">
            {processSteps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => jumpToStep(index)}
                className={cn(
                  "group flex min-w-20 flex-col items-center gap-2 px-1 py-2 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel lg:mb-7 lg:w-full",
                  activeIndex === index ? "text-frost" : "text-mist/60 hover:text-frost",
                )}
                aria-current={activeIndex === index ? "step" : undefined}
              >
                <span className={cn(
                  "flex size-14 items-center justify-center rounded-full border font-display text-sm transition-all duration-300",
                  activeIndex === index ? "border-frost bg-frost text-ink shadow-[0_0_30px_rgb(233_239_246/0.4)]" : "border-line bg-night text-steel group-hover:border-steel",
                )}>
                  {step.number}
                </span>
                <span className="font-mono text-[0.68rem]">{String(step.number).padStart(2, "0")}</span>
                <span className="font-display text-xs uppercase tracking-widest">{step.title}</span>
              </button>
            ))}
          </nav>

          <div>
            {processSteps.map((step, index) => (
              <article
                key={step.number}
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                className={cn(
                  "flex min-h-[62vh] scroll-mt-24 items-center border-t border-line py-16 transition-opacity duration-500 lg:min-h-[72vh]",
                  activeIndex === index ? "opacity-100" : "opacity-45",
                )}
                aria-labelledby={`step-${step.number}-title`}
              >
                <div className="max-w-2xl">
                  <span className="font-mono text-sm text-steel">0{step.number}</span>
                  <h3 id={`step-${step.number}-title`} className="mt-5 font-display text-[clamp(1.7rem,4vw,3.2rem)] font-semibold uppercase leading-[1.1] tracking-[0.02em] text-frost">
                    {step.title}
                  </h3>
                  <p className="mt-6 max-w-xl text-[1.125rem] leading-[1.65] text-mist">{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
