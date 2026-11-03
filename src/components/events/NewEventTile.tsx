"use client";

import { useRouter } from "next/navigation";
import { AddItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { createDraftEvent } from "@/lib/admin-data";

export function NewEventTile() {
  const router = useRouter();
  const { editMode } = useEditMode();
  if (!editMode) return null;

  async function handleAdd() {
    const slug = await createDraftEvent();
    router.push(`/events/${slug}`);
  }

  return <AddItemButton onClick={handleAdd} label="Add event" className="aspect-[4/3]" />;
}
