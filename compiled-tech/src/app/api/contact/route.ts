import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { contactSchema } from "@/lib/validation";

const getResend = () => new Resend(process.env.RESEND_API_KEY);
const getSupabase = () => createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character] || character
  ));
}

function requireEnvironment() {
  const required = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "TURNSTILE_SECRET_KEY"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing server environment variables: ${missing.join(", ")}`);
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY!;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }).toString(),
  });
  const data = await res.json();
  return data.success === true;
}

export async function POST(req: NextRequest) {
  try {
    requireEnvironment();
    const body = await req.json();

    // Verify honeypot
    if (body.website && body.website.trim() !== "") {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    // Validate input
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const data = parsed.data;
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeCompany = escapeHtml(data.company || "Not provided");
    const safeDetails = escapeHtml(data.details).replace(/\n/g, "<br>");

    // Verify Turnstile
    const turnstileToken = data["cf-turnstile-response"];
    if (!turnstileToken) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }
    const turnstileOk = await verifyTurnstile(turnstileToken);
    if (!turnstileOk) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    // Store in Supabase
    const { error: dbError } = await getSupabase().from("leads").insert({
      name: data.name,
      email: data.email,
      company: data.company,
      service: data.service,
      budget: data.budget,
      timeline: data.timeline,
      details: data.details,
      created_at: new Date().toISOString(),
    });

    if (dbError) throw new Error(`Supabase error: ${dbError.message}`);

    // Send email to you
    await getResend().emails.send({
      from: "Compiled Tech <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL!,
      subject: `New project inquiry: ${data.service}`,
      html: `
        <h2>New inquiry from ${safeName}</h2>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Budget:</strong> ${data.budget}</p>
        <p><strong>Timeline:</strong> ${data.timeline}</p>
        <p><strong>Details:</strong></p>
        <p>${safeDetails}</p>
      `,
    });

    // Auto-reply to user
    await getResend().emails.send({
      from: "Compiled Tech <onboarding@resend.dev>",
      to: data.email,
      subject: "We received your message - Compiled Tech",
      html: `
        <p>Thanks, ${safeName}.</p>
        <p>We got your message and will reply within one working day.</p>
        <p>A copy of your inquiry is below:</p>
        <hr>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Budget:</strong> ${data.budget}</p>
        <p><strong>Timeline:</strong> ${data.timeline}</p>
        <p><strong>Details:</strong></p>
        <p>${safeDetails}</p>
        <hr>
        <p>The Compiled Tech team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: `Something went wrong. Try again, or email us at ${process.env.CONTACT_TO_EMAIL || "our email address"}.` },
      { status: 500 }
    );
  }
}