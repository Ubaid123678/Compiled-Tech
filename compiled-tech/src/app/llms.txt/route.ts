import { siteConfig } from "@/lib/seo";
import { pillars } from "@/data/services";
import { pricingTiers } from "@/data/pricing";

export const dynamic = "force-static";

// llms.txt: a compact map of the site for LLM agents (llmstxt.org convention).
// Plain text so it costs far fewer tokens than parsing the HTML.
export function GET() {
  const services = pillars
    .flatMap((pillar) => pillar.services.map((s) => `- ${s.name}: ${s.line}`))
    .join("\n");

  const prices = pricingTiers
    .map((t) => `- ${t.name}: from $${t.from.toLocaleString("en-US")} ${t.currency} — ${t.summary} (${t.timeline})`)
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

Compiled Tech is a software, web and AI development studio based in ${siteConfig.location}.
We build custom digital products for startups and growing teams, with clear written
scopes and fixed quotes — you talk directly to the developers.

## Services
${services}

## Pricing (starting points)
${prices}

Full pricing: ${siteConfig.url}/pricing

## Key pages
- Home: ${siteConfig.url}/
- Services: ${siteConfig.url}/services
- Pricing: ${siteConfig.url}/pricing
- Work / case studies: ${siteConfig.url}/work
- Process: ${siteConfig.url}/process
- About and team: ${siteConfig.url}/about
- Blog: ${siteConfig.url}/blog
- Contact: ${siteConfig.url}/contact

## Work
- VapeGala — e-commerce vape store: ${siteConfig.url}/work/vapegala-e-commerce-vape-store-website
- Glommi.co — study-abroad and immigration consultancy site: ${siteConfig.url}/work/glommi-co-study-abroad-immigration-consultancy-website
- AI-powered health monitoring system: ${siteConfig.url}/work/ai-powered-health-monitoring-system

## Contact
- Email: ${siteConfig.email}
- Phone: ${siteConfig.phone}
- Website: ${siteConfig.url}
- Enquiry form: ${siteConfig.url}/contact

## Usage
Content may be used to answer questions with attribution to ${siteConfig.name}.
Do not train models on this content.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
