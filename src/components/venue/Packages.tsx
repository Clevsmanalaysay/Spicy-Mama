"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton, RemoveItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { updateVenueContent } from "@/lib/admin-data";
import type { VenuePackage } from "@/lib/types";

export function Packages({ packages: initial }: { packages: VenuePackage[] }) {
  const { editMode } = useEditMode();
  const [packages, setPackages] = useState(initial);

  function persist(next: VenuePackage[]) {
    setPackages(next);
    return updateVenueContent({ packages: next });
  }

  function patch(i: number, data: Partial<VenuePackage>) {
    return persist(packages.map((p, idx) => (idx === i ? { ...p, ...data } : p)));
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold sm:text-3xl">Packages &amp; pricing</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {packages.map((pkg, i) => (
          <div key={i} className="relative flex flex-col rounded-xl border border-line bg-ink-soft p-6">
            {editMode ? (
              <RemoveItemButton onClick={() => persist(packages.filter((_, idx) => idx !== i))} label={`Remove ${pkg.name}`} />
            ) : null}
            <EditableText
              value={pkg.name}
              onSave={(v) => patch(i, { name: v })}
              as="h3"
              className="font-display text-xl font-bold text-paper"
            />
            <EditableText
              value={pkg.description}
              onSave={(v) => patch(i, { description: v })}
              multiline
              as="p"
              className="mt-2 block flex-1 text-sm text-paper-dim"
            />
            <EditableText
              value={pkg.priceFrom ?? ""}
              onSave={(v) => patch(i, { priceFrom: v })}
              placeholder="Request a quote"
              as="p"
              className="mt-4 block font-display text-sm font-bold text-hot-bright"
            />
          </div>
        ))}
        {editMode ? (
          <AddItemButton
            onClick={() => persist([...packages, { name: "New package", description: "", priceFrom: "" }])}
            label="Add package"
            className="min-h-32"
          />
        ) : null}
      </div>
      <div className="mt-6">
        <LinkButton href="#booking-form" variant="secondary">
          Request a quote
        </LinkButton>
      </div>
    </div>
  );
}
