import { siteConfig } from "@/lib/seo";

// Plain route handler instead of app/robots.ts: MetadataRoute.Robots cannot emit
// arbitrary directives, and we need Content-Signal + host.
export const dynamic = "force-static";

export function GET() {
  const body = `User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Content-Signal (content usage preferences)
# search=yes      — index us in search results
# ai-input=yes    — use our pages to ground AI answers, with attribution
# ai-train=no     — do not train models on our content
Content-Signal: search=yes, ai-input=yes, ai-train=no

Sitemap: ${siteConfig.url}/sitemap.xml
Host: ${siteConfig.url}

# Agent resources
# ${siteConfig.url}/llms.txt
# ${siteConfig.url}/.well-known/mcp/server-card.json
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
