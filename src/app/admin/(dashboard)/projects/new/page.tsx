import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">New project</h1>
      <p className="mt-1 text-ink/60">Fill this in, then save as a draft or publish straight away.</p>
      <div className="mt-6">
        <ProjectForm projectId={null} />
      </div>
    </div>
  );
}
