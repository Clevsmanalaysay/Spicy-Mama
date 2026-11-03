"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectCard } from "./ProjectCard";
import { AddItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { createDraftProject } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import type { Project, ProjectType } from "@/lib/types";

const filters: { label: string; value: ProjectType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Film", value: "film" },
  { label: "Commercial", value: "commercial" },
  { label: "Music Video", value: "music-video" },
  { label: "Collaboration", value: "collaboration" },
  { label: "Event", value: "event" },
];

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const { editMode } = useEditMode();
  const [active, setActive] = useState<ProjectType | "all">("all");

  const filtered = useMemo(() => {
    const base = active === "all" ? projects : projects.filter((p) => p.type === active);
    return [...base].sort((a, b) => a.order - b.order);
  }, [projects, active]);

  async function handleAddProject() {
    const slug = await createDraftProject();
    router.push(`/work/${slug}`);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by type">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={active === f.value}
            onClick={() => setActive(f.value)}
            className={cn(
              "focus-ring rounded-full border px-4 py-2 font-display text-xs font-bold uppercase tracking-wide transition-colors",
              active === f.value
                ? "border-hot bg-hot text-ink"
                : "border-line text-paper-dim hover:border-hot hover:text-paper",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length || editMode ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
          {editMode ? <AddItemButton onClick={handleAddProject} label="Add project" className="aspect-[3/4]" /> : null}
        </div>
      ) : (
        <p className="mt-10 text-paper-dim">No projects in this category yet.</p>
      )}
    </div>
  );
}
