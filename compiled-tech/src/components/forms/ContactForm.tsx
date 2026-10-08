"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/forms/FormField";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { contactFields } from "@/data/contact";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error && typeof json.error === "object") {
          // Field errors
          Object.entries(json.error).forEach(([key, val]) => {
            if (Array.isArray(val)) {
              // Trigger field error display via setError
            }
          });
        }
        throw new Error(json.error || "Something went wrong");
      }

      setStatus("success");
      setMessage(`Thanks, ${data.name}. We got your message and will reply within one working day. A copy is on its way to your email.`);
      reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Try again, or email us directly.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <FormField
        control={control}
        name="name"
        label="Name"
        type="text"
        placeholder="Your name"
        error={errors.name?.message}
        rules={{ required: "Enter your name" }}
      />

      <FormField
        control={control}
        name="email"
        label="Email"
        type="email"
        placeholder="you@company.com"
        error={errors.email?.message}
        rules={{ required: "Enter a valid email address" }}
      />

      <FormField
        control={control}
        name="company"
        label="Company (optional)"
        type="text"
        placeholder="Company name"
      />

      <FormField
        control={control}
        name="service"
        label="Service"
        type="select"
        options={contactFields.service}
        error={errors.service?.message}
        rules={{ required: "Select a service" }}
      />

      <FormField
        control={control}
        name="budget"
        label="Budget (USD)"
        type="select"
        options={contactFields.budget}
        error={errors.budget?.message}
        rules={{ required: "Select a budget range" }}
      />

      <FormField
        control={control}
        name="timeline"
        label="Timeline"
        type="select"
        options={contactFields.timeline}
        error={errors.timeline?.message}
        rules={{ required: "Select a timeline" }}
      />

      <FormField
        control={control}
        name="details"
        label="Details"
        type="textarea"
        placeholder="Tell us about your project..."
        error={errors.details?.message}
        rules={{ required: "Tell us a little more (at least 20 characters)" }}
      />

      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("website")} />

      {/* Turnstile */}
      <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} data-callback={(token: string) => {}} data-error-callback={() => {}} />

      {status === "success" && (
        <div className="flex items-start gap-3 p-4 rounded-[12px] bg-green-900/30 border border-green-500/30" role="status">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-green-300">{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-3 p-4 rounded-[12px] bg-red-900/30 border border-red-500/30" role="alert">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-red-300">{message}</p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}