"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/venue", label: "Venue" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring font-display text-sm font-bold uppercase tracking-wide transition-colors",
                  active ? "text-hot" : "text-paper hover:text-hot-bright",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <LinkButton href="/venue#booking-form" size="md">
            Book the venue
          </LinkButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="focus-ring inline-flex items-center justify-center rounded-md p-2 text-paper lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Primary mobile" className="border-t border-line bg-ink px-6 pb-6 lg:hidden">
          <ul className="flex flex-col gap-1 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring block rounded px-2 py-3 font-display text-base font-bold uppercase tracking-wide text-paper hover:text-hot"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <LinkButton href="/venue#booking-form" className="mt-4 w-full" onClick={() => setOpen(false)}>
            Book the venue
          </LinkButton>
        </nav>
      ) : null}
    </header>
  );
}
