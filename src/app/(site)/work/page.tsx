import type { Metadata } from "next";
import { EditablePageHero } from "@/components/ui/EditablePageHero";
import { Section } from "@/components/ui/Section";
import { PortfolioGrid } from "@/components/work/PortfolioGrid";
import { getProjects, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Every film, collaboration and campaign Spicy Mama Creative Studio has made.",
};

// Projects are staff-editable via Firestore — render fresh on every request
// instead of caching a static build-time snapshot.
export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);

  return (
    <>
      <EditablePageHero page="work" settings={settings} />
      <Section tone="dark">
        <PortfolioGrid projects={projects} />
      </Section>
    </>
  );
}
