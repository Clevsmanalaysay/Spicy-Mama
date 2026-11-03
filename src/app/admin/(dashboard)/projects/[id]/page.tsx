"use client";

import { use, useEffect, useState } from "react";
import { Sparkle } from "lucide-react";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectAdmin } from "@/lib/admin-data";
import type { Project } from "@/lib/types";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    getProjectAdmin(id).then(setProject);
  }, [id]);

  if (project === undefined) {
    return <Sparkle className="size-6 animate-sparkle fill-hot-deep text-hot-deep" aria-hidden="true" />;
  }

  if (project === null) {
    return <p className="text-ink/60">Project not found.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Edit project</h1>
      <div className="mt-6">
        <ProjectForm projectId={id} initial={project} />
      </div>
    </div>
  );
}
