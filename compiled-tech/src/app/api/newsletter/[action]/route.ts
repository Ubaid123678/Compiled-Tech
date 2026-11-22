import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { readNewsletterAction } from "@/lib/newsletter";
import { siteConfig } from "@/lib/seo";

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (action !== "confirm" && action !== "unsubscribe") return new NextResponse(null, { status: 404 });

  const origin = request.headers.get("origin");
  if (origin && origin !== siteConfig.url && origin !== new URL(request.url).origin) {
    return new NextResponse(null, { status: 403 });
  }

  let status = "invalid";
  try {
    const values = await request.formData();
    const id = readNewsletterAction(action, String(values.get("token") || ""));
    if (id) {
      const db = getSupabaseAdmin();
      if (action === "confirm") {
        const result = await db.rpc("confirm_newsletter_subscription", { request_id: id });
        if (result.error) throw result.error;
        if (result.data) status = "done";
      } else {
        const pending = await db.from("newsletter_pending").delete().eq("id", id);
        if (pending.error) throw pending.error;
        const subscriber = await db.from("newsletter").delete().eq("id", id);
        if (subscriber.error) throw subscriber.error;
        status = "done";
      }
    }
  } catch {
    console.error("Newsletter preference could not be updated", { action });
    status = "error";
  }

  return new NextResponse(null, {
    status: 303,
    headers: { Location: `/newsletter/${action}?status=${status}`, "Referrer-Policy": "no-referrer" },
  });
}
