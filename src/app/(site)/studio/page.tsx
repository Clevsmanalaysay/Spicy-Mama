import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { ServiceBlock } from "@/components/studio/ServiceBlock";
import { HowWeWork } from "@/components/studio/HowWeWork";
import { Faq } from "@/components/ui/Faq";
import { getFaq, getProjects, getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Studio & Services",
  description:
    "Film production, branded content, music videos, line production and creative direction — a production partner, not a vendor.",
};

export default async function StudioPage() {
  const [services, faq, projects] = await Promise.all([getServices(), getFaq(), getProjects()]);
  const projectsBySlug = new Map(projects.map((p) => [p.slug, p]));

  return (
    <>
      <PageHero
        eyebrow="Studio & Services"
        title="We're a partner, not a vendor."
        description="Spicy Mama Creative Studio is a film and content production house — we co-create, build with you, from idea to screen. Below is where we help and how we work."
      />

      <Section tone="dark">
        <div className="grid gap-6 sm:grid-cols-2">
          {services
            .sort((a, b) => a.order - b.order)
            .map((service) => (
              <ServiceBlock
                key={service.id}
                service={service}
                relatedProjects={service.relatedProjectSlugs
                  .map((slug) => projectsBySlug.get(slug))
                  .filter((p): p is NonNullable<typeof p> => Boolean(p))}
              />
            ))}
        </div>
      </Section>

      <Section tone="raised">
        <HowWeWork />
      </Section>

      <Section tone="dark">
        <SectionHeading eyebrow="FAQ" title="Timelines, budgets, travel and rights." />
        <div className="mt-8 max-w-3xl">
          <Faq items={faq.sort((a, b) => a.order - b.order)} />
        </div>
      </Section>

      <Section tone="light" className="text-center">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Ready to build something?</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink/70">
          Tell us about the project and we&apos;ll come back with a plan — not a sales pitch.
        </p>
        <div className="mt-6">
          <LinkButton href="/contact?type=Production">Submit a project inquiry</LinkButton>
        </div>
      </Section>
    </>
  );
}
