"use client";

import { useState } from "react";
import { SparkleBullet } from "@/components/ui/SparkleDivider";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { updateVenueContent } from "@/lib/admin-data";

export function HouseRules({ rules: initial }: { rules: string[] }) {
  const { editMode } = useEditMode();
  const [rules, setRules] = useState(initial);

  function persist(next: string[]) {
    setRules(next);
    return updateVenueContent({ rules: next });
  }

  return (
    <div id="house-rules">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">House rules &amp; policies</h2>
      <ul className="mt-6 space-y-3">
        {rules.map((rule, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-paper-dim sm:text-base">
            <SparkleBullet className="mt-1" />
            {editMode ? (
              <div className="flex flex-1 items-start gap-2">
                <EditableText
                  value={rule}
                  onSave={(v) => persist(rules.map((r, idx) => (idx === i ? v : r)))}
                  multiline
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => persist(rules.filter((_, idx) => idx !== i))}
                  className="focus-ring mt-1 text-paper-dim hover:text-hot-bright"
                  aria-label="Remove rule"
                >
                  ×
                </button>
              </div>
            ) : (
              rule
            )}
          </li>
        ))}
      </ul>
      {editMode ? (
        <AddItemButton onClick={() => persist([...rules, "New rule"])} label="Add rule" className="mt-4 w-full py-3" />
      ) : null}
    </div>
  );
}
