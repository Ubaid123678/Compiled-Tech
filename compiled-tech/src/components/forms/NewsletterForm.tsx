"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const email = new FormData(form).get("email");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");
      setStatus("success");
      setMessage("Subscribed.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Try again.");
    }
  }

  return (
    <form
      className="flex w-full flex-col gap-2 sm:w-[320px] sm:flex-row"
      onSubmit={onSubmit}
      toolname="subscribe_newsletter"
      tooldescription="Subscribe an email address to the Compiled Tech newsletter. Takes one parameter: email."
    >
      <input
        type="email"
        name="email"
        toolparamdescription="Email address to subscribe to the newsletter"
        placeholder="Enter your email"
        required
        className="min-w-0 flex-1 rounded-[12px] border border-line bg-night px-4 py-3 text-sm text-frost placeholder:text-mist/40 transition-colors focus:border-steel focus:outline-none"
        aria-label="Email address"
      />
      <Button type="submit" variant="primary" size="md" className="whitespace-nowrap" loading={status === "sending"}>
        {status === "sending" ? "Sending..." : "Subscribe"}
      </Button>
      {message && (
        <p className={status === "error" ? "text-sm text-red" : "text-sm text-steel"} role={status === "error" ? "alert" : "status"}>
          {message}
        </p>
      )}
    </form>
  );
}
