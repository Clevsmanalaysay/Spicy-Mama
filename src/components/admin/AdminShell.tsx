"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  Clapperboard,
  PartyPopper,
  Inbox,
  Users,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/lib/use-auth";
import { getFirebaseAuth } from "@/lib/firebase-auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Clapperboard },
  { href: "/admin/events", label: "Events", icon: PartyPopper },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { name, role } = useAuth();

  async function handleSignOut() {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
  }

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line-light bg-ink text-paper lg:flex">
        <div className="border-b border-line p-5">
          <Logo />
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-paper-dim">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 p-4" aria-label="Admin">
          {navItems.map((item) => {
            if (item.adminOnly && role !== "admin") return null;
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  active ? "bg-hot text-ink" : "text-paper-dim hover:bg-ink-soft hover:text-paper",
                )}
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-4">
          <Link href="/" target="_blank" className="focus-ring flex items-center gap-2 text-xs text-paper-dim hover:text-hot">
            <ExternalLink className="size-3.5" aria-hidden="true" />
            View public site
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line-light bg-white px-6 py-4">
          <div>
            <p className="font-display text-sm font-bold text-ink">{name}</p>
            <p className="text-xs uppercase tracking-wide text-ink/50">{role}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="focus-ring flex items-center gap-2 rounded-full border border-line-light px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink hover:border-hot-deep hover:text-hot-deep"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </button>
        </header>
        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
