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

  return (
    <>
      <Hero settings={settings} />
      <FeaturedWork projects={featuredProjects} />
      <WhatWeDo settings={settings} />
      <CollaboratorsStrip collaborators={collaborators} />
      <VenueTeaser venue={venue} />
      <LatestEvents events={events} />
      <InstagramTeaser settings={settings} />
      <ClosingCta settings={settings} />
    </>
  );
}
