"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cta, nav } from "@/data/nav";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const wasOpen = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
      firstLinkRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      document.body.style.overflow = previous;
      menuButtonRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = document.querySelectorAll<HTMLElement>("#mobile-menu a, #mobile-menu button");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header
        className={`animate-[header-in_1600ms_var(--ease-out)_100ms_both] fixed inset-x-0 z-50 h-18 transition-all duration-500 ease-out ${
          scrolled
            ? "top-0 h-15 border-b border-line bg-ink/80 backdrop-blur-[14px]"
            : "top-4 bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-full items-center justify-between px-[calc(16px+clamp(20px,5vw,64px))]">
          <Link
            href="/#hero"
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel"
            aria-label="Compiled Tech home"
            onClick={(event) => {
              if (pathname !== "/") return;
              event.preventDefault();
              document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
              setOpen(false);
            }}
          >
            <Image src="/logo/compiled-tech-icon-for-dark-bg.svg" alt="" width={28} height={28} loading="eager" className="min-[900px]:size-8" />
            <span className="font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-frost min-[900px]:text-[0.95rem] min-[900px]:tracking-[0.16em]">
              Compiled Tech
            </span>
          </Link>

          <nav className="hidden items-center gap-6 min-[900px]:flex" aria-label="Main navigation">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative font-body text-[0.92rem] tracking-[0.04em] transition-colors after:absolute after:-bottom-1.25 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-frost after:transition-transform after:duration-150 hover:text-frost hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel ${
                    active ? "text-frost after:scale-x-100" : "text-mist/88"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center">
            <div className="hidden min-[900px]:block">
              <Button href={cta.href} icon={<ArrowUpRight size={16} strokeWidth={1.7} />}>
                {cta.label}
              </Button>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              className="flex size-10 items-center justify-center text-mist transition-colors hover:text-frost focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel min-[900px]:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col items-center justify-start bg-ink/90 px-6 pt-28 backdrop-blur-[14px] min-[900px]:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-4" aria-label="Mobile navigation">
              {nav.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-[clamp(1.15rem,3.5vw,1.6rem)] uppercase tracking-[0.16em] text-frost focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="absolute inset-x-6 bottom-100 flex justify-center">
              <Button
                href={cta.href}
                size="md"
                className="px-5 text-[0.64rem]"
                icon={<ArrowUpRight size={15} strokeWidth={1.7} />}
                onClick={() => setOpen(false)}
              >
                {cta.label}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
