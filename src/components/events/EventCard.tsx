import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { formatDate } from "@/lib/utils";
import type { SpicyEvent } from "@/lib/types";

export function EventCard({ event, index = 0 }: { event: SpicyEvent; index?: number }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="focus-ring group block overflow-hidden rounded-xl border border-line bg-ink-soft transition-transform hover:-translate-y-1"
    >
      <PlaceholderMedia src={event.coverUrl} alt={event.title} label={event.title} seed={index} className="aspect-[4/3] w-full" />
      <div className="p-4">
        <p className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">
          {formatDate(event.date)} &middot; {event.type}
        </p>
        <h3 className="mt-1 font-display text-lg font-bold text-paper group-hover:text-hot-bright">{event.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-paper-dim">{event.summary}</p>
      </div>
    </Link>
  );
}
