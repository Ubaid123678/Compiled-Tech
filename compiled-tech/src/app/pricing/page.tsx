import { PageHero } from "@/components/layout/PageHero";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { pricingTiers } from "@/data/pricing";
import { PricingCards } from "@/components/sections/PricingCards";
import { generatePageMetadata, generateJsonLd, siteConfig, organizationId } from "@/lib/seo";
import Link from "next/link";

export const metadata = generatePageMetadata({
  title: "Pricing — Web, App & AI Development",
  description:
    "Starting prices for web apps, mobile apps, e-commerce, SaaS and AI chatbots. Transparent project bands from $500 to $10,000+, with timelines and what each includes.",
  path: "/pricing",
  type: "website",
  tags: [
    "web development pricing",
    "app development cost",
    "AI chatbot cost",
    "SaaS development pricing",
    "software development rates",
  ],
});

export default function PricingPage() {
  // Offer schema per tier so agents/crawlers can read real prices without JS.
  const breadcrumbJsonLd = generateJsonLd({
    type: "BreadcrumbList",
    name: "Breadcrumb",
    description: "Breadcrumb navigation",
    url: `${siteConfig.url}/pricing`,
    items: [{ label: "Home", href: "/" }, { label: "Pricing" }],
  });

  const offersJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: pricingTiers.map((tier, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: tier.name,
        description: tier.summary,
        priceCurrency: tier.currency,
        price: tier.from,
        priceSpecification: {
          "@type": "PriceSpecification",
          price: tier.from,
          priceCurrency: tier.currency,
          valueAddedTaxIncluded: false,
        },
        availability: "https://schema.org/InStock",
        url: `${siteConfig.url}/pricing#${tier.name.toLowerCase().replace(/\s+/g, "-")}`,
        seller: { "@id": organizationId },
      },
    })),
  };

  return (
    <>
      <script
        id="json-ld-pricing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [offersJsonLd, breadcrumbJsonLd] }) }}
      />
      <PageHero
        title="Pricing"
        lead="Starting prices, in the open. Every project is scoped and quoted in writing before work begins."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        showHexagon={false}
      />

      <Section id="pricing">
        <Container>
          <PricingCards />
          <p className="mt-8 text-center text-mist/70">
              Prices are starting points in USD; final quotes depend on scope. Not sure which
              band you need?{" "}
              <Link href="/contact" className="text-steel underline underline-offset-2 hover:text-frost">
                Tell us the project
              </Link>{" "}
              and we will reply with a fixed price.
            </p>
        </Container>
      </Section>

      <CTABand />
      <Footer />
    </>
  );
}
