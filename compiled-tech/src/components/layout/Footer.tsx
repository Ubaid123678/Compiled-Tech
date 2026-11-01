import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { X, Mail, MessageSquare, MapPin, LucideIcon } from "lucide-react";
import { Container } from "./Container";
import { Reveal } from "@/components/motion/Reveal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { nav } from "@/data/nav";
import { contactInfo } from "@/data/contact";
import { slugify } from "@/lib/utils";

type SocialLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type NavLink = {
  label: string;
  href: string;
  icon?: LucideIcon;
  target?: string;
};

const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/compiled-tech/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/compiledtech15",
    icon: <X className="w-5 h-5" aria-hidden="true" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/compiled.tech/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@compiled_tech.io",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

const footerNav: Record<string, NavLink[]> = {
  Services: [
    { label: "Web & Mobile App Development", href: "/services/build#web-mobile-app-development" },
    { label: "AI Automation & AI Agents", href: "/services/automate-analyze#ai-automation-ai-agents" },
    { label: "AI Chatbots & Virtual Assistants", href: "/services/ai-ml#ai-chatbots-virtual-assistants" },
    { label: "AI Data & Document Processing", href: "/services/ai-ml#ai-data-document-processing" },
    { label: "Custom AI & Machine Learning", href: "/services/ai-ml#custom-ai-machine-learning" },
    { label: "SaaS & Custom Software Development", href: "/services/build#saas-custom-software-development" },
    { label: "E-commerce Development", href: "/services/build#e-commerce-development" },
  ],
  Pages: nav.map((item) => ({ label: item.label, href: item.href })),
  Contact: [
    { label: "hello@compiledtech.io", href: "mailto:hello@compiledtech.io", icon: Mail },
    { label: "+92 310 734 9552", href: contactInfo.whatsapp, icon: MessageSquare, target: "_blank" },
    { label: "Hasilpur, Punjab, Pakistan", href: "#", icon: MapPin },
  ],
};

function IconWrapper({ Icon, className }: { Icon: React.ReactNode; className?: string }) {
  return <span className={className}>{Icon}</span>;
}

export function Footer() {
  return (
    <footer suppressHydrationWarning className="bg-night border-t border-line">
      <Container className="py-10 lg:py-14">
        <Reveal className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 mb-10">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4" aria-label="Compiled Tech home">
              <Image
                src="/logo/compiled-tech-icon-for-dark-bg.svg"
                alt=""
                width={28}
                height={28}
                className="text-frost"
              />
              <span className="font-display font-semibold text-[0.9rem] tracking-[0.16em] uppercase text-frost">
                COMPILED TECH
              </span>
            </Link>
            <p className="text-mist text-sm leading-relaxed mb-4 max-w-xs">
              We compile ideas into intelligent software.
            </p>
            <div className="flex gap-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mist/60 hover:text-frost transition-colors"
                    aria-label={s.label}
                  >
                    <IconWrapper Icon={s.icon} className="w-5 h-5" />
                  </a>
                ))}
            </div>
          </div>

          {Object.entries(footerNav).map(([title, links]) => (
            <div key={title}>
              <h3 id={`footer-${slugify(title)}`} className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.target}
                      rel={link.target ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2 text-mist/80 hover:text-frost transition-colors text-sm"
                    >
                      {link.icon && <IconWrapper Icon={<link.icon className="w-4 h-4 text-mist/50" aria-hidden="true" />} />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {title === "Contact" && (
                <Button variant="primary" size="md" className="mt-4 w-full" asChild>
                  <Link href="/contact">Start a Project</Link>
                </Button>
              )}
            </div>
          ))}
        </Reveal>

        <div className="flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel">
              Newsletter
            </span>
            <NewsletterForm />
          </div>
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-5 lg:shrink-0">
            <p className="text-mist/50">
              © 2026 Compiled Tech. All rights reserved.
            </p>
            <Link href="/privacy" className="text-mist/60 hover:text-frost transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-mist/60 hover:text-frost transition-colors text-sm">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}