import type { Metadata } from "next";
import { Orbitron, Exo_2, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
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
  title: "Compiled Tech | Software and AI studio",
  description: "Compiled Tech builds web apps, mobile apps, SaaS and AI solutions for startups and growing teams.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="en" className={`${orbitron.variable} ${exo.variable} ${jetbrains.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full bg-ink font-body text-mist antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-steel focus:px-4 focus:py-3 focus:font-display focus:text-xs focus:text-ink">
          Skip to content
        </a>
        <Header />
        {children}
      </body>
    </html>
  );
}