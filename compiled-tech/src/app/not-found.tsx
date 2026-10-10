import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <PageHero
        title="Page not found"
        lead="That page does not exist. Go back home or start a project."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "404" },
        ]}
        showHexagon={false}
      />

      <Section className="py-16 lg:py-26">
        <Container className="max-w-md text-center">
          <div className="space-y-6">
            <Button href="/" size="lg" icon={<span className="w-5 h-5">←</span>}>
              Back Home
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              Start a Project
            </Button>
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}