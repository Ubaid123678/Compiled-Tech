import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/content/SectionHeading";
import { ValueTile } from "@/components/cards/ValueTile";
import { TeamCard } from "@/components/cards/TeamCard";
import { CTABand } from "@/components/sections/CTABand";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { aboutData } from "@/data/about";
import Script from "next/script";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "About Compiled Tech",
  description: "Three co-founders from Hasilpur, Punjab, building software you can trust. Learn about our story, mission, values, approach, and team.",
  path: "/about",
  type: "website",
});

export default function AboutPage() {
  const valueIcons = {
    "Honesty first": "shield",
    "Always reachable": "users",
    "Finish the job": "check-circle",
    "Stay after launch": "wrench",
  } as const;

  const teamJsonLd = aboutData.team.map((member) =>
    generateJsonLd({
      type: "Article",
      name: member.name,
      description: member.line,
      url: `${siteConfig.url}/about`,
      author: member.name,
      headline: `${member.name} - ${member.role}`,
      articleSection: "Team",
    })
  );

  const aboutJsonLd = generateJsonLd({
    type: "Organization",
    name: `${siteConfig.name} - About Us`,
    description: aboutData.hero.lead,
    url: `${siteConfig.url}/about`,
    address: siteConfig.location,
    telephone: siteConfig.phone,
    email: siteConfig.email,
  });

  return (
    <>
      <Script
        id="json-ld-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [...teamJsonLd, aboutJsonLd] }) }}
      />
      <PageHero
        title={aboutData.hero.title}
        lead={aboutData.hero.lead}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      <Section id="story" aria-labelledby="story-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="story-heading"
              h2="Our Story"
              className="mb-8 max-w-3xl"
            />
          </Reveal>
          <div className="prose prose-invert max-w-3xl mx-auto space-y-6">
            {aboutData.story.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-mist text-[1.125rem] leading-[1.65]">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="mission" aria-labelledby="mission-heading" className="bg-night/50">
        <Container>
          <Reveal>
            <SectionHeading
              id="mission-heading"
              h2="Our Mission"
              className="mb-8 max-w-3xl"
            />
          </Reveal>
          <div className="prose prose-invert max-w-3xl mx-auto space-y-6">
            {aboutData.mission.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-mist text-[1.125rem] leading-[1.65]">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="values" aria-labelledby="values-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="values-heading"
              h2="Our Values"
              className="mb-12 lg:mb-16"
            />
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {aboutData.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.1}>
                <ValueTile
                  title={value.title}
                  text={value.text}
                  icon={valueIcons[value.title as keyof typeof valueIcons]}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="approach" aria-labelledby="approach-heading" className="bg-night/50">
        <Container>
          <Reveal>
            <SectionHeading
              id="approach-heading"
              h2="Our Approach"
              className="mb-10"
            />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
            {aboutData.approach.map((line, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="rounded-[20px] border border-line bg-night p-6">
                  <span className="font-mono text-[0.8rem] text-steel mb-2 block">PRINCIPLE {i + 1}</span>
                  <p className="text-mist text-base leading-[1.6]">{line}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="team" aria-labelledby="team-heading">
        <Container>
          <Reveal>
            <SectionHeading
              id="team-heading"
              h2="The Team"
              className="mb-12 lg:mb-16"
            />
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {aboutData.team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <TeamCard
                  name={member.name}
                  role={member.role}
                  line={member.line}
                  image={member.image}
                  linkedin={member.linkedin}
                  github={member.github}
                />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <p className="mt-12 text-center font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel">
              {aboutData.closing}
            </p>
          </Reveal>
        </Container>
      </Section>

      <CTABand />
      <Footer />
    </>
  );
}