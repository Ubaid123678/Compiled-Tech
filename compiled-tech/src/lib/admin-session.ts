import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSiteAdmin } from "./admin-role";
import { siteConfig } from "./seo";

export async function getAdminSession() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { user: null, supabase: null };

  const store = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: () => {}, // Proxy refreshes the session before rendering admin pages.
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  return { user, supabase };
}

export async function authorizeAdminMutation(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== siteConfig.url && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const { user } = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Sign in to continue" }, { status: 401 });
  if (!isSiteAdmin(user)) return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  return null;
}
