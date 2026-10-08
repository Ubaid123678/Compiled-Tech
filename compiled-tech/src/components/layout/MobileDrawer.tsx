"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export function MobileDrawer({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogOverlay className="bg-ink/90 backdrop-blur-[14px] fixed inset-0 z-50" />
      <DialogContent
        className={cn(
          "fixed inset-0 z-50 max-w-none border-none bg-transparent p-0 shadow-none",
          "flex flex-col items-center justify-center gap-8"
        )}
        onPointerDown={(e) => e.target === e.currentTarget && close()}
      >
        <button
          className="absolute top-6 right-6 p-2 text-mist hover:text-frost transition-colors lg:hidden"
          onClick={close}
          aria-label="Close menu"
        >
          <X className="w-8 h-8" />
        </button>
        <nav className="flex flex-col items-center gap-6 text-center" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="font-display uppercase text-[clamp(1.4rem,4vw,2rem)] tracking-[0.12em] text-frost hover:text-steel transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="primary" size="lg" className="w-full max-w-xs" onClick={close} asChild>
          <Link href="/contact">Start a Project</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}