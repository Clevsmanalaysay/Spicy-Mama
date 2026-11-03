"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clapperboard, PartyPopper, Inbox, Settings, Users, CalendarCheck } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { listBookingsAdmin, listMessagesAdmin } from "@/lib/admin-data";

const quickLinks = [
  { href: "/admin/projects/new", label: "Add a new film or collaboration", icon: Clapperboard },
  { href: "/admin/events/new", label: "Add an event and its photos", icon: PartyPopper },
  { href: "/admin/inbox", label: "Handle inquiries and bookings", icon: Inbox },
  { href: "/admin/settings", label: "Edit contact info and social links", icon: Settings },
  { href: "/admin/settings", label: "Change the homepage", icon: CalendarCheck },
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
      <p className="mt-1 text-ink/60">This dashboard is a set of forms, not a website editor — pick a workflow below.</p>

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

      <h2 className="mt-10 font-display text-xl font-bold">Common workflows</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => {
          if (link.adminOnly && role !== "admin") return null;
          return (
            <Link
              key={link.label}
              href={link.href}
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
