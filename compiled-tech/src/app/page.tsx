import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <section className="h-[120vh]" aria-hidden="true">
        {/* TODO remove, only for testing the header scroll state */}
      </section>
    </main>
  );
}