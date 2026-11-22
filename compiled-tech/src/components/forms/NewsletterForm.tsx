"use client";

import { type FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTurnstile } from "./use-turnstile";

export function NewsletterForm() {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const sending = useRef(false);
  const { siteKey, turnstileToken, resetVerification, verification } = useTurnstile(active);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    if (!turnstileToken) {
      setActive(true);
      setStatus("error");
      setMessage("Complete verification to subscribe.");
      return;
    }

    sending.current = true;
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const values = new FormData(form);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.get("email"),
          website: values.get("website"),
          token: turnstileToken,
        }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || "Please try again.");
      setStatus("success");
      setMessage("Check your inbox for a confirmation link. If you already subscribed, there’s nothing else to do.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      sending.current = false;
      resetVerification();
    }
  }

  if (!siteKey) return <p className="text-sm text-mist">Newsletter signup is temporarily unavailable.</p>;

  return (
    <form className="flex w-full max-w-sm flex-col gap-3" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your email"
          required
          maxLength={254}
          onFocus={() => setActive(true)}
          className="min-w-0 flex-1 rounded-[12px] border border-line bg-night px-4 py-3 text-base text-frost placeholder:text-mist/40 focus:border-steel"
          aria-label="Email address"
        />
        <Button type="submit" loading={status === "sending"}>
          {status === "sending" ? "Sending..." : "Subscribe"}
        </Button>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {verification}
      {message && (
        <p className="text-sm text-steel" role={status === "error" ? "alert" : "status"}>{message}</p>
      )}
    </form>
  );
}
