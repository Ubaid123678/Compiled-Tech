import { siteConfig } from "@/lib/seo";
import { pillars } from "@/data/services";
import { pricingTiers } from "@/data/pricing";

export const dynamic = "force-static";

// llms.txt: a compact map of the site for LLM agents (llmstxt.org convention).
// It IS a Markdown file: H1 first, and every reference a real [label](url) link —
// the PageSpeed agent audit checks for both, and agents parse them.
export function GET() {
  const services = pillars
    .map(
      (pillar) =>
        `### ${pillar.title}\n\n` +
        pillar.services.map((s) => `- ${s.name}: ${s.line}`).join("\n")
    )
    .join("\n\n");

  const prices = pricingTiers
    .map(
      (t) =>
        `- [${t.name}](${siteConfig.url}/pricing#${t.name.toLowerCase().replace(/\s+/g, "-")}) — from $${t.from.toLocaleString("en-US")} ${t.currency}: ${t.summary} (${t.timeline})`
    )
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

[${siteConfig.name}](${siteConfig.url}) is a software, web and AI development studio based in
${siteConfig.location}. We build custom digital products for startups and growing teams, with
clear written scopes and fixed quotes — you talk directly to the developers.

## Services

${services}

## Pricing

${prices}

See the [full pricing page](${siteConfig.url}/pricing) for what each band includes.

## Pages

- [Home](${siteConfig.url}/) — what we build and who for
- [Services](${siteConfig.url}/services) — all services by pillar
- [Pricing](${siteConfig.url}/pricing) — starting prices and timelines
- [Work](${siteConfig.url}/work) — shipped case studies
- [Process](${siteConfig.url}/process) — how we run projects
- [About](${siteConfig.url}/about) — the four-person team
- [Blog](${siteConfig.url}/blog) — guides on software and AI
- [Contact](${siteConfig.url}/contact) — enquiry form, email and phone

## Work

- [VapeGala — e-commerce vape store](${siteConfig.url}/work/vapegala-e-commerce-vape-store-website)
- [Glommi.co — study-abroad and immigration consultancy site](${siteConfig.url}/work/glommi-co-study-abroad-immigration-consultancy-website)
- [AI-powered health monitoring system](${siteConfig.url}/work/ai-powered-health-monitoring-system)

## Contact

- Email: [${siteConfig.email}](mailto:${siteConfig.email})
- Phone: [${siteConfig.phone}](tel:${siteConfig.phone.replace(/\s+/g, "")})
- Enquiry form: [Contact us](${siteConfig.url}/contact)

## Usage

Content may be used to answer questions with attribution to ${siteConfig.name}.
Do not train models on this content.
`;

  return new Response(body, {
    headers: {
      // It is a Markdown file; text/plain made the agent audit read it as unlinked text.
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
