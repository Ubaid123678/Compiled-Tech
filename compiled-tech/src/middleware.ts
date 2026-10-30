// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { siteConfig } from "@/lib/seo";

// ---------------------------------------------------------------------------
// Agent-readiness layer: content negotiation + resource advertising.
//
// ponytail: only the homepage has a markdown twin. Other paths keep HTML.
// Add markdown routes if agents ever need more — a known ceiling, not an oversight.
// ---------------------------------------------------------------------------
const SITE_SUMMARY = `# ${siteConfig.name}

> ${siteConfig.description}

Software, web and AI development studio in ${siteConfig.location}.
Prices start at $500 for a starter build, $2,000 for a business build, and
$10,000 for a platform build.

Key pages:
- Pricing: ${siteConfig.url}/pricing
- Services: ${siteConfig.url}/services
- Work: ${siteConfig.url}/work
- Contact: ${siteConfig.url}/contact
- Full site map for agents: ${siteConfig.url}/llms.txt

Contact: ${siteConfig.email} · ${siteConfig.phone}
`;

function acceptsMarkdown(request: NextRequest) {
  const accept = request.headers.get("accept") || "";
  // Explicit text/markdown only. Browsers send "*/*" in almost every navigation
  // — treating a wildcard as "wants markdown" would serve raw text to humans.
  return /text\/markdown/i.test(accept);
}

/** Link header advertising the machine-readable resources (RFC 8288). */
function agentLinkHeader(includeMarkdown = false) {
  const links = [`<${siteConfig.url}/llms.txt>; rel="llms-txt"; type="text/plain"`];
  if (includeMarkdown) {
    links.push(`<${siteConfig.url}/>; rel="alternate"; type="text/markdown"`);
  }
  links.push(`<${siteConfig.url}/sitemap.xml>; rel="sitemap"; type="application/xml"`);
  return links.join(", ");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Admin auth (unchanged behaviour) ------------------------------------
  if (pathname.startsWith("/admin")) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const isLoginPath = pathname === "/admin/login";

    if (!isLoginPath && !user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isLoginPath && user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return supabaseResponse;
  }

  // --- Agent negotiation ---------------------------------------------------
  // Homepage can be served as Markdown for agents that ask for it.
  if (pathname === "/" && acceptsMarkdown(request)) {
    return new Response(SITE_SUMMARY, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        // Must vary on Accept so a CDN/browser never serves the markdown
        // variant to a human, or the HTML variant to an agent.
        "Vary": "Accept",
        "Cache-Control": "no-cache",
        "Link": agentLinkHeader(true),
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Link", agentLinkHeader());
  response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  // Skip static assets and API routes; everything else (including /admin) is covered.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
