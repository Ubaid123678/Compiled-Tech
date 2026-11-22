import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSiteAdmin } from "@/lib/admin-role";
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- www → apex redirect ---------------------------------------------------
  // www.compiledtech.io resolves to a separate Hostinger CDN host that answers
  // 200 instead of redirecting, so both hosts are indexable. One 301 here merges
  // the signals; the canonical/sitemap/schema are already non-www.
  const host = (request.headers.get("host") || "").toLowerCase();
  if (host === "www.compiledtech.io") {
    const url = request.nextUrl.clone();
    url.host = "compiledtech.io";
    url.protocol = "https:";
    // Strip any internal port so the target is always the clean public URL.
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  // --- Admin access ------------------------------------
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    let supabaseResponse = NextResponse.next({ request });

    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return new NextResponse("Admin is temporarily unavailable", {
      status: 503, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
    });

    const supabase = createServerClient(
      url,
      key,
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

    const authorized = isSiteAdmin(user);
    let response = supabaseResponse;
    if (!isLoginPath && !authorized) {
      response = new NextResponse(null, { status: 307, headers: { Location: "/admin/login" } });
    } else if (isLoginPath && authorized) {
      response = new NextResponse(null, { status: 307, headers: { Location: "/admin" } });
    }
    if (response !== supabaseResponse) {
      for (const cookie of supabaseResponse.cookies.getAll()) response.cookies.set(cookie);
    }
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex");
    return response;
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
