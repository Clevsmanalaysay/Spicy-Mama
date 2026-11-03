"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton, RemoveItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { deletePressMention, savePressMention } from "@/lib/admin-data";
import type { PressMention } from "@/lib/types";

export function PressMentions({ press: initial }: { press: PressMention[] }) {
  const { editMode } = useEditMode();
  const [press, setPress] = useState(initial);

  async function handleAdd() {
    const order = press.length ? Math.max(...press.map((p) => p.order)) + 1 : 1;
    const data = { title: "New mention", outlet: "", url: "", order };
    const id = await savePressMention(null, data);
    setPress((list) => [...list, { id, ...data }]);
  }

  async function handleRemove(id: string) {
    await deletePressMention(id);
    setPress((list) => list.filter((p) => p.id !== id));
  }

  function patch(id: string, data: Partial<PressMention>) {
    setPress((list) => list.map((p) => (p.id === id ? { ...p, ...data } : p)));
    return savePressMention(id, { ...press.find((p) => p.id === id)!, ...data });
  }

  if (!press.length && !editMode) {
    return <p className="text-paper-dim">Press mentions will appear here as they&apos;re added in Admin.</p>;
  }

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {press.map((p) => (
          <li key={p.id} className="relative rounded-lg border border-line bg-ink-soft p-4">
            {editMode ? <RemoveItemButton onClick={() => handleRemove(p.id)} label={`Remove ${p.title}`} /> : null}
            {editMode ? (
              <div className="space-y-2">
                <EditableText value={p.title} onSave={(v) => patch(p.id, { title: v })} className="block font-display font-bold text-paper" />
                <EditableText value={p.outlet} onSave={(v) => patch(p.id, { outlet: v })} placeholder="Outlet" className="block text-sm text-paper-dim" />
                <EditableText value={p.url} onSave={(v) => patch(p.id, { url: v })} placeholder="URL" className="block text-sm text-paper-dim" />
              </div>
            ) : (
              <>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring flex items-start justify-between gap-2 font-display font-bold text-paper hover:text-hot-bright"
                >
                  {p.title}
                  <ExternalLink className="mt-1 size-4 shrink-0" aria-hidden="true" />
                </a>
                <p className="mt-1 text-sm text-paper-dim">
                  {p.outlet}
                  {p.date ? ` · ${p.date}` : ""}
                </p>
              </>
            )}
          </li>
        ))}
      </ul>
      {editMode ? <AddItemButton onClick={handleAdd} label="Add press mention" className="mt-4 w-full" /> : null}
    </div>
  );
}
