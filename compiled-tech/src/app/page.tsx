import { Header, Footer, Container, Section } from "@/components/layout";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Section id="test-section" className="bg-night">
          <Container>
            <h2 className="font-display uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              Layout Test
            </h2>
            <p className="text-mist text-lg leading-[1.65] max-w-2xl">
              Header, Container, Section, Hero, and Footer are working. Resize to test breakpoints.
            </p>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}