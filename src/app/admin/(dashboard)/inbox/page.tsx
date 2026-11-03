"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn, formatDate } from "@/lib/utils";
import {
  listBookingsAdmin,
  listMessagesAdmin,
  updateBookingStatus,
  updateMessageStatus,
} from "@/lib/admin-data";
import type { BookingRequest, BookingStatus, ContactMessage, MessageStatus } from "@/lib/types";

type MessageRow = ContactMessage & { id: string };
type BookingRow = BookingRequest & { id: string };

function InboxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "bookings" ? "bookings" : "messages";
  const [tab, setTab] = useState<"messages" | "bookings">(initialTab);

  const [messages, setMessages] = useState<MessageRow[] | null>(null);
  const [bookings, setBookings] = useState<BookingRow[] | null>(null);
  const [error, setError] = useState("");

  function refresh() {
    listMessagesAdmin()
      .then(setMessages)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load inbox"));
    listBookingsAdmin()
      .then(setBookings)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load inbox"));
  }

  useEffect(refresh, []);

  function switchTab(next: "messages" | "bookings") {
    setTab(next);
    router.replace(`/admin/inbox${next === "bookings" ? "?tab=bookings" : ""}`);
  }

  async function handleMessageStatus(id: string, status: MessageStatus) {
    await updateMessageStatus(id, status);
    refresh();
  }

  async function handleBookingStatus(id: string, status: BookingStatus, date: string) {
    await updateBookingStatus(id, status, date);
    refresh();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Inbox</h1>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => switchTab("messages")}
          className={cn(
            "focus-ring rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide",
            tab === "messages" ? "border-hot-deep bg-hot-deep text-paper" : "border-line-light text-ink/60",
          )}
        >
          Messages {messages ? `(${messages.length})` : ""}
        </button>
        <button
          type="button"
          onClick={() => switchTab("bookings")}
          className={cn(
            "focus-ring rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide",
            tab === "bookings" ? "border-hot-deep bg-hot-deep text-paper" : "border-line-light text-ink/60",
          )}
        >
          Bookings {bookings ? `(${bookings.length})` : ""}
        </button>
      </div>

      {error ? <p className="mt-6 text-sm font-semibold text-hot-deep">{error}</p> : null}

      {tab === "messages" ? (
        <div className="mt-6 space-y-4">
          {messages?.map((m) => (
            <div key={m.id} className="rounded-xl border border-line-light bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-ink">
                    {m.name} <span className="font-normal text-ink/50">&middot; {m.email}</span>
                  </p>
                  <p className="text-xs uppercase tracking-wide text-hot-deep">{m.inquiryType}</p>
                </div>
                <select
                  value={m.status ?? "new"}
                  onChange={(e) => handleMessageStatus(m.id, e.target.value as MessageStatus)}
                  className="focus-ring rounded-full border border-line-light px-3 py-1 text-xs font-semibold"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <p className="mt-3 text-sm text-ink/80">{m.message}</p>
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink/50">
                {m.company ? (
                  <div>
                    <dt className="inline font-semibold">Company:</dt> <dd className="inline">{m.company}</dd>
                  </div>
                ) : null}
                {m.phone ? (
                  <div>
                    <dt className="inline font-semibold">Phone:</dt> <dd className="inline">{m.phone}</dd>
                  </div>
                ) : null}
                {m.budgetRange ? (
                  <div>
                    <dt className="inline font-semibold">Budget:</dt> <dd className="inline">{m.budgetRange}</dd>
                  </div>
                ) : null}
                {m.timeline ? (
                  <div>
                    <dt className="inline font-semibold">Timeline:</dt> <dd className="inline">{m.timeline}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ))}
          {messages && !messages.length ? <p className="text-ink/50">No messages yet.</p> : null}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings?.map((b) => (
            <div key={b.id} className="rounded-xl border border-line-light bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-ink">
                    {b.name} <span className="font-normal text-ink/50">&middot; {b.email}</span>
                  </p>
                  <p className="text-xs uppercase tracking-wide text-hot-deep">
                    {b.eventType} &middot; {formatDate(b.date)} &middot; {b.startTime}–{b.endTime}
                  </p>
                </div>
                <select
                  value={b.status ?? "new"}
                  onChange={(e) => handleBookingStatus(b.id, e.target.value as BookingStatus, b.date)}
                  className="focus-ring rounded-full border border-line-light px-3 py-1 text-xs font-semibold"
                >
                  <option value="new">New</option>
                  <option value="held">Held</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink/50">
                <div>
                  <dt className="inline font-semibold">Guests:</dt> <dd className="inline">{b.guests}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Phone:</dt> <dd className="inline">{b.phone}</dd>
                </div>
                {b.budget ? (
                  <div>
                    <dt className="inline font-semibold">Budget:</dt> <dd className="inline">{b.budget}</dd>
                  </div>
                ) : null}
                {b.addOns?.length ? (
                  <div>
                    <dt className="inline font-semibold">Add-ons:</dt> <dd className="inline">{b.addOns.join(", ")}</dd>
                  </div>
                ) : null}
                {b.backupDate ? (
                  <div>
                    <dt className="inline font-semibold">Backup date:</dt> <dd className="inline">{formatDate(b.backupDate)}</dd>
                  </div>
                ) : null}
              </dl>
              {b.notes ? <p className="mt-2 text-sm text-ink/80">{b.notes}</p> : null}
            </div>
          ))}
          {bookings && !bookings.length ? <p className="text-ink/50">No booking requests yet.</p> : null}
        </div>
      )}
    </div>
  );
}

export default function AdminInboxPage() {
  return (
    <Suspense fallback={null}>
      <InboxContent />
    </Suspense>
  );
}
