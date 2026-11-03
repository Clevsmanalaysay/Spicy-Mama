"use client";

import { useState } from "react";
import Link from "next/link";
import { SparkleBullet } from "@/components/ui/SparkleDivider";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton, RemoveItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { deleteService, saveService } from "@/lib/admin-data";
import type { Project, Service } from "@/lib/types";

function DeliverablesEditor({ service, onChange }: { service: Service; onChange: (deliverables: string[]) => void }) {
  return (
    <div className="mt-4 space-y-2">
      {service.deliverables.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <SparkleBullet />
          <EditableText
            value={item}
            onSave={(v) => onChange(service.deliverables.map((d, idx) => (idx === i ? v : d)))}
            className="flex-1 text-sm text-paper"
          />
          <button
            type="button"
            onClick={() => onChange(service.deliverables.filter((_, idx) => idx !== i))}
            className="focus-ring text-paper-dim hover:text-hot-bright"
            aria-label="Remove deliverable"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...service.deliverables, "New deliverable"])}
        className="focus-ring text-xs font-semibold text-hot-bright hover:underline"
      >
        + Add deliverable
      </button>
    </div>
  );
}

export function ServiceBlocks({ services: initial, projects }: { services: Service[]; projects: Project[] }) {
  const { editMode } = useEditMode();
  const [services, setServices] = useState(initial);
  const projectsBySlug = new Map(projects.map((p) => [p.slug, p]));

  async function handleAdd() {
    const order = services.length ? Math.max(...services.map((s) => s.order)) + 1 : 1;
    const data = { name: "New service", description: "", deliverables: [], relatedProjectSlugs: [], order };
    const id = await saveService(null, data);
    setServices((list) => [...list, { id, ...data }]);
  }

  async function handleRemove(id: string) {
    await deleteService(id);
    setServices((list) => list.filter((s) => s.id !== id));
  }

  function patch(id: string, data: Partial<Service>) {
    setServices((list) => list.map((s) => (s.id === id ? { ...s, ...data } : s)));
    return saveService(id, { ...services.find((s) => s.id === id)!, ...data });
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {[...services]
        .sort((a, b) => a.order - b.order)
        .map((service) => {
          const relatedProjects = service.relatedProjectSlugs
            .map((slug) => projectsBySlug.get(slug))
            .filter((p): p is Project => Boolean(p));
          return (
            <div key={service.id} className="relative rounded-xl border border-line bg-ink-soft p-6 sm:p-8">
              {editMode ? (
                <RemoveItemButton onClick={() => handleRemove(service.id)} label={`Remove ${service.name}`} />
              ) : null}
              <EditableText
                value={service.name}
                onSave={(v) => patch(service.id, { name: v })}
                as="h3"
                className="font-display text-xl font-bold text-paper sm:text-2xl"
              />
              <EditableText
                value={service.description}
                onSave={(v) => patch(service.id, { description: v })}
                multiline
                className="mt-2 block text-sm text-paper-dim sm:text-base"
              />
              {editMode ? (
                <DeliverablesEditor service={service} onChange={(deliverables) => patch(service.id, { deliverables })} />
              ) : (
                <ul className="mt-4 space-y-2">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-paper">
                      <SparkleBullet className="mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {relatedProjects.length ? (
                <p className="mt-5 text-sm text-paper-dim">
                  Related work:{" "}
                  {relatedProjects.map((p, i) => (
                    <span key={p.id}>
                      <Link href={`/work/${p.slug}`} className="focus-ring font-semibold text-hot-bright hover:underline">
                        {p.title}
                      </Link>
                      {i < relatedProjects.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          );
        })}
      {editMode ? <AddItemButton onClick={handleAdd} label="Add service" className="min-h-40" /> : null}
    </div>
  );
}
