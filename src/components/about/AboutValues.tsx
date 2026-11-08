"use client";

import { useState } from "react";
import { SparkleBullet } from "@/components/ui/SparkleDivider";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton, RemoveItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { updateSiteSettings } from "@/lib/admin-data";
import type { SiteSettings } from "@/lib/types";

export function AboutValues({ settings: initial }: { settings: SiteSettings }) {
  const { editMode } = useEditMode();
  const [settings, setSettings] = useState(initial);
  const values = settings.aboutValues;

  function patch(aboutValues: string[]) {
    setSettings((s) => ({ ...s, aboutValues }));
    return updateSiteSettings({ aboutValues });
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {values.map((v, i) => (
        <li key={i} className="relative flex items-start gap-3 rounded-lg border border-line bg-ink-soft p-4 text-sm text-paper-dim">
          {editMode ? <RemoveItemButton onClick={() => patch(values.filter((_, idx) => idx !== i))} label="Remove value" /> : null}
          <SparkleBullet className="mt-1 shrink-0" />
          {editMode ? (
            <EditableText
              value={v}
              onSave={(val) => patch(values.map((x, idx) => (idx === i ? val : x)))}
              multiline
              className="block flex-1"
            />
          ) : (
            v
          )}
        </li>
      ))}
      {editMode ? <AddItemButton onClick={() => patch([...values, "New value"])} label="Add value" className="min-h-20" /> : null}
    </ul>
  );
}
