"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export function useTurnstile(active = true) {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationFailed, setVerificationFailed] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!active || !siteKey || !turnstileRef.current) return;

    const renderWidget = () => {
      if (!turnstileRef.current || !window.turnstile || turnstileWidgetId.current) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          setTurnstileToken(token);
          setVerificationFailed(false);
        },
        "error-callback": () => {
          setTurnstileToken("");
          setVerificationFailed(true);
        },
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
  }, [siteKey, active]);

  function resetVerification() {
    setTurnstileToken("");
    if (turnstileWidgetId.current) window.turnstile?.reset(turnstileWidgetId.current);
  }

  const verification = (
    <>
      {siteKey && active && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => { window.dispatchEvent(new Event("turnstile:ready")); }}
          onError={() => setVerificationFailed(true)}
        />
      )}
      {siteKey && active && <div ref={turnstileRef} aria-label="Security verification" />}
      {verificationFailed && <p role="alert">Verification could not load. Try reloading the page.</p>}
    </>
  );

  return { siteKey, turnstileToken, resetVerification, verification };
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
      reset: (widgetId: string) => void;
    };
  }
}
