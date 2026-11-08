"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton, RemoveItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { deleteCollaborator, saveCollaborator, updateSiteSettings } from "@/lib/admin-data";
import type { Collaborator, SiteSettings } from "@/lib/types";

const HEADING_KEY = "home.collaborators";
const DEFAULT_HEADING = "Collaborators & partners";

export function CollaboratorsStrip({
  collaborators: initial,
  settings: initialSettings,
}: {
  collaborators: Collaborator[];
  settings: SiteSettings;
}) {
  const { canEdit, editMode } = useEditMode();
  const [collaborators, setCollaborators] = useState(initial);
  const [settings, setSettings] = useState(initialSettings);
  const heading = settings.sectionHeadings?.[HEADING_KEY]?.title ?? DEFAULT_HEADING;

  if (!collaborators.length && !(canEdit && editMode)) return null;

  function patchHeading(title: string) {
    const nextMap = { ...(settings.sectionHeadings ?? {}), [HEADING_KEY]: { title } };
    setSettings((s) => ({ ...s, sectionHeadings: nextMap }));
    return updateSiteSettings({ sectionHeadings: nextMap });
  }

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
      {editMode ? (
        <EditableText
          value={heading}
          onSave={patchHeading}
          className="block text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-paper-dim"
        />
      ) : (
        <p className="text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-paper-dim">{heading}</p>
      )}
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
