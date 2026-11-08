import type { Metadata } from "next";
import { EditablePageHero } from "@/components/ui/EditablePageHero";
import { Section } from "@/components/ui/Section";
import { EditableSectionHeading } from "@/components/ui/EditableSectionHeading";
import { EventCard } from "@/components/events/EventCard";
import { NewEventTile } from "@/components/events/NewEventTile";
import { LinkButton } from "@/components/ui/Button";
import { getEvents, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming screenings, workshops and pop-ups, plus recaps from past events at Spicy Mama.",
};

// Events are staff-editable via Firestore — render fresh on every request
// instead of caching a static build-time snapshot.
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [events, settings] = await Promise.all([getEvents(), getSiteSettings()]);
  const today = new Date(new Date().toDateString());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const upcoming = events.filter((e) => new Date(e.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => new Date(e.date) < today).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <EditablePageHero page="events" settings={settings} />

      <Section tone="dark">
        <EditableSectionHeading settings={settings} sectionKey="events.upcoming" defaultEyebrow="Upcoming" defaultTitle="What's on" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
          <NewEventTile />
        </div>
        {!upcoming.length ? (
          <p className="mt-6 text-paper-dim">Nothing on the public calendar right now — check back soon.</p>
        ) : null}
      </Section>

      <Section tone="raised">
        <EditableSectionHeading settings={settings} sectionKey="events.recaps" defaultEyebrow="Recaps" defaultTitle="Past events" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {past.map((event, i) => (
            <EventCard key={event.id} event={event} index={i + 3} />
          ))}
          <NewEventTile defaultDate={yesterday} label="Add past event" />
        </div>
        {!past.length ? (
          <p className="mt-6 text-paper-dim">Recaps are published within a week of each event — check back soon.</p>
        ) : null}
      </Section>

      <Section tone="dark" className="text-center">
        <p className="text-sm text-paper-dim">
          Photos of private events are only published with the host&apos;s consent.
        </p>
        <div className="mt-6">
          <LinkButton href="/venue#booking-form">Host your own event</LinkButton>
        </div>
      </Section>
    </>
  );
}
