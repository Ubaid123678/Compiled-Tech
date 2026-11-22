"use client";

import Link from "next/link";

export default function PageError({ reset }: { reset: () => void }) {
  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-2xl px-6 pb-20 pt-36 text-frost">
      <h1 className="font-display text-2xl">This page is temporarily unavailable</h1>
      <p className="my-5">Try again in a moment. You can still reach us through the contact page.</p>
      <div className="flex flex-wrap items-center gap-5">
        <button type="button" className="rounded-full border border-line px-5 py-2" onClick={reset}>Try again</button>
        <Link href="/contact" className="underline">Contact us</Link>
      </div>
    </main>
  );
}
