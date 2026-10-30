import { Orbitron, Exo_2, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { AgentTools } from "@/components/agents/AgentTools";
import { Suspense } from "react";
import { generatePageMetadata, generateJsonLd, siteConfig } from "@/lib/seo";
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

export const metadata = generatePageMetadata({
  title: "Compiled Tech | Software and AI Studio",
  description: "Compiled Tech builds web apps, mobile apps, SaaS and AI solutions for startups and growing teams. Technical SEO, Core Web Vitals optimization, and search visibility that drives qualified traffic.",
  path: "/",
  type: "website",
});

export default function RootLayout({ children }: React.PropsWithChildren) {
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
    url: siteConfig.url,
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
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="robots" href="/robots.txt" />
        {/* Bing Webmaster verification — must stay in the HTML even after verification. */}
        <meta name="msvalidate.01" content="9B0E3CCD5051C8D3ED5481693B50BDF1" />
      </head>
      <body suppressHydrationWarning className="min-h-full bg-ink font-body text-mist antialiased">
        {/* Google Analytics — inline so it ships in the HTML stream; next/script's
            default strategy injects it client-side, which loses the early pageview. */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NHY0XJ7SZP" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-NHY0XJ7SZP');`,
          }}
        />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-steel focus:px-4 focus:py-3 focus:font-display focus:text-xs focus:text-ink">
          Skip to content
        </a>
        <AgentTools />
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        {children}
      </body>
    </html>
  );
}