import { siteConfig } from "@/lib/seo";

// Plain route handler instead of app/robots.ts: MetadataRoute.Robots cannot emit
// arbitrary directives, and we need Content-Signal + host.
export const dynamic = "force-static";

export function GET() {
  const body = `User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# AI search / answer engines: allowed to read and cite our pages.
# ai-train=no in Content-Signal below means: do not use this content to train models.
User-Agent: GPTBot
Allow: /
Disallow: /admin/

User-Agent: OAI-SearchBot
Allow: /

User-Agent: ChatGPT-User
Allow: /

User-Agent: ClaudeBot
Allow: /

User-Agent: Claude-SearchBot
Allow: /

User-Agent: PerplexityBot
Allow: /

User-Agent: Google-Extended
Allow: /

User-Agent: Applebot-Extended
Allow: /

User-Agent: Bingbot
Allow: /

User-Agent: CCBot
Allow: /

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
