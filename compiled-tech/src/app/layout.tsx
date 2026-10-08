import type { Metadata } from "next";
import { Orbitron, Exo_2, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
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
  weight: ["300", "400", "500"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Compiled Tech",
  description: "We compile ideas into intelligent software.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}