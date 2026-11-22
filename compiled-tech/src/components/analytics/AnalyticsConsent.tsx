"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Preference = "allow" | "decline" | "unset";
const storageKey = "compiled-tech-analytics";
const changeEvent = "compiled-tech-analytics-change";
let sessionPreference: Preference = "unset";
let configured = false;

function preference(): Preference {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === "allow" || saved === "decline" ? saved : sessionPreference;
  } catch {
    return sessionPreference;
  }
}

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(changeEvent, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(changeEvent, listener);
  };
}

function save(value: Preference) {
  sessionPreference = value;
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // The preference still applies during the current page session.
  }
  window.dispatchEvent(new Event(changeEvent));
}

function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${location.hostname}`;
  }
}

function setAnalytics(id: string, enabled: boolean) {
  const browser: Window & { dataLayer?: unknown[] } = window;
  Reflect.set(browser, `ga-disable-${id}`, !enabled);
  if (!enabled || configured) return;

  configured = true;
  browser.dataLayer ??= [];
  function gtag(...args: unknown[]) {
    // The Google tag consumes the Arguments object in the official snippet.
    // eslint-disable-next-line prefer-rest-params
    if (args.length) browser.dataLayer?.push(arguments);
  }
  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("js", new Date());
  gtag("config", id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

export function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  const choice = useSyncExternalStore(subscribe, preference, () => null);
  const path = usePathname();
  const privatePage = path === "/admin" || path.startsWith("/admin/") || path.startsWith("/newsletter/");

  useEffect(() => {
    setAnalytics(measurementId, !privatePage && choice === "allow");
    if (choice === "decline") clearAnalyticsCookies();
  }, [measurementId, privatePage, choice]);

  function changeChoice(value: "allow" | "decline") {
    setAnalytics(measurementId, value === "allow");
    if (value === "decline") clearAnalyticsCookies();
    save(value);
  }

  if (choice === null || privatePage) return null;

  return (
    <>
      {choice === "unset" && (
        <aside aria-label="Optional analytics" className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-lg rounded-xl border border-line bg-ink p-4 text-sm text-frost shadow-xl">
          <p>Allow Google Analytics to help us understand how visitors use the site? See our{" "}
            <Link href="/privacy#analytics" className="underline">privacy policy</Link>.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="rounded-md border border-line px-3 py-2" onClick={() => changeChoice("decline")}>Decline analytics</button>
            <button type="button" className="rounded-md border border-line px-3 py-2" onClick={() => changeChoice("allow")}>Allow analytics</button>
          </div>
        </aside>
      )}
      {path === "/privacy" && (
        <div className="mx-auto max-w-3xl px-6 pb-8 text-sm text-frost">
          <button type="button" className="rounded-md border border-line px-3 py-2" onClick={() => changeChoice(choice === "allow" ? "decline" : "allow")}>
            {choice === "allow" ? "Turn off analytics" : "Allow analytics"}
          </button>
          <p className="mt-2" role="status">Optional analytics are {choice === "allow" ? "on" : "off"}.</p>
        </div>
      )}
    </>
  );
}
