// app/api/admin/projects/[id]/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await getSupabaseAdmin().from("work_projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const response = await DELETE(req, context);
  if (!response.ok) return response;

  // Relative Location: resolves against the browser's current origin, so the
  // app's internal host (0.0.0.0:3000 behind Hostinger's proxy) never leaks.
  // ponytail: 303 not 307 so the browser turns POST into GET for the list page.
  return new NextResponse(null, { status: 303, headers: { Location: "/admin/projects" } });
}