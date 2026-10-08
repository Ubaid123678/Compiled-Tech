import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, X, Mail, MessageSquare, MapPin } from "lucide-react";
import { Container } from "./Container";

const socialLinks = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "X", href: "https://x.com", icon: X },
];

const footerNav = {
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
    { label: "+1 555 000 0000", href: "https://wa.me/15550000000", icon: MessageSquare },
    { label: "San Francisco, USA", href: "#", icon: MapPin },
  ],
};

export function Footer() {
  return (
    <footer className="bg-night border-t border-line">
      <Container className="py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4" aria-label="Compiled Tech home">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="text-frost">
                <rect width="32" height="32" rx="6" fill="currentColor" />
                <path d="M16 8 L16 24 M8 16 L24 16" stroke="#070B11" strokeWidth="3" strokeLinecap="round" />
              </svg>
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
                  <s.icon className="w-5 h-5" aria-hidden="true" />
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
                      {link.icon && <link.icon className="w-4 h-4 text-mist/50" aria-hidden="true" />}
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
        </div>

        <div className="border-t border-line pt-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <span className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-2 md:mb-0">
                Newsletter
              </span>
              <form className="flex flex-col sm:flex-row gap-2 w-full sm:w-[320px]" action="/api/newsletter" method="POST">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel transition-colors text-sm"
                  aria-label="Email address"
                />
                <Button type="submit" variant="primary" size="md" className="whitespace-nowrap">
                  Subscribe
                </Button>
              </form>
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