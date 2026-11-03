import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { EventCard } from "@/components/events/EventCard";
import { LinkButton } from "@/components/ui/Button";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming screenings, workshops and pop-ups, plus recaps from past events at Spicy Mama.",
};

export default async function EventsPage() {
  const events = await getEvents();
  const today = new Date(new Date().toDateString());
  const upcoming = events.filter((e) => new Date(e.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => new Date(e.date) < today).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Social proof, and a reason to follow."
        description="Public screenings, workshops and pop-ups at the venue — plus recaps from what's already happened."
      />

      <Section tone="dark">
        <SectionHeading eyebrow="Upcoming" title="What's on" />
        {upcoming.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-paper-dim">Nothing on the public calendar right now — check back soon.</p>
        )}
      </Section>

      <Section tone="raised">
        <SectionHeading eyebrow="Recaps" title="Past events" />
        {past.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event, i) => (
              <EventCard key={event.id} event={event} index={i + 3} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-paper-dim">Recaps are published within a week of each event — check back soon.</p>
        )}
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
