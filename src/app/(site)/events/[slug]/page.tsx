import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { EventDetailEditor } from "@/components/events/EventDetailEditor";
import { getEventBySlug } from "@/lib/content";

type Params = Promise<{ slug: string }>;

// Event content (including status/draft) is staff-editable via Firestore —
// render fresh on every request instead of caching a static build-time
// snapshot, or edits (and new drafts) would never show up.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.summary,
    robots: event.status === "draft" || !event.isPublic ? { index: false, follow: false } : undefined,
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  // Drafts/private events still render — EventDetailEditor itself blocks the
  // content from anyone who isn't signed in as staff.
  if (!event) notFound();

  const isVisible = event.status === "published" && event.isPublic;

  const jsonLd = isVisible
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        startDate: event.date,
        description: event.summary,
        location: { "@type": "Place", name: "Spicy Mama Creative Studio" },
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
          <h2 className="font-display text-3xl font-bold text-ink">Want the venue for your own event?</h2>
          <div className="mt-6">
            <LinkButton href="/venue#booking-form">Book the venue</LinkButton>
          </div>
        </Section>
      ) : null}
    </>
  );
}
