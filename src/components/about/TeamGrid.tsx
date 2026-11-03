"use client";

import { useState } from "react";
import { EditableImage } from "@/components/edit/EditableImage";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton, RemoveItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { deleteTeamMember, saveTeamMember } from "@/lib/admin-data";
import type { TeamMember } from "@/lib/types";

export function TeamGrid({ team: initial }: { team: TeamMember[] }) {
  const { editMode } = useEditMode();
  const [team, setTeam] = useState(initial);

  async function handleAdd() {
    const order = team.length ? Math.max(...team.map((t) => t.order)) + 1 : 1;
    const data = { name: "New team member", role: "Role", bio: "", order };
    const id = await saveTeamMember(null, data);
    setTeam((list) => [...list, { id, ...data }]);
  }

  async function handleRemove(id: string) {
    await deleteTeamMember(id);
    setTeam((list) => list.filter((t) => t.id !== id));
  }

  function patch(id: string, data: Partial<TeamMember>) {
    setTeam((list) => list.map((t) => (t.id === id ? { ...t, ...data } : t)));
    return saveTeamMember(id, { ...team.find((t) => t.id === id)!, ...data });
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((member, i) => (
        <div key={member.id} className="relative rounded-xl border border-line bg-ink-soft p-5">
          {editMode ? <RemoveItemButton onClick={() => handleRemove(member.id)} label={`Remove ${member.name}`} /> : null}
          <EditableImage
            src={member.photoUrl}
            alt={member.name}
            seed={i}
            pathPrefix={`team/${member.id}`}
            onSave={(url) => patch(member.id, { photoUrl: url })}
            className="aspect-square w-full rounded-lg"
          />
          <EditableText
            value={member.name}
            onSave={(v) => patch(member.id, { name: v })}
            as="h3"
            className="mt-4 font-display text-lg font-bold text-paper"
          />
          <EditableText
            value={member.role}
            onSave={(v) => patch(member.id, { role: v })}
            as="p"
            className="block text-sm font-semibold text-hot-bright"
          />
          <EditableText
            value={member.bio}
            onSave={(v) => patch(member.id, { bio: v })}
            multiline
            as="p"
            className="mt-2 block text-sm text-paper-dim"
          />
        </div>
      ))}
      {editMode ? <AddItemButton onClick={handleAdd} label="Add team member" className="min-h-48" /> : null}
    </div>
  );
}
