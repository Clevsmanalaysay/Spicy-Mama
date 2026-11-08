"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { deleteEvent, listEventsAdmin } from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";
import type { SpicyEvent } from "@/lib/types";

function EventTable({
  rows,
  emptyLabel,
  loading,
  onDelete,
}: {
  rows: SpicyEvent[] | undefined;
  emptyLabel: string;
  loading: boolean;
  onDelete: (e: SpicyEvent) => void;
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-line-light bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line-light bg-paper-dim/20 text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Visibility</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows?.map((e) => (
            <tr key={e.id} className="border-b border-line-light last:border-0 hover:bg-paper-dim/10">
              <td className="px-4 py-3 font-semibold text-ink">{e.title}</td>
              <td className="px-4 py-3 text-ink/70">{formatDate(e.date)}</td>
              <td className="px-4 py-3 text-ink/70">{e.type}</td>
              <td className="px-4 py-3 text-ink/70">{e.isPublic ? "Public" : "Private"}</td>
              <td className="px-4 py-3">
                <span className={e.status === "published" ? "text-green-700" : "text-ink/50"}>{e.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/events/${e.slug}`} className="focus-ring inline-flex items-center gap-1 font-semibold text-hot-deep hover:underline">
                    Edit <ExternalLink className="size-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(e)}
                    className="focus-ring text-ink/40 hover:text-hot-deep"
                    aria-label={`Delete ${e.title}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows && !rows.length ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                {emptyLabel}
              </td>
            </tr>
          ) : null}
          {loading ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                Loading…
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<SpicyEvent[] | null>(null);
  const [error, setError] = useState("");

  function refresh() {
    listEventsAdmin()
      .then(setEvents)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load events"));
  }

  useEffect(refresh, []);

  async function handleDelete(e: SpicyEvent) {
    if (!confirm(`Delete "${e.title}"? This can't be undone.`)) return;
    try {
      await deleteEvent(e.id);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete — try again.");
    }
  }

  const loading = !events && !error;
  const today = new Date(new Date().toDateString());
  const upcoming = events?.filter((e) => new Date(e.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = events?.filter((e) => new Date(e.date) < today).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Events</h1>
        <LinkButton href="/events" size="md">
          <Plus className="size-4" /> Add on the live page
        </LinkButton>
      </div>
      <p className="mt-1 text-ink/60">
        Events are edited directly on their live page — turn on <strong>Edit this page</strong> there. An event
        moves from Upcoming to Past automatically once its date has passed. This is just an index, useful for
        finding drafts that aren&apos;t on the public Events page yet.
      </p>

      {error ? <p className="mt-6 text-sm font-semibold text-hot-deep">{error}</p> : null}

      <h2 className="mt-8 font-display text-lg font-bold text-ink">Upcoming</h2>
      <EventTable rows={upcoming} emptyLabel="No upcoming events — add one from the Events page." loading={loading} onDelete={handleDelete} />

      <h2 className="mt-8 font-display text-lg font-bold text-ink">Past events</h2>
      <EventTable rows={past} emptyLabel="No past events yet." loading={loading} onDelete={handleDelete} />
    </div>
  );
}
