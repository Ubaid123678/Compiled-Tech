import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { contactSchema } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = await res.json();
  return data.success === true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify honeypot
    if (body.website && body.website.trim() !== "") {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    // Validate input
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify Turnstile
    const turnstileOk = await verifyTurnstile(data["cf-turnstile-response"]);
    if (!turnstileOk) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    // Store in Supabase
    const { error: dbError } = await supabase.from("leads").insert({
      name: data.name,
      email: data.email,
      company: data.company,
      service: data.service,
      budget: data.budget,
      timeline: data.timeline,
      details: data.details,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Supabase error:", dbError);
    }

    // Send email to you
    await resend.emails.send({
      from: "Compiled Tech <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL!,
      subject: `New project inquiry: ${data.service}`,
      html: `
        <h2>New inquiry from ${data.name}</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || "—"}</p>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Budget:</strong> ${data.budget}</p>
        <p><strong>Timeline:</strong> ${data.timeline}</p>
        <p><strong>Details:</strong></p>
        <p>${data.details.replace(/\n/g, "<br>")}</p>
      `,
    });

    // Auto-reply to user
    await resend.emails.send({
      from: "Compiled Tech <onboarding@resend.dev>",
      to: data.email,
      subject: "We received your message — Compiled Tech",
      html: `
        <p>Thanks, ${data.name}.</p>
        <p>We got your message and will reply within one working day.</p>
        <p>A copy of your inquiry is below:</p>
        <hr>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Budget:</strong> ${data.budget}</p>
        <p><strong>Timeline:</strong> ${data.timeline}</p>
        <p><strong>Details:</strong></p>
        <p>${data.details.replace(/\n/g, "<br>")}</p>
        <hr>
        <p>— The Compiled Tech team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again, or email us directly." },
      { status: 500 }
    );
  }
}