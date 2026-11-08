import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { EditableSectionHeading } from "@/components/ui/EditableSectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { EventDetailEditor } from "@/components/events/EventDetailEditor";
import { getEventBySlug, getSiteSettings } from "@/lib/content";

type Params = Promise<{ slug: string }>;

// Event content (including status/draft) is staff-editable via Firestore —
// render fresh on every request instead of caching a static build-time
// snapshot, or edits (and new drafts) would never show up.
export const dynamic = "force-dynamic";

function eventShareImage(event: { headerMedia?: { type: string; url: string }[]; coverUrl?: string }): string | undefined {
  return event.headerMedia?.find((m) => m.type === "image")?.url ?? event.coverUrl;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  const image = eventShareImage(event);
  return {
    title: event.title,
    description: event.summary,
    openGraph: image ? { images: [image] } : undefined,
    robots: event.status === "draft" || !event.isPublic ? { index: false, follow: false } : undefined,
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([getEventBySlug(slug), getSiteSettings()]);
  // getEventBySlug only ever finds published events (see work/[slug]/page.tsx
  // for why) — a brand-new draft isn't a 404, EventDetailEditor checks for
  // it client-side as the signed-in staff user.
  if (!event) {
    return <EventDetailEditor event={null} slug={slug} />;
  }

  const isVisible = event.status === "published" && event.isPublic;
  const image = eventShareImage(event);

  const jsonLd = isVisible
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        startDate: event.date,
        description: event.summary,
        image: image || undefined,
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://spicymamastudio.com"}/events/${event.slug}`,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: "Spicy Mama Creative Studio",
          address: settings.address ? { "@type": "PostalAddress", streetAddress: settings.address } : undefined,
        },
        organizer: { "@type": "Organization", name: "Spicy Mama Creative Studio" },
      }
    : null;

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}

      <EventDetailEditor event={event} />

      {isVisible ? (
        <Section tone="light" className="text-center">
          <EditableSectionHeading
            settings={settings}
            sectionKey="events.venueCta"
            defaultTitle="Want the venue for your own event?"
            tone="light"
            className="mx-auto"
          />
          <div className="mt-6">
            <LinkButton href="/venue#booking-form">Book the venue</LinkButton>
          </div>
        </Section>
      ) : null}
    </>
  );
}
