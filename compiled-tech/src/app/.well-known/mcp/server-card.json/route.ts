import { siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

// SEP-1649 MCP Server Card.
// Honest scope: this is a content site, not a tool server. We declare the
// resources an agent can fetch over plain HTTP — no RPC endpoint is advertised
// because none exists. If a real MCP server is added later, set `transport`
// and `endpoint` here and the card becomes a true server descriptor.
// ponytail: resources-only card; upgrade by publishing a streamable-http
// MCP endpoint and filling in transport/endpoint below.
export function GET() {
  const card = {
    $schema: "https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/schema/server-card.json",
    name: "compiled-tech",
    displayName: siteConfig.name,
    version: "1.0.0",
    description:
      "Software, web and AI development studio. Public content: services, pricing, case studies, blog and contact details.",
    homepage: siteConfig.url,
    transport: "streamable-http",
    endpoint: `${siteConfig.url}/mcp`,
    capabilities: {
      resources: {
        listChanged: false,
        resources: [
          {
            uri: `${siteConfig.url}/llms.txt`,
            name: "llms.txt",
            description: "Compact site summary for LLMs: services, pricing, pages, contact.",
            mimeType: "text/plain",
          },
          {
            uri: `${siteConfig.url}/`,
            name: "homepage-markdown",
            description: "Homepage as Markdown (send Accept: text/markdown).",
            mimeType: "text/markdown",
          },
          {
            uri: `${siteConfig.url}/sitemap.xml`,
            name: "sitemap",
            description: "All public URLs.",
            mimeType: "application/xml",
          },
        ],
      },
      tools: {
        listChanged: false,
        tools: [
          { name: "list_services", description: "List services grouped by pillar." },
          { name: "list_pricing", description: "Starting prices per project tier." },
          { name: "get_contact_details", description: "Email, phone, location and enquiry form." },
        ],
      },
      prompts: {},
    },
    contact: {
      email: siteConfig.email,
      url: `${siteConfig.url}/contact`,
    },
  };

  return new Response(JSON.stringify(card, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
