"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectCard } from "./ProjectCard";
import { AddItemButton } from "@/components/edit/EditableListControls";
import { Pagination } from "@/components/ui/Pagination";
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

const PAGE_SIZE = 9;

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const { editMode } = useEditMode();
  const [active, setActive] = useState<ProjectType | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const base = active === "all" ? projects : projects.filter((p) => p.type === active);
    return [...base].sort((a, b) => a.order - b.order);
  }, [projects, active]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleFilterChange(value: ProjectType | "all") {
    setActive(value);
    setPage(1);
  }

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
            onClick={() => handleFilterChange(f.value)}
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
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
            {editMode ? <AddItemButton onClick={handleAddProject} label="Add project" className="aspect-[3/4]" /> : null}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
        </>
      ) : (
        <p className="mt-10 text-paper-dim">No projects in this category yet.</p>
      )}
    </div>
  );
}
