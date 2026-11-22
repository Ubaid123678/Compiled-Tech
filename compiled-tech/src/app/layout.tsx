import type { Metadata } from "next";
import { Orbitron, Exo_2, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { AnalyticsConsent } from "@/components/analytics/AnalyticsConsent";
import { AgentTools } from "@/components/agents/AgentTools";
import { Suspense } from "react";
import { generateJsonLd, siteConfig } from "@/lib/seo";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const exo = Exo_2({
  variable: "--font-exo",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Compiled Tech",
  description: siteConfig.description,
  icons: {
    icon: { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48 96x96" },
    apple: { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
  },
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    ?? (process.env.NODE_ENV === "production" && siteConfig.url === "https://compiledtech.io"
      ? "G-NHY0XJ7SZP"
      : "");
  const organizationJsonLd = generateJsonLd({
    type: "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    address: siteConfig.location,
    telephone: siteConfig.phone,
    email: siteConfig.email,
  });

  const websiteJsonLd = generateJsonLd({
    type: "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: `${siteConfig.url}/`,
  });

  return (
    <html suppressHydrationWarning lang="en" data-scroll-behavior="smooth" className={`${orbitron.variable} ${exo.variable} ${jetbrains.variable} h-full antialiased`}>
      <head>
        <script
          id="json-ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Bing Webmaster verification — must stay in the HTML even after verification. */}
        <meta name="msvalidate.01" content="9B0E3CCD5051C8D3ED5481693B50BDF1" />
        {/* Scroll-reveal sections ship with inline opacity:0 and are revealed by
            JS. Without JS — or if hydration fails — they would stay invisible,
            so content is forced visible in that case. Animation is decoration;
            the text is the point. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning className="min-h-full bg-ink font-body text-mist antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-steel focus:px-4 focus:py-3 focus:font-display focus:text-xs focus:text-ink">
          Skip to content
        </a>
        <AgentTools />
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        {children}
        {/^G-[A-Z0-9]+$/.test(measurementId) && <AnalyticsConsent measurementId={measurementId} />}
      </body>
    </html>
  );
}