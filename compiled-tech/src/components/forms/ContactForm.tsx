"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/forms/FormField";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { contactFields } from "@/data/contact";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return;

    const renderWidget = () => {
      if (!turnstileRef.current || !window.turnstile || turnstileWidgetId.current) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: setTurnstileToken,
        "error-callback": () => setTurnstileToken(""),
        "expired-callback": () => setTurnstileToken(""),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      window.addEventListener("turnstile:ready", renderWidget);
    }

    return () => {
      window.removeEventListener("turnstile:ready", renderWidget);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [siteKey]);

  const onSubmit = async (data: ContactInput) => {
    if (!turnstileToken) {
      setStatus("error");
      setMessage("Please complete the verification before sending.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, "cf-turnstile-response": turnstileToken }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.fieldErrors) {
          Object.entries(json.fieldErrors).forEach(([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : undefined;
            if (message && field in data) {
              setError(field as keyof ContactInput, { type: "server", message });
            }
          });
        }
        throw new Error(json.error || "Something went wrong. Try again, or email us at " + data.email + ".");
      }

      setStatus("success");
      setMessage(`Thanks, ${data.name}. We got your message and will reply within one working day. A copy is on its way to your email.`);
      reset();
      setTurnstileToken("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : `Something went wrong. Try again, or email us at ${data.email}.`);
    }
  };

  const serviceOptions = contactFields.service as unknown as string[];
  const budgetOptions = contactFields.budget as unknown as string[];
  const timelineOptions = contactFields.timeline as unknown as string[];

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => window.dispatchEvent(new Event("turnstile:ready"))}
        />
      )}
      {/* Declarative WebMCP: a static scanner (and an agent reading the raw
          HTML before hydration) can discover what this form does and what each
          field wants. The imperative registerTool() calls only exist after the
          JS bundle runs, which is why the audit scored this page at 36%. */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
        toolname="send_project_enquiry"
        tooldescription="Send a project enquiry to Compiled Tech. Collects name, email, service, budget, timeline and project details, then emails the team. Reply within one working day."
      >
      <FormField
        control={control}
        name="name"
        label="Name"
        type="text"
        toolDescription="Full name of the person making the enquiry"
        placeholder="Your name"
        error={errors.name?.message}
        rules={{ required: "Enter your name" }}
      />

      <FormField
        control={control}
        name="email"
        label="Email"
        type="email"
        toolDescription="Reply-to email address for this enquiry"
        placeholder="you@company.com"
        error={errors.email?.message}
        rules={{ required: "Enter a valid email address" }}
      />

      <FormField
        control={control}
        name="company"
        label="Company (optional)"
        type="text"
        toolDescription="Company or organisation name, optional"
        placeholder="Company name"
      />

      <FormField
        control={control}
        name="service"
        label="Service"
        type="select"
        toolDescription="Which service the project needs"
        options={serviceOptions}
        error={errors.service?.message}
        rules={{ required: "Select a service" }}
      />

      <FormField
        control={control}
        name="budget"
        label="Budget (USD)"
        type="select"
        toolDescription="Budget band for the project, in US dollars"
        options={budgetOptions}
        error={errors.budget?.message}
        rules={{ required: "Select a budget range" }}
      />

      <FormField
        control={control}
        name="timeline"
        label="Timeline"
        type="select"
        toolDescription="When the project should start or finish"
        options={timelineOptions}
        error={errors.timeline?.message}
        rules={{ required: "Select a timeline" }}
      />

      <FormField
        control={control}
        name="details"
        label="Details"
        type="textarea"
        toolDescription="What the project should do, at least 20 characters"
        placeholder="Tell us about your project..."
        error={errors.details?.message}
        rules={{ required: "Tell us a little more (at least 20 characters)" }}
      />

      {/* Honeypot - hidden field, validated by API */}
      <input type="text" {...register("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {/* Turnstile */}
      {siteKey ? (
        <div ref={turnstileRef} aria-label="Security verification" />
      ) : (
        <p className="text-sm text-steel" role="status">
          Verification is not configured yet. Add the Turnstile keys to enable submissions.
        </p>
      )}

      {status === "success" && (
        <div className="flex items-start gap-3 p-4 rounded-[12px] bg-green-900/30 border border-green-500/30" role="status">
          <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-400" aria-hidden="true" />
          <p className="text-green-300">{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-3 p-4 rounded-[12px] bg-red-900/30 border border-red-500/30" role="alert">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-400" aria-hidden="true" />
          <p className="text-red-300">{message}</p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
      </form>
    </>
  );
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        "error-callback": () => void;
        "expired-callback": () => void;
      }) => string;
      remove: (widgetId: string) => void;
    };
  }
}