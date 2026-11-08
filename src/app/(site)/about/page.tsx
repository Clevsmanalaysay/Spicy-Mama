import type { Metadata } from "next";
import { EditablePageHero } from "@/components/ui/EditablePageHero";
import { Section } from "@/components/ui/Section";
import { EditableSectionHeading } from "@/components/ui/EditableSectionHeading";
import { AboutValues } from "@/components/about/AboutValues";
import { TeamGrid } from "@/components/about/TeamGrid";
import { PressMentions } from "@/components/about/PressMentions";
import { getPress, getSiteSettings, getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "The story, the team and the values behind Spicy Mama Creative Studio.",
};

// Team/press here are staff-editable via Firestore — render fresh on every
// request instead of caching a static build-time snapshot.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [team, press, settings] = await Promise.all([getTeam(), getPress(), getSiteSettings()]);

  return (
    <>
      <EditablePageHero page="about" settings={settings} />

      <Section tone="dark">
        <EditableSectionHeading settings={settings} sectionKey="about.values" defaultEyebrow="How we work" defaultTitle="Values" />
        <AboutValues settings={settings} />
      </Section>

      <Section tone="raised">
        <EditableSectionHeading settings={settings} sectionKey="about.team" defaultEyebrow="The team" defaultTitle="Who you'll work with" />
        <div className="mt-8">
          <TeamGrid team={team} />
        </div>
      </Section>

      <Section tone="dark">
        <EditableSectionHeading settings={settings} sectionKey="about.press" defaultEyebrow="Press" defaultTitle="As seen in" />
        <div className="mt-8">
          <PressMentions press={press} />
        </div>
      </Section>
    </>
  );
}
