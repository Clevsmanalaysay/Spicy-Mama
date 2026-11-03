"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clapperboard, PartyPopper, Inbox, Pencil, Users, Home } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { listBookingsAdmin, listMessagesAdmin } from "@/lib/admin-data";

const quickLinks = [
  { href: "/", label: "Edit the homepage", icon: Home },
  { href: "/studio", label: "Edit services & FAQ", icon: Pencil },
  { href: "/venue", label: "Edit the venue & house rules", icon: Pencil },
  { href: "/about", label: "Edit team & press", icon: Pencil },
  { href: "/contact", label: "Edit contact info & socials", icon: Pencil },
  { href: "/work", label: "Add a new film or collaboration", icon: Clapperboard },
  { href: "/events", label: "Add an event and its photos", icon: PartyPopper },
  { href: "/admin/inbox", label: "Handle inquiries and bookings", icon: Inbox },
  { href: "/admin/users", label: "Manage staff", icon: Users, adminOnly: true },
];

export default function AdminDashboardPage() {
  const { name, role } = useAuth();
  const [newMessages, setNewMessages] = useState<number | null>(null);
  const [newBookings, setNewBookings] = useState<number | null>(null);

  useEffect(() => {
    listMessagesAdmin()
      .then((msgs) => setNewMessages(msgs.filter((m) => m.status === "new").length))
      .catch(() => setNewMessages(null));
    listBookingsAdmin()
      .then((bookings) => setNewBookings(bookings.filter((b) => b.status === "new").length))
      .catch(() => setNewBookings(null));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Welcome back{name ? `, ${name}` : ""}.</h1>
      <p className="mt-1 text-ink/60">
        Page content is edited right on the live site — visit a page and turn on <strong>Edit this page</strong> in
        the bar at the bottom. This dashboard is just for inquiries, bookings and staff access.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line-light bg-white p-6">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-ink/50">New messages</p>
          <p className="mt-2 font-display text-4xl font-bold text-hot-deep">{newMessages ?? "—"}</p>
          <Link href="/admin/inbox" className="focus-ring mt-2 inline-block text-sm font-semibold text-hot-deep hover:underline">
            View inbox
          </Link>
        </div>
        <div className="rounded-xl border border-line-light bg-white p-6">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-ink/50">New booking requests</p>
          <p className="mt-2 font-display text-4xl font-bold text-hot-deep">{newBookings ?? "—"}</p>
          <Link href="/admin/inbox?tab=bookings" className="focus-ring mt-2 inline-block text-sm font-semibold text-hot-deep hover:underline">
            Review bookings
          </Link>
        </div>
      </div>

      <h2 className="mt-10 font-display text-xl font-bold">Jump to a page</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => {
          if (link.adminOnly && role !== "admin") return null;
          return (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("/admin") ? undefined : "_blank"}
              className="focus-ring flex items-start gap-3 rounded-xl border border-line-light bg-white p-5 transition-colors hover:border-hot-deep"
            >
              <link.icon className="size-5 shrink-0 text-hot-deep" aria-hidden="true" />
              <span className="font-semibold text-ink">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
