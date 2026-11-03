import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { EventTypesList } from "@/components/venue/EventTypesList";
import { TheSpace } from "@/components/venue/TheSpace";
import { Packages } from "@/components/venue/Packages";
import { Availability } from "@/components/venue/Availability";
import { HouseRules } from "@/components/venue/HouseRules";
import { BookingForm } from "@/components/forms/BookingForm";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { formatDate } from "@/lib/utils";
import { getEvents, getVenueContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Venue & Bookings",
  description:
    "A creative studio by day. Your party by night. Book Spicy Mama's venue for birthdays, launches, screenings, workshops and shoots.",
};

// Venue content is staff-editable via Firestore — render fresh on every
// request instead of caching a static build-time snapshot.
export const dynamic = "force-dynamic";

export default async function VenuePage() {
  const [venue, events] = await Promise.all([getVenueContent(), getEvents()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "Spicy Mama Creative Studio",
    description: venue.intro,
    maximumAttendeeCapacity: venue.capacityStanding,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Venue & Bookings"
        title="A creative studio by day. Your party by night."
        description="Our house is your stage — book the same space that builds campaigns and shoots films for your next birthday, launch, screening or shoot."
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <LinkButton href="#booking-form" size="lg">
            Book the venue
          </LinkButton>
          <LinkButton href="#house-rules" variant="secondary" size="lg">
            House rules
          </LinkButton>
        </div>
      </PageHero>

      <Section tone="dark">
        <SectionHeading eyebrow="What happens here" title="Built for every kind of gathering." />
        <div className="mt-8">
          <EventTypesList />
        </div>
      </Section>

      <Section tone="raised">
        <TheSpace venue={venue} />
      </Section>

      <Section tone="dark">
        <Packages packages={venue.packages} />
      </Section>

      <Section tone="raised">
        <div className="grid gap-10 lg:grid-cols-2">
          <HouseRules rules={venue.rules} />
          <Availability heldDates={venue.heldDates} />
        </div>
      </Section>

      {events.length ? (
        <Section tone="dark">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Seen it live" title="Past events here" />
            <LinkButton href="/events" variant="secondary">
              All events
            </LinkButton>
          </div>
          <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
            {events.slice(0, 6).map((event, i) => (
              <a
                key={event.id}
                href={`/events/${event.slug}`}
                className="focus-ring group w-48 shrink-0 overflow-hidden rounded-lg border border-line"
              >
                <PlaceholderMedia src={event.coverUrl} alt={event.title} seed={i} className="aspect-square" />
                <div className="bg-ink-soft p-3">
                  <p className="text-xs text-paper-dim">{formatDate(event.date)}</p>
                  <p className="font-display text-sm font-bold text-paper group-hover:text-hot-bright">{event.title}</p>
                </div>
              </a>
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="light" id="booking-form">
        <SectionHeading tone="light" eyebrow="Book the venue" title="Tell us about your event" />
        <div className="mt-8 max-w-2xl">
          <BookingForm heldDates={venue.heldDates} />
        </div>
      </Section>
    </>
  );
}
