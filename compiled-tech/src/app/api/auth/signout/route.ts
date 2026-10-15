// app/api/auth/signout/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  await supabase.auth.signOut();

  // Relative Location: resolves against the browser origin, so the fallback
  // host (localhost:3000) can never leak when NEXT_PUBLIC_SITE_URL is unset.
  // ponytail: 303 not 307 — POST is answered with "go look there", not "repeat POST".
  return new NextResponse(null, { status: 303, headers: { Location: "/admin/login" } });
}