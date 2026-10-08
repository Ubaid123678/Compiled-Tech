import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { X, Mail, MessageSquare, MapPin, LucideIcon } from "lucide-react";
import { Container } from "./Container";
import { Reveal } from "@/components/motion/Reveal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

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
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: <X className="w-5 h-5" aria-hidden="true" />,
  },
];

const footerNav: Record<string, NavLink[]> = {
  Services: [
    { label: "Build", href: "/services/build" },
    { label: "AI and ML", href: "/services/ai-ml" },
    { label: "Automate and Analyze", href: "/services/automate-analyze" },
    { label: "Advise and Support", href: "/services/advise-support" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Process", href: "/process" },
    { label: "Work", href: "/work" },
    { label: "Blog", href: "/blog" },
  ],
  Contact: [
    { label: "hello@compiled.tech", href: "mailto:hello@compiled.tech", icon: Mail },
    { label: "+1 555 000 0000", href: "https://wa.me/15550000000", icon: MessageSquare, target: "_blank" },
    { label: "San Francisco, USA", href: "#", icon: MapPin },
  ],
};

function IconWrapper({ Icon, className }: { Icon: React.ReactNode; className?: string }) {
  return <span className={className}>{Icon}</span>;
}

export function Footer() {
  return (
    <footer className="bg-night border-t border-line">
      <Container className="py-16 lg:py-24">
        <Reveal className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16 mb-16">
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
            <p className="text-mist text-sm leading-relaxed mb-6 max-w-xs">
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
              <h3 className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
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

        <div className="border-t border-line pt-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <span className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-2 md:mb-0">
                Newsletter
              </span>
              <NewsletterForm />
            </div>
            <div className="border-t border-line pt-8 w-full md:w-auto md:border-t-0 md:border-l md:pl-8">
              <p className="text-mist/50 text-sm">
                © 2026 Compiled Tech. Software only.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/privacy" className="text-mist/60 hover:text-frost transition-colors text-sm">
              Privacy
            </Link>
            <Link href="/terms" className="text-mist/60 hover:text-frost transition-colors text-sm">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}