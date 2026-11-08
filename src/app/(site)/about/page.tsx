import type { Metadata } from "next";
import { EditablePageHero } from "@/components/ui/EditablePageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SparkleBullet } from "@/components/ui/SparkleDivider";
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

const values = [
  "We make films that get noticed — lead with craft, not claims.",
  "We're a partner, not a vendor — co-create, build with you, idea to screen.",
  "Our house is your stage — the venue is an extension of the creative world.",
  "Specific beats vague — credits and numbers over buzzwords.",
];

export default async function AboutPage() {
  const [team, press, settings] = await Promise.all([getTeam(), getPress(), getSiteSettings()]);

  return (
    <>
      <EditablePageHero page="about" settings={settings} />

      <Section tone="dark">
        <SectionHeading eyebrow="How we work" title="Values" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <li key={v} className="flex items-start gap-3 rounded-lg border border-line bg-ink-soft p-4 text-sm text-paper-dim">
              <SparkleBullet className="mt-1" />
              {v}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="raised">
        <SectionHeading eyebrow="The team" title="Who you'll work with" />
        <div className="mt-8">
          <TeamGrid team={team} />
        </div>
      </Section>

      <Section tone="dark">
        <SectionHeading eyebrow="Press" title="As seen in" />
        <div className="mt-8">
          <PressMentions press={press} />
        </div>
      </Section>
    </>
  );
}
