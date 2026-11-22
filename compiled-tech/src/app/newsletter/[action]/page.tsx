import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { contactInfo } from "@/data/contact";

export const metadata: Metadata = { title: "Newsletter preferences", robots: { index: false, follow: false } };

export default async function NewsletterPreferencePage({
  params, searchParams,
}: {
  params: Promise<{ action: string }>;
  searchParams: Promise<{ status?: string; token?: string }>;
}) {
  const { action } = await params;
  if (action !== "confirm" && action !== "unsubscribe") notFound();

  const { status, token } = await searchParams;
  const isConfirm = action === "confirm";
  const validFormat = typeof token === "string" && /^[a-f0-9-]{36}\.[a-f0-9]{64}$/i.test(token);
  const message = status === "done"
    ? (isConfirm ? "Your newsletter subscription is confirmed." : "You’ve unsubscribed.")
    : status === "error"
      ? "We couldn't update your preference. Reopen the link in your email and try again."
      : "This link is invalid or has expired.";

  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-2xl px-6 pb-20 pt-36">
      <h1 className="mb-6 font-display text-2xl text-frost">{isConfirm ? "Confirm subscription" : "Unsubscribe"}</h1>
      {validFormat ? (
        <form method="post" action={`/api/newsletter/${action}`}>
          <input type="hidden" name="token" value={token} />
          <Button type="submit">{isConfirm ? "Confirm subscription" : "Unsubscribe"}</Button>
        </form>
      ) : <p>{message}</p>}
      <p className="mt-6">Need help? <a className="underline" href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
    </main>
  );
}
