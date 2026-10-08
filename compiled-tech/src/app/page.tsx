import { Header, Footer, Container, Section } from "@/components/layout";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-18 lg:pt-15">
        <Section id="hero" className="relative min-h-screen flex items-center justify-center">
          <Container>
            <h1 className="font-display uppercase tracking-[0.01em] text-frost text-[clamp(1.8rem,4vw,3.7rem)] leading-[1]">
              COMPILED TECH
            </h1>
          </Container>
        </Section>
        <Section id="test-section" className="bg-night">
          <Container>
            <h2 className="font-display uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              Layout Test
            </h2>
            <p className="text-mist text-lg leading-[1.65] max-w-2xl">
              Header, Container, Section, and Footer are working. Resize to test breakpoints.
            </p>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}