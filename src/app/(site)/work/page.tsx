import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { PortfolioGrid } from "@/components/work/PortfolioGrid";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Every film, collaboration and campaign Spicy Mama Creative Studio has made.",
};

// Projects are staff-editable via Firestore — render fresh on every request
// instead of caching a static build-time snapshot.
export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="The proof is in the work."
        description="Films, brand collaborations, music videos and events — filter by type or scroll through everything we've made."
      />
      <Section tone="dark">
        <PortfolioGrid projects={projects} />
      </Section>
    </>
  );
}
