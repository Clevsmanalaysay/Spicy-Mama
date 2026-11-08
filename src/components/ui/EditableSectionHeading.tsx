"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/edit/EditableText";
import { SectionHeading } from "@/components/ui/Section";
import { useEditMode } from "@/lib/edit-mode";
import { updateSiteSettings } from "@/lib/admin-data";
import type { SiteSettings } from "@/lib/types";

/**
 * A SectionHeading backed by Firestore instead of a hardcoded string. Every
 * page has a handful of these (section eyebrow/title/description) that were
 * plain literals in the page.tsx, invisible to the inline editor — this
 * makes any of them editable by giving each a unique `sectionKey` into a
 * free-form map on SiteSettings, rather than adding a dedicated typed field
 * per heading (there are 20+ of these across the site).
 */
export function EditableSectionHeading({
  settings: initial,
  sectionKey,
  defaultEyebrow,
  defaultTitle,
  defaultDescription,
  tone = "dark",
  className,
}: {
  settings: SiteSettings;
  sectionKey: string;
  defaultEyebrow?: string;
  defaultTitle: string;
  defaultDescription?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const { editMode } = useEditMode();
  const [settings, setSettings] = useState(initial);
  const current = settings.sectionHeadings?.[sectionKey] ?? {
    eyebrow: defaultEyebrow,
    title: defaultTitle,
    description: defaultDescription,
  };

  function patch(data: Partial<{ eyebrow: string; title: string; description: string }>) {
    const next = { ...current, ...data };
    const nextMap = { ...(settings.sectionHeadings ?? {}), [sectionKey]: next };
    setSettings((s) => ({ ...s, sectionHeadings: nextMap }));
    return updateSiteSettings({ sectionHeadings: nextMap });
  }

  if (!editMode) {
    return (
      <SectionHeading eyebrow={current.eyebrow} title={current.title} description={current.description} tone={tone} className={className} />
    );
  }

  return (
    <div className={cn("max-w-2xl", className)}>
      {defaultEyebrow !== undefined ? (
        <EditableText
          value={current.eyebrow ?? ""}
          onSave={(v) => patch({ eyebrow: v })}
          className={cn(
            "block font-display text-xs font-bold uppercase tracking-[0.2em]",
            tone === "dark" ? "text-hot-bright" : "text-hot-deep",
          )}
        />
      ) : null}
      <EditableText
        value={current.title}
        onSave={(v) => patch({ title: v })}
        as="h2"
        className="mt-2 block font-display text-3xl font-bold sm:text-4xl"
      />
      {defaultDescription !== undefined ? (
        <EditableText
          value={current.description ?? ""}
          onSave={(v) => patch({ description: v })}
          multiline
          className={cn("mt-4 block text-base sm:text-lg", tone === "dark" ? "text-paper-dim" : "text-ink/70")}
        />
      ) : null}
    </div>
  );
}
