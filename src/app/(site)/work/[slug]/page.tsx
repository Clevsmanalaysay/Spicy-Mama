import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { Badge, UnverifiedFlag } from "@/components/ui/Badge";
import { TrailerEmbed } from "@/components/work/TrailerEmbed";
import { StillsGallery } from "@/components/work/StillsGallery";
import { ProjectCard } from "@/components/work/ProjectCard";
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
  };
}

const typeLabels: Record<string, string> = {
  film: "Film",
  commercial: "Commercial",
  "music-video": "Music Video",
  collaboration: "Collaboration",
  event: "Event",
};

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.status !== "published") notFound();

  const allProjects = await getProjects();
  const related = allProjects.filter((p) => p.id !== project.id).slice(0, 3);

  const jsonLd =
    project.type === "film"
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <Section tone="dark" className="pb-10 pt-20 sm:pt-28">
        <Link href="/work" className="focus-ring text-sm font-semibold text-paper-dim hover:text-hot">
          &larr; Back to work
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge>{typeLabels[project.type]}</Badge>
          <span className="font-display text-sm font-bold text-paper-dim">{project.year}</span>
          {project.unverified ? <UnverifiedFlag /> : null}
        </div>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl">{project.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-paper-dim">{project.logline}</p>

        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
          <div>
            <dt className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Spicy Mama&apos;s role</dt>
            <dd className="mt-1 text-sm text-paper">{project.role}</dd>
          </div>
          {project.format ? (
            <div>
              <dt className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Format</dt>
              <dd className="mt-1 text-sm text-paper">{project.format}</dd>
            </div>
          ) : null}
          {project.runtime ? (
            <div>
              <dt className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Runtime</dt>
              <dd className="mt-1 text-sm text-paper">{project.runtime}</dd>
            </div>
          ) : null}
          {project.genre ? (
            <div>
              <dt className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Genre</dt>
              <dd className="mt-1 text-sm text-paper">{project.genre}</dd>
            </div>
          ) : null}
        </dl>
      </Section>

      <Section tone="dark" className="pt-0">
        <TrailerEmbed trailerUrl={project.trailerUrl} posterUrl={project.posterUrl} title={project.title} />
      </Section>

      {project.credits.length ? (
        <Section tone="raised">
          <SectionHeading eyebrow="Credits" title="Who made it" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.credits.map((credit, i) => (
              <li key={i} className="rounded-lg border border-line bg-ink p-4">
                <p className="font-display text-base font-bold text-paper">{credit.name}</p>
                <p className="text-sm text-paper-dim">{credit.role}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {project.festivals.length || project.pressLinks.length ? (
        <Section tone="dark">
          <div className="grid gap-10 sm:grid-cols-2">
            {project.festivals.length ? (
              <div>
                <h2 className="font-display text-2xl font-bold">Festivals &amp; screenings</h2>
                <ul className="mt-4 space-y-3">
                  {project.festivals.map((f, i) => (
                    <li key={i} className="text-sm text-paper-dim">
                      <span className="font-semibold text-paper">{f.name}</span>
                      {f.year ? ` · ${f.year}` : ""}
                      {f.result ? ` · ${f.result}` : ""}
                      {f.link ? (
                        <a href={f.link} target="_blank" rel="noopener noreferrer" className="focus-ring ml-2 text-hot-bright hover:underline">
                          <ExternalLink className="inline size-3.5" aria-hidden="true" />
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.pressLinks.length ? (
              <div>
                <h2 className="font-display text-2xl font-bold">Press</h2>
                <ul className="mt-4 space-y-3">
                  {project.pressLinks.map((p, i) => (
                    <li key={i} className="text-sm">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring font-semibold text-hot-bright underline hover:text-hot"
                      >
                        {p.title}
                      </a>
                      {p.outlet ? <span className="text-paper-dim"> &middot; {p.outlet}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      <Section tone="raised">
        <h2 className="font-display text-2xl font-bold">Stills</h2>
        <div className="mt-6">
          <StillsGallery images={project.gallery} title={project.title} />
        </div>
      </Section>

      {related.length ? (
        <Section tone="dark">
          <SectionHeading eyebrow="Keep exploring" title="Related projects" />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {related.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="light" className="text-center">
        <h2 className="font-display text-3xl font-bold text-ink">Want something like this?</h2>
        <div className="mt-6">
          <LinkButton href="/contact?type=Production">Submit a project inquiry</LinkButton>
        </div>
      </Section>
    </>
  );
}
