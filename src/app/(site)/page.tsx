import { Hero } from "@/components/home/Hero";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { CollaboratorsStrip } from "@/components/home/CollaboratorsStrip";
import { VenueTeaser } from "@/components/home/VenueTeaser";
import { LatestEvents } from "@/components/home/LatestEvents";
import { InstagramTeaser } from "@/components/home/InstagramTeaser";
import { ClosingCta } from "@/components/home/ClosingCta";
import {
  getCollaborators,
  getEvents,
  getProjects,
  getSiteSettings,
  getVenueContent,
} from "@/lib/content";

// All content on this page is staff-editable via Firestore — render fresh
// on every request instead of caching a static build-time snapshot.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, projects, collaborators, venue, events] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getCollaborators(),
    getVenueContent(),
    getEvents(),
  ]);

  // Only staff-selected projects ("Feature on homepage" on a project's page),
  // in the same Films → Music Videos → Collaborations / newest-first order
  // getProjects() already sorts by.
  const featuredProjects = projects.filter((p) => p.featuredOnHome);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Spicy Mama Creative Studio",
    description: settings.heroTagline || settings.heroSubtext,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://spicymamastudio.com",
    telephone: settings.phone || undefined,
    email: settings.contactEmail || undefined,
    image: settings.heroMedia || undefined,
    address: settings.address ? { "@type": "PostalAddress", streetAddress: settings.address } : undefined,
    sameAs: Object.values(settings.socials).filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero settings={settings} />
      <FeaturedWork projects={featuredProjects} settings={settings} />
      <WhatWeDo settings={settings} />
      <CollaboratorsStrip collaborators={collaborators} settings={settings} />
      <VenueTeaser venue={venue} settings={settings} />
      <LatestEvents events={events} settings={settings} />
      <InstagramTeaser settings={settings} />
      <ClosingCta settings={settings} />
    </>
  );
}
