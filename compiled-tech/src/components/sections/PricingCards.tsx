"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { pricingTiers } from "@/data/pricing";

// Shared by /pricing and the homepage pricing section — single source for the
// tier card markup, so the two pages can't drift.
export function PricingCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {pricingTiers.map((tier, index) => (
        <Reveal key={tier.name} delay={index * 0.08}>
          <article
            id={tier.name.toLowerCase().replace(/\s+/g, "-")}
            className={`flex h-full flex-col rounded-[20px] border bg-night p-6 transition-all duration-300 hover:-translate-y-1 hover:border-steel/50 hover:shadow-[0_18px_42px_rgb(0_0_0_/_0.28)] ${
              "popular" in tier && tier.popular ? "border-steel/60" : "border-line"
            }`}
          >
            {"popular" in tier && tier.popular && (
              <span className="mb-3 self-start rounded-full border border-steel/40 bg-slate/50 px-3 py-1 font-display text-[0.68rem] uppercase tracking-[0.18em] text-steel">
                Most common
              </span>
            )}
            <h2 className="font-display text-[1.15rem] font-semibold uppercase tracking-[0.02em] text-frost">
              {tier.name}
            </h2>
            <p className="mt-3 text-mist">{tier.summary}</p>

            <p className="mt-6 font-display text-[2rem] font-semibold leading-none text-frost">
              <span className="text-[0.9rem] font-normal text-mist/70">from </span>$
              {tier.from.toLocaleString("en-US")}
              <span className="ml-1 text-[0.9rem] font-normal text-mist/70">{tier.currency}</span>
            </p>
            <p className="mt-2 text-sm text-mist/60">Typical timeline: {tier.timeline}</p>

            <ul className="mt-6 flex-1 space-y-2 border-t border-line pt-5 text-sm text-mist">
              {tier.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-steel">—</span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-steel px-6 font-display text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink transition-all hover:-translate-y-0.5 hover:bg-frost"
            >
              Get a quote
            </Link>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
