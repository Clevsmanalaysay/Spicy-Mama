import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { EditableSectionHeading } from "@/components/ui/EditableSectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ProjectDetailEditor } from "@/components/work/ProjectDetailEditor";
import { getProjectBySlug, getProjects, getSiteSettings } from "@/lib/content";

type Params = Promise<{ slug: string }>;

// Project content (including status/draft) is staff-editable via Firestore
// — render fresh on every request instead of caching a static build-time
// snapshot, or edits (and new drafts) would never show up.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.logline,
    openGraph: project.shareImage || project.posterUrl ? { images: [project.shareImage || project.posterUrl!] } : undefined,
    robots: project.status === "draft" ? { index: false, follow: false } : undefined,
  };
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  // getProjectBySlug only ever finds published content (this server read has
  // no signed-in user, so a draft is invisible to it) — a brand-new draft
  // isn't a 404, it's just something only staff can see. ProjectDetailEditor
  // handles that: with no project, it checks auth client-side and, if the
  // viewer is signed-in staff, fetches the draft itself (with real auth
  // context the security rules can actually use) before giving up.
  if (!project) {
    return <ProjectDetailEditor project={null} slug={slug} />;
  }

  const [allProjects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  const related = allProjects.filter((p) => p.id !== project.id).slice(0, 3);

  const jsonLd =
    project.type === "film" && project.status === "published"
      ? {
          "@context": "https://schema.org",
          "@type": "Movie",
          name: project.title,
          description: project.logline,
          datePublished: String(project.year),
          genre: project.genre,
          director: project.credits.find((c) => /director/i.test(c.role))?.name,
        }
      : null;

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}

      <ProjectDetailEditor project={project} />

      {project.status === "published" && related.length ? (
        <Section tone="dark">
          <EditableSectionHeading settings={settings} sectionKey="work.relatedProjects" defaultEyebrow="Keep exploring" defaultTitle="Related projects" />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {related.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </Section>
      ) : null}

      {project.status === "published" ? (
        <Section tone="light" className="text-center">
          <EditableSectionHeading settings={settings} sectionKey="work.inquiryCta" defaultTitle="Want something like this?" tone="light" className="mx-auto" />
          <div className="mt-6">
            <LinkButton href="/contact?type=Production">Submit a project inquiry</LinkButton>
          </div>
        </Section>
      ) : null}
    </>
  );
}
