import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// One endpoint for both admin lists. Body: { table: "blogs" | "projects", ids: string[] }
const TABLES = { blogs: "blog_posts", projects: "work_projects" } as const;
type TableKey = keyof typeof TABLES;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const table = body?.table as TableKey | undefined;
  const ids = body?.ids;

  if (!table || !(table in TABLES) || !Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Expected { table, ids: string[] }" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  // ponytail: one UPDATE per row (fine for a blog/portfolio list, tens of rows).
  // Swap for a single upsert if a list ever grows into the hundreds.
  const results = await Promise.all(
    ids.map((id, index) => admin.from(TABLES[table]).update({ sort_order: index }).eq("id", id))
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) {
    return NextResponse.json({ error: failed.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
