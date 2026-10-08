"use client";

import { useState, useEffect } from "react";
import { SectionHeading } from "@/components/content/SectionHeading";
import { StepNode } from "@/components/cards/StepNode";
import { StepPanel } from "@/components/cards/StepPanel";
import { processSteps } from "@/data/process";
import { cn } from "@/lib/utils";

export function ProcessTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isDesktop) {
    return (
      <section id="process" className="relative" aria-labelledby="process-heading">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16">
          <SectionHeading
            id="process-heading"
            eyebrow="HOW WE WORK"
            h2="From first call to live product"
            className="mb-12 lg:mb-16 text-center"
          />
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
            <div className="sticky top-24 flex flex-col items-center gap-8 lg:gap-12">
              {processSteps.map((step, i) => (
                <StepNode
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  active={i === activeIndex}
                />
              ))}
              <div
                className="hidden lg:block w-px h-[500px] bg-gradient-to-b from-line via-steel/30 to-line"
                aria-hidden="true"
              />
            </div>
            <div className="w-full">
              {processSteps.map((step, i) => (
                <StepPanel
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  text={step.text}
                  active={i === activeIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="process" aria-labelledby="process-heading">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16 py-16 lg:py-26">
        <SectionHeading
          id="process-heading"
          eyebrow="HOW WE WORK"
          h2="From first call to live product"
          className="mb-12 lg:mb-16 text-center"
        />
        <div className="space-y-12">
          {processSteps.map((step) => (
            <article key={step.number} className="flex gap-6">
              <StepNode number={step.number} title={step.title} active={true} />
              <div className="flex-1 pt-2">
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.15rem,2vw,1.35rem)] leading-[1.3] mb-2">
                  Step {step.number}: {step.title}
                </h3>
                <p className="text-mist text-base leading-[1.65]">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}