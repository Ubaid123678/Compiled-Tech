"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { MobileDrawer } from "./MobileDrawer";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-18 transition-all duration-250 ease-out",
        scrolled
          ? "h-15 bg-ink/80 backdrop-blur-[14px] border-b border-line"
          : "bg-transparent"
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="flex items-center gap-3" aria-label="Compiled Tech home">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="text-frost">
              <rect width="32" height="32" rx="6" fill="currentColor" />
              <path d="M16 8 L16 24 M8 16 L24 16" stroke="#070B11" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="font-display font-semibold text-[0.95rem] tracking-[0.16em] uppercase text-frost">
              COMPILED TECH
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-4 lg:gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body text-[0.92rem] tracking-[0.04em] transition-colors duration-150 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-frost after:transition-all after:duration-150",
                  link.href === "/"
                    ? "text-frost after:w-full"
                    : "text-mist/88 hover:text-frost hover:after:w-full"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="md" asChild>
              <Link href="/contact">Start a Project</Link>
            </Button>
            <button
              className="lg:hidden p-2 text-mist hover:text-frost transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>
      <MobileDrawer open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}