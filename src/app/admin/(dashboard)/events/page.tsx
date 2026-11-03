"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { listEventsAdmin } from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";
import type { SpicyEvent } from "@/lib/types";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<SpicyEvent[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listEventsAdmin()
      .then(setEvents)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load events"));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Events</h1>
        <LinkButton href="/events" size="md">
          <Plus className="size-4" /> Add on the live page
        </LinkButton>
      </div>
      <p className="mt-1 text-ink/60">
        Events are edited directly on their live page — turn on <strong>Edit this page</strong> there. This is just
        an index, useful for finding drafts that aren&apos;t on the public Events page yet.
      </p>

      {error ? <p className="mt-6 text-sm font-semibold text-hot-deep">{error}</p> : null}

      <div className="mt-6 overflow-hidden rounded-xl border border-line-light bg-white">
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
            {events?.map((e) => (
              <tr key={e.id} className="border-b border-line-light last:border-0 hover:bg-paper-dim/10">
                <td className="px-4 py-3 font-semibold text-ink">{e.title}</td>
                <td className="px-4 py-3 text-ink/70">{formatDate(e.date)}</td>
                <td className="px-4 py-3 text-ink/70">{e.type}</td>
                <td className="px-4 py-3 text-ink/70">{e.isPublic ? "Public" : "Private"}</td>
                <td className="px-4 py-3">
                  <span className={e.status === "published" ? "text-green-700" : "text-ink/50"}>{e.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/events/${e.slug}`} className="focus-ring inline-flex items-center gap-1 font-semibold text-hot-deep hover:underline">
                    Edit <ExternalLink className="size-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
            {events && !events.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                  No events yet — add your first one from the Events page.
                </td>
              </tr>
            ) : null}
            {!events && !error ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                  Loading…
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
