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
  // Top 10 projects, already grouped Films → Music Videos → Collaborations,
  // newest first, by getProjects()'s ordering.
  const [settings, featuredProjects, collaborators, venue, events] = await Promise.all([
    getSiteSettings(),
    getProjects({ limit: 10 }),
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
