import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const getResend = () => new Resend(process.env.RESEND_API_KEY || "re_dummy");
const getSupabase = () => createClient(
  process.env.SUPABASE_URL || "http://localhost:54321",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy"
);

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const { error } = await getSupabase().from("newsletter").insert({
      email,
      created_at: new Date().toISOString(),
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
      }
      console.error("Newsletter DB error:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    try {
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Compiled Tech <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to Compiled Tech insights",
        html: `
          <p>Thanks for subscribing!</p>
          <p>You'll get notes on software and AI from our team.</p>
          <hr>
          <p>— Compiled Tech</p>
        `,
      });
    } catch (emailError) {
      console.error("Newsletter welcome email error:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}