import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { EditableSectionHeading } from "@/components/ui/EditableSectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { formatDate } from "@/lib/utils";
import type { SiteSettings, SpicyEvent } from "@/lib/types";

export function LatestEvents({ events, settings }: { events: SpicyEvent[]; settings: SiteSettings }) {
  if (!events.length) return null;
  return (
    <Section tone="dark">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <EditableSectionHeading settings={settings} sectionKey="home.latestEvents" defaultEyebrow="Latest at the venue" defaultTitle="Recent events." />
        <LinkButton href="/events" variant="secondary">
          See all events
        </LinkButton>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {events.slice(0, 3).map((event, i) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="focus-ring group block overflow-hidden rounded-xl border border-line bg-ink-soft"
          >
            <PlaceholderMedia
              src={event.coverUrl}
              alt={event.title}
              label={event.title}
              seed={i + 2}
              className="aspect-[4/3] w-full"
            />
            <div className="p-4">
              <p className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">
                {formatDate(event.date)} &middot; {event.type}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold text-paper group-hover:text-hot-bright">
                {event.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
