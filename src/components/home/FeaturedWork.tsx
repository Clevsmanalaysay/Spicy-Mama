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
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}
