"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton, RemoveItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { updateSiteSettings } from "@/lib/admin-data";
import { whatWeDoIconMap, whatWeDoIconOptions } from "@/lib/icon-options";
import type { SiteSettings, WhatWeDoTile } from "@/lib/types";

export function WhatWeDo({ settings: initial }: { settings: SiteSettings }) {
  const { editMode } = useEditMode();
  const [settings, setSettings] = useState(initial);
  const tiles = settings.whatWeDoTiles;

  function patchTiles(whatWeDoTiles: WhatWeDoTile[]) {
    setSettings((s) => ({ ...s, whatWeDoTiles }));
    return updateSiteSettings({ whatWeDoTiles });
  }

  function patchTile(i: number, data: Partial<WhatWeDoTile>) {
    return patchTiles(tiles.map((t, idx) => (idx === i ? { ...t, ...data } : t)));
  }

  return (
    <Section tone="raised">
      <SectionHeading eyebrow="What we do" title="Three ways to work with us." />
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {tiles.map((tile, i) => {
          const Icon = whatWeDoIconMap[tile.icon];
          return (
            <div
              key={i}
              className="group relative flex flex-col gap-4 rounded-xl border border-line bg-ink p-6 transition-colors hover:border-hot"
            >
              {editMode ? <RemoveItemButton onClick={() => patchTiles(tiles.filter((_, idx) => idx !== i))} label="Remove tile" /> : null}
              {editMode ? (
                <select
                  value={tile.icon}
                  onChange={(e) => patchTile(i, { icon: e.target.value as WhatWeDoTile["icon"] })}
                  className="focus-ring w-fit rounded-full border border-hot bg-ink-soft px-2 py-1 text-xs font-bold text-hot"
                >
                  {whatWeDoIconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Icon className="size-8 text-hot" aria-hidden="true" />
              )}
              {editMode ? (
                <EditableText
                  value={tile.title}
                  onSave={(v) => patchTile(i, { title: v })}
                  className="block font-display text-xl font-bold text-paper"
                />
              ) : (
                <a href={tile.href} className="focus-ring block">
                  <h3 className="font-display text-xl font-bold text-paper group-hover:text-hot-bright">{tile.title}</h3>
                </a>
              )}
              {editMode ? (
                <EditableText
                  value={tile.description}
                  onSave={(v) => patchTile(i, { description: v })}
                  multiline
                  className="block text-sm text-paper-dim"
                />
              ) : (
                <p className="text-sm text-paper-dim">{tile.description}</p>
              )}
              {editMode ? (
                <EditableText
                  value={tile.href}
                  onSave={(v) => patchTile(i, { href: v })}
                  placeholder="Link (e.g. /studio)"
                  className="block text-xs text-paper-dim"
                />
              ) : null}
            </div>
          );
        })}
        {editMode ? (
          <AddItemButton
            onClick={() => patchTiles([...tiles, { icon: "sparkle", title: "New tile", description: "", href: "/" }])}
            label="Add tile"
            className="min-h-40"
          />
        ) : null}
      </div>
    </Section>
  );
}
