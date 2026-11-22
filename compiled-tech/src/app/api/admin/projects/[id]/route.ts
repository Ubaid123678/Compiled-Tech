// app/api/admin/projects/[id]/route.ts
import { authorizeAdminMutation } from "@/lib/admin-session";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const denied = await authorizeAdminMutation(request);
  if (denied) return denied;

  const { error } = await getSupabaseAdmin().from("work_projects").delete().eq("id", id);
  if (error) {
    console.error("Admin operation failed", error);
    return NextResponse.json({ error: "Could not complete this operation" }, { status: 500 });
  }

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
