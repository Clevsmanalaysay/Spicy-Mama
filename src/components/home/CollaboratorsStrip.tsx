"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton, RemoveItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { deleteCollaborator, saveCollaborator } from "@/lib/admin-data";
import type { Collaborator } from "@/lib/types";

export function CollaboratorsStrip({ collaborators: initial }: { collaborators: Collaborator[] }) {
  const { canEdit, editMode } = useEditMode();
  const [collaborators, setCollaborators] = useState(initial);

  if (!collaborators.length && !(canEdit && editMode)) return null;

  async function handleAdd() {
    const order = collaborators.length ? Math.max(...collaborators.map((c) => c.order)) + 1 : 1;
    const id = await saveCollaborator(null, { name: "New collaborator", order });
    setCollaborators((list) => [...list, { id, name: "New collaborator", order }]);
  }

  async function handleRemove(id: string) {
    await deleteCollaborator(id);
    setCollaborators((list) => list.filter((c) => c.id !== id));
  }

  function patch(id: string, data: Partial<Collaborator>) {
    setCollaborators((list) => list.map((c) => (c.id === id ? { ...c, ...data } : c)));
    return saveCollaborator(id, { ...collaborators.find((c) => c.id === id)!, ...data });
  }

  return (
    <Section tone="dark" className="py-10 sm:py-14">
      <p className="text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-paper-dim">
        Collaborators &amp; partners
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {collaborators.map((c) =>
          editMode ? (
            <div key={c.id} className="relative flex items-center gap-2 rounded-lg border border-line px-3 py-2">
              <div>
                <EditableText
                  value={c.name}
                  onSave={(v) => patch(c.id, { name: v })}
                  className="block font-display text-base font-bold text-paper"
                />
                <EditableText
                  value={c.link ?? ""}
                  onSave={(v) => patch(c.id, { link: v })}
                  placeholder="Link (optional)"
                  className="mt-0.5 block text-xs text-paper-dim"
                />
              </div>
              <RemoveItemButton onClick={() => handleRemove(c.id)} label={`Remove ${c.name}`} />
            </div>
          ) : c.link ? (
            <a
              key={c.id}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring font-display text-lg font-bold text-paper-dim transition-colors hover:text-hot-bright"
            >
              {c.name}
            </a>
          ) : (
            <span key={c.id} className="font-display text-lg font-bold text-paper-dim">
              {c.name}
            </span>
          ),
        )}
        {editMode ? <AddItemButton onClick={handleAdd} label="Add collaborator" className="px-4 py-2" /> : null}
      </div>
    </Section>
  );
}
