import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { siteConfig } from "@/lib/seo";
import { signNewsletterAction } from "@/lib/newsletter";
import { verifyTurnstile } from "@/lib/turnstile";

const schema = z.object({
  email: z.string().trim().max(254).email().transform((email) => email.toLowerCase()),
  token: z.string().min(1).max(2048),
  website: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email address and complete verification." }, { status: 400 });
    }

    const { email, token } = parsed.data;
    if (!await verifyTurnstile(token)) {
      return NextResponse.json({ error: "Verification expired. Please try again." }, { status: 400 });
    }

    const from = process.env.RESEND_FROM_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;
    if (!from || !apiKey) throw new Error("Newsletter email is not configured");

    const id = crypto.randomUUID();
    const confirmation = signNewsletterAction("confirm", id);
    const unsubscribe = signNewsletterAction("unsubscribe", id);
    const db = getSupabaseAdmin();
    const { data: pending, error: dbError } = await db.rpc("request_newsletter_confirmation", {
      address: email,
      request_id: id,
    });
    if (dbError) throw dbError;

    if (pending) {
      const { data, error } = await new Resend(apiKey).emails.send({
        from, to: email,
        subject: "Confirm your Compiled Tech newsletter subscription",
        html: `<p>Confirm that you want to receive updates from Compiled Tech.</p>
<p><a href="${siteConfig.url}/newsletter/confirm?token=${confirmation}">Confirm subscription</a></p>
<p>Use the most recent confirmation email within 24 hours. If you didn't request this, you can ignore this email.</p>
<p><a href="${siteConfig.url}/newsletter/unsubscribe?token=${unsubscribe}">Unsubscribe</a></p>`,
      }, { idempotencyKey: `newsletter/${id}` });
      if (error || !data?.id) {
        console.error("Newsletter confirmation email was not accepted", { id, code: error?.name });
        throw new Error("Could not send confirmation email");
      }
    }

    // Return the same response for existing subscribers and requests on cooldown.
    return NextResponse.json({ success: true });
  } catch {
    console.error("Could not process newsletter signup");
    return NextResponse.json({ error: "Newsletter signup is temporarily unavailable. Please try again later." }, { status: 503 });
  }
}
