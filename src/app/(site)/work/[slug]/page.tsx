import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ProjectDetailEditor } from "@/components/work/ProjectDetailEditor";
import { getProjectBySlug, getProjects } from "@/lib/content";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

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
  // Drafts still render the page (staff can preview/edit them) — ProjectDetailEditor
  // itself blocks the content from anyone who isn't signed in as staff.
  if (!project) notFound();

  const allProjects = await getProjects();
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
          <SectionHeading eyebrow="Keep exploring" title="Related projects" />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {related.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </Section>
      ) : null}

      {project.status === "published" ? (
        <Section tone="light" className="text-center">
          <h2 className="font-display text-3xl font-bold text-ink">Want something like this?</h2>
          <div className="mt-6">
            <LinkButton href="/contact?type=Production">Submit a project inquiry</LinkButton>
          </div>
        </Section>
      ) : null}
    </>
  );
}
