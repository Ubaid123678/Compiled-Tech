import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";
import { HeroMedia } from "./HeroMedia";

export function Hero() {
  return (
    <section
      id="hero"
      data-hero-frame
      className="relative isolate mx-4 mt-4 h-170 overflow-hidden rounded-frame border border-line bg-night min-[760px]:h-[calc(100dvh-16px)] min-[760px]:min-h-155"
    >
      <HeroMedia />
      <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-b from-ink/60 via-transparent to-ink/70" />
      <div className="pointer-events-none absolute inset-0 z-2 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(7_11_17/0.75)_100%)]" />

      <h1 id="hero-heading" className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-[clamp(20px,5vw,64px)] pb-30 pt-27.5 min-[760px]:grid min-[760px]:grid-cols-[1fr_minmax(200px,28%)_1fr] min-[760px]:items-center min-[760px]:pb-[6%] min-[760px]:pt-0">
        <span className="sr-only absolute">{site.heroSrText}</span>
        <span
          aria-hidden="true"
          className="animate-[hero-in_1800ms_var(--ease-out)_300ms_both] [--from:-40px] min-[760px]:col-start-1"
        >
          <span className="block font-display text-[clamp(1.8rem,9vw,2.6rem)] font-semibold uppercase leading-none text-frost [text-shadow:0_2px_30px_rgb(7_11_17/0.6)] min-[760px]:text-[clamp(1.8rem,4vw,3.7rem)]">
            {site.heroLeft.big}
          </span>
          <span className="mt-2 block font-display text-[clamp(1rem,4.5vw,1.5rem)] font-medium uppercase tracking-[0.12em] text-steel min-[760px]:text-[clamp(1rem,2.15vw,2rem)]">
            {site.heroLeft.small}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="animate-[hero-in_1800ms_var(--ease-out)_500ms_both] [--from:40px] w-full max-w-[calc(100vw-72px)] justify-self-end text-right min-[760px]:col-start-3 min-[760px]:max-w-none"
        >
          <span className="block font-display text-[clamp(1.8rem,9vw,2.6rem)] font-semibold uppercase leading-none text-frost [text-shadow:0_2px_30px_rgb(7_11_17/0.6)] min-[760px]:text-[clamp(1.8rem,4vw,3.7rem)]">
            {site.heroRight.big}
          </span>
          <span className="mt-2 block font-display text-[clamp(1rem,4.5vw,1.5rem)] font-medium uppercase tracking-[0.12em] text-steel min-[760px]:text-[clamp(1rem,2.15vw,2rem)]">
            {site.heroRight.small}
          </span>
        </span>
      </h1>

      <div className="animate-[hero-bottom-in_1600ms_var(--ease-out)_900ms_both] absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-4 px-[clamp(20px,5vw,64px)] py-5 min-[760px]:flex-row min-[760px]:flex-wrap min-[760px]:justify-between min-[760px]:gap-6 min-[760px]:py-7">
        <div className="hidden gap-5 min-[760px]:flex">
          {site.socials.map((social) => (
            <a
              key={social.short}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="min-h-11 content-center font-display text-[0.8rem] tracking-[0.12em] text-steel transition-colors hover:text-frost focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel"
            >
              {social.short}
            </a>
          ))}
        </div>
        <p className="hidden font-body text-[0.82rem] uppercase tracking-[0.14em] text-mist min-[900px]:block">
          {site.heroTagline}
        </p>
        <div className="flex w-full gap-2 min-[760px]:w-auto min-[760px]:gap-3">
          <Button href="/contact" size="lg" icon={<ArrowUpRight size={16} strokeWidth={1.7} />} className="min-w-0 shrink px-3 text-[0.62rem] tracking-[0.08em] min-[760px]:flex-none min-[760px]:px-6 min-[760px]:text-[0.72rem] min-[760px]:tracking-[0.14em]">
            Start a Project
          </Button>
          <Button href={site.secondaryCta.href} variant="ghost" size="lg" className="min-w-0 shrink px-3 text-[0.62rem] tracking-[0.08em] min-[760px]:flex-none min-[760px]:px-6 min-[760px]:text-[0.72rem] min-[760px]:tracking-[0.14em]">
            {site.secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
