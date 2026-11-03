import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { StillsGallery } from "@/components/work/StillsGallery";
import { formatDate } from "@/lib/utils";
import { getEventBySlug, getEvents } from "@/lib/content";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return { title: event.title, description: event.summary };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || event.status !== "published" || !event.isPublic) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    description: event.summary,
    location: { "@type": "Place", name: "Spicy Mama Creative Studio" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section tone="dark" className="pb-10 pt-20 sm:pt-28">
        <Link href="/events" className="focus-ring text-sm font-semibold text-paper-dim hover:text-hot">
          &larr; Back to events
        </Link>
        <p className="mt-6 font-display text-xs font-bold uppercase tracking-wide text-hot-bright">
          {formatDate(event.date)} &middot; {event.type}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl">{event.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-paper-dim">{event.summary}</p>
      </Section>

      <Section tone="dark" className="pt-0">
        <PlaceholderMedia
          src={event.coverUrl}
          alt={event.title}
          label={event.title}
          className="aspect-video w-full rounded-xl border border-line"
        />
      </Section>

      {event.description ? (
        <Section tone="raised">
          <div className="max-w-2xl whitespace-pre-line text-paper-dim">{event.description}</div>
        </Section>
      ) : null}

      <Section tone="dark">
        <SectionHeading eyebrow="Gallery" title="From the night" />
        <div className="mt-6">
          <StillsGallery images={event.photos} title={event.title} />
        </div>
      </Section>

      <Section tone="light" className="text-center">
        <h2 className="font-display text-3xl font-bold text-ink">Want the venue for your own event?</h2>
        <div className="mt-6">
          <LinkButton href="/venue#booking-form">Book the venue</LinkButton>
        </div>
      </Section>
    </>
  );
}
