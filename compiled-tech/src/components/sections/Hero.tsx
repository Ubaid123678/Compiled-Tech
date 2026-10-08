"use client";

import { motion } from "framer-motion";
import { HeroMedia } from "@/components/motion/HeroMedia";
import { HeadlineSplit } from "@/components/motion/HeadlineSplit";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const frameVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: easeOut } },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-18 lg:pt-15">
      <Container>
        <motion.div
          className="w-full aspect-[16/9] max-h-[800px] min-h-[620px] md:min-h-[680px]"
          variants={frameVariants}
          initial="hidden"
          animate="visible"
          role="img"
          aria-label="Compiled Tech hero background"
        >
          <HeroMedia
            poster="/hero/poster.svg"
            videoWebm="/hero/hero.webm"
            videoMp4="/hero/hero.mp4"
            className="w-full h-full"
          />
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-between px-6 lg:px-16 pointer-events-none">
          <div className="w-full max-w-[1200px] pointer-events-auto">
            <HeadlineSplit
              leftTop="COMPILE"
              leftBottom="IDEAS"
              rightTop="INTO"
              rightBottom="INTELLIGENCE"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-[1200px] gap-8 pb-10 pointer-events-auto">
            <SocialLinks />

            <div className="hidden lg:block text-center">
              <p className="font-display uppercase text-[0.82rem] tracking-[0.12em] text-mist">
                Web, apps, SaaS and AI. Software only.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" asChild>
                <Link href="/contact">Start a Project</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/work">See Our Work</Link>
              </Button>
            </div>
          </div>
        </div>

        <h1 className="sr-only">Compiled Tech builds software and AI for startups and growing teams</h1>
      </Container>
    </section>
  );
}