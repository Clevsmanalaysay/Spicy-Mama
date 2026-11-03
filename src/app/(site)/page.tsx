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
  getFeaturedProjects,
  getSiteSettings,
  getVenueContent,
} from "@/lib/content";

// All content on this page is staff-editable via Firestore — render fresh
// on every request instead of caching a static build-time snapshot.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, featuredProjects, collaborators, venue, events] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(4),
    getCollaborators(),
    getVenueContent(),
    getEvents(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <FeaturedWork projects={featuredProjects} />
      <WhatWeDo />
      <CollaboratorsStrip collaborators={collaborators} />
      <VenueTeaser venue={venue} />
      <LatestEvents events={events} />
      <InstagramTeaser settings={settings} />
      <ClosingCta />
    </>
  );
}
