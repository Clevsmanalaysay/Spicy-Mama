import { Section } from "@/components/ui/Section";
import { EditableSectionHeading } from "@/components/ui/EditableSectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { SiteSettings, VenueContent } from "@/lib/types";

export function VenueTeaser({ venue, settings }: { venue: VenueContent; settings: SiteSettings }) {
  const photos = venue.gallery.length ? venue.gallery.slice(0, 3) : [undefined, undefined, undefined];
  return (
    <Section tone="light">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, i) => (
            <PlaceholderMedia
              key={i}
              src={photo}
              alt="Spicy Mama venue"
              label={i === 1 ? "Venue photos" : undefined}
              seed={i + 5}
              className={`aspect-[3/4] rounded-lg ${i === 1 ? "mt-6" : ""}`}
            />
          ))}
        </div>
        <div>
          <EditableSectionHeading
            settings={settings}
            sectionKey="home.venueTeaser"
            tone="light"
            defaultEyebrow="The venue"
            defaultTitle="Our house is your stage."
            defaultDescription="A creative studio by day. Your party by night. Birthdays, launches, screenings, workshops and shoots — in a space built for bold visuals."
          />
          <p className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-ink">
            Up to {venue.capacityStanding} standing &middot; {venue.capacitySeated} seated
          </p>
          <LinkButton href="/venue" className="mt-6">
            Check dates
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
