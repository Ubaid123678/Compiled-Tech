import { PageHero } from "@/components/layout/PageHero";
import { CTABand } from "@/components/sections/CTABand";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { pricingTiers } from "@/data/pricing";
import { generatePageMetadata, siteConfig } from "@/lib/seo";
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
        seller: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
    })),
  };

  return (
    <>
      <script
        id="json-ld-pricing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />
      <PageHero
        title="Pricing"
        lead="Starting prices, in the open. Every project is scoped and quoted in writing before work begins."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        showHexagon={false}
      />

      <Section id="pricing">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <article
                key={tier.name}
                id={tier.name.toLowerCase().replace(/\s+/g, "-")}
                className={`flex flex-col rounded-[20px] border bg-night p-6 ${
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

                <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-mist">
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
            ))}
          </div>

          <p className="mt-8 text-center text-mist/70">
            Prices are starting points in USD; final quotes depend on scope. Not sure which
            band you need? <Link href="/contact" className="text-steel underline underline-offset-2 hover:text-frost">Tell us the project</Link> and we will reply with a fixed price.
          </p>
        </Container>
      </Section>

      <CTABand />
      <Footer />
    </>
  );
}
