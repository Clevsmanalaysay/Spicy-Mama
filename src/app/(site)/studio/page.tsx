import type { Metadata } from "next";
import { EditablePageHero } from "@/components/ui/EditablePageHero";
import { Section } from "@/components/ui/Section";
import { EditableSectionHeading } from "@/components/ui/EditableSectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { ServiceBlocks } from "@/components/studio/ServiceBlocks";
import { HowWeWork } from "@/components/studio/HowWeWork";
import { Faq } from "@/components/ui/Faq";
import { getFaq, getProjects, getServices, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Studio & Services",
  description:
    "Film production, branded content, music videos, line production and creative direction — a production partner, not a vendor.",
};

// Services/FAQ here are staff-editable via Firestore — render fresh on every
// request instead of caching a static build-time snapshot.
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const [services, faq, projects, settings] = await Promise.all([
    getServices(),
    getFaq(),
    getProjects(),
    getSiteSettings(),
  ]);

  return (
    <>
      <EditablePageHero page="studio" settings={settings} />

      <Section tone="dark">
        <ServiceBlocks services={services} projects={projects} />
      </Section>

      <Section tone="raised">
        <HowWeWork />
      </Section>

      <Section tone="dark">
        <EditableSectionHeading settings={settings} sectionKey="studio.faq" defaultEyebrow="FAQ" defaultTitle="Timelines, budgets, travel and rights." />
        <div className="mt-8 max-w-3xl">
          <Faq items={faq.sort((a, b) => a.order - b.order)} />
        </div>
      </Section>

      <Section tone="light" className="text-center">
        <EditableSectionHeading
          settings={settings}
          sectionKey="studio.cta"
          defaultTitle="Ready to build something?"
          defaultDescription="Tell us about the project and we'll come back with a plan — not a sales pitch."
          tone="light"
          className="mx-auto"
        />
        <div className="mt-6">
          <LinkButton href="/contact?type=Production">Submit a project inquiry</LinkButton>
        </div>
      </Section>
    </>
  );
}
