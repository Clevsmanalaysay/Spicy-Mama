import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { ProjectCard } from "@/components/work/ProjectCard";
import type { Project } from "@/lib/types";

export function FeaturedWork({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <Section tone="dark">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Featured work" title="We make films that get noticed." />
        <LinkButton href="/work" variant="secondary">
          See all work
        </LinkButton>
      </div>
      <div className="mt-10 -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 sm:mx-0 sm:px-0">
        {projects.map((project, i) => (
          <div key={project.id} className="w-64 shrink-0 snap-start sm:w-72">
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
    </Section>
  );
}
