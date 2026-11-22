import { siteConfig } from "@/lib/seo";

// Plain route handler instead of app/robots.ts: MetadataRoute.Robots cannot emit
// arbitrary directives such as Content-Signal.
export const dynamic = "force-static";

export function GET() {
  const body = `User-agent: *
Disallow: /admin$
Disallow: /admin/
Disallow: /api/

# Declare content usage preferences for crawlers that support this directive.
Content-Signal: search=yes, ai-input=yes, ai-train=no

Sitemap: ${siteConfig.url}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
