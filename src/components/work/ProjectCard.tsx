import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { UnverifiedFlag } from "@/components/ui/Badge";
import type { Project } from "@/lib/types";

const typeLabels: Record<Project["type"], string> = {
  film: "Film",
  commercial: "Commercial",
  "music-video": "Music Video",
  collaboration: "Collaboration",
  event: "Event",
};

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="focus-ring group block overflow-hidden rounded-xl border border-line bg-ink-soft transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] w-full">
        <PlaceholderMedia
          src={project.posterUrl}
          alt={`${project.title} poster`}
          label={project.title}
          seed={index}
          className="h-full w-full"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide text-hot-bright backdrop-blur">
          {typeLabels[project.type]}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight text-paper group-hover:text-hot-bright">
            {project.title}
          </h3>
          <span className="shrink-0 font-display text-sm font-bold text-paper-dim">{project.year}</span>
        </div>
        <p className="mt-1 text-sm text-paper-dim">{project.role}</p>
        {project.unverified ? (
          <div className="mt-2">
            <UnverifiedFlag />
          </div>
        ) : null}
      </div>
    </Link>
  );
}
