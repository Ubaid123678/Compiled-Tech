import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend, type CreateEmailOptions } from "resend";
import { z } from "zod";
import { contactInfo } from "@/data/contact";
import { contactSchema } from "@/lib/validation";
import { inquiryAdminEmail, inquiryReceivedEmail } from "@/lib/email-template";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyTurnstile } from "@/lib/turnstile";

const requestSchema = contactSchema.extend({
  requestId: z.uuid().optional(),
  "cf-turnstile-response": z.string().min(1, "Complete the verification").max(2048),
});

const retryWindowMs = 23 * 60 * 60 * 1000;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character
  );
}

async function sendLeadEmail(
  db: ReturnType<typeof getSupabaseAdmin>,
  resend: Resend | null,
  requestId: string,
  column: "admin_email_id" | "customer_email_id",
  existingId: string | null,
  email: CreateEmailOptions,
) {
  if (existingId) return true;
  if (!resend) {
    console.error("Lead email configuration is missing", { requestId, column });
    return false;
  }

  try {
    const { data, error } = await resend.emails.send(email, { idempotencyKey: `lead/${requestId}/${column}` });
    if (error || !data?.id) {
      console.error("Lead email was not accepted", { requestId, column, code: error?.name });
      return false;
    }
    const result = await db.from("leads").update({ [column]: data.id }).eq("request_id", requestId);
    if (result.error) console.error("Could not record lead email ID", { requestId, column, code: result.error.code });
    return true;
  } catch {
    console.error("Lead email request failed", { requestId, column });
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = requestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the highlighted fields and complete verification.", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const {
      requestId = crypto.randomUUID(),
      "cf-turnstile-response": token,
      name, email, company, service, budget, timeline, details,
    } = parsed.data;
    if (!await verifyTurnstile(token)) {
      return NextResponse.json({ error: "Verification expired or failed. Please try again." }, { status: 400 });
    }

    const lead = { name, email, company: company || null, service, budget, timeline, details };
    const fingerprint = createHash("sha256").update(JSON.stringify(lead)).digest("hex");
    const db = getSupabaseAdmin();
    const saved = await db.from("leads").upsert(
      { ...lead, request_id: requestId, request_fingerprint: fingerprint },
      { onConflict: "request_id", ignoreDuplicates: true },
    );
    if (saved.error) throw saved.error;

    const { data: record, error } = await db.from("leads")
      .select("request_fingerprint, created_at, admin_email_id, customer_email_id")
      .eq("request_id", requestId).single();
    if (error) throw error;
    if (record.request_fingerprint !== fingerprint) {
      return NextResponse.json({ error: "The inquiry changed. Please submit it again." }, { status: 409 });
    }

    // Resend retains idempotency keys for 24 hours. Never retry after that window.
    if (Date.now() - Date.parse(record.created_at) >= retryWindowMs) {
      return NextResponse.json({
        success: true,
        copyAccepted: Boolean(record.customer_email_id),
        teamNotified: Boolean(record.admin_email_id),
      });
    }

    const mail = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      company: escapeHtml(company || "Not provided"),
      service, budget, timeline,
      details: escapeHtml(details).replace(/\n/g, "<br>"),
    };
    const from = process.env.RESEND_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;
    const resend = from && apiKey ? new Resend(apiKey) : null;

    const [adminAccepted, copyAccepted] = await Promise.all([
      sendLeadEmail(db, to ? resend : null, requestId, "admin_email_id", record.admin_email_id, {
        from: from || "", to: to || "", replyTo: email,
        subject: `New project inquiry: ${service}`,
        html: inquiryAdminEmail(mail),
      }),
      sendLeadEmail(db, resend, requestId, "customer_email_id", record.customer_email_id, {
        from: from || "", to: email,
        subject: "We received your message — Compiled Tech",
        html: inquiryReceivedEmail(mail),
      }),
    ]);

    return NextResponse.json({ success: true, copyAccepted, teamNotified: adminAccepted });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
    console.error("Could not process inquiry", { code });
    return NextResponse.json(
      { error: `We couldn't confirm your submission. Try again, or email ${contactInfo.email}.` },
      { status: 503 },
    );
  }
}
