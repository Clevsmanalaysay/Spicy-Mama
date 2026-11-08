"use client";

import { useState, type ReactNode } from "react";
import { EditableText } from "@/components/edit/EditableText";
import { useEditMode } from "@/lib/edit-mode";
import { updateSiteSettings } from "@/lib/admin-data";
import type { PageHeroContent, SiteSettings } from "@/lib/types";

type PageKey = keyof SiteSettings["pageHero"];

export function EditablePageHero({
  page,
  settings: initial,
  children,
}: {
  page: PageKey;
  settings: SiteSettings;
  children?: ReactNode;
}) {
  const { editMode } = useEditMode();
  const [settings, setSettings] = useState(initial);
  const hero = settings.pageHero[page];

  function patch(data: Partial<PageHeroContent>) {
    const nextHero = { ...hero, ...data };
    const next = { ...settings, pageHero: { ...settings.pageHero, [page]: nextHero } };
    setSettings(next);
    return updateSiteSettings({ pageHero: next.pageHero });
  }

  return (
    <section className="border-b border-line bg-ink pb-14 pt-20 sm:pt-28">
      <div className="mx-auto max-w-6xl px-6">
        {editMode ? (
          <EditableText
            value={hero.eyebrow}
            onSave={(v) => patch({ eyebrow: v })}
            className="block font-display text-xs font-bold uppercase tracking-[0.25em] text-hot-bright"
          />
        ) : (
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-hot-bright">{hero.eyebrow}</p>
        )}
        {editMode ? (
          <EditableText
            value={hero.title}
            onSave={(v) => patch({ title: v })}
            multiline
            className="mt-3 block max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl"
          />
        ) : (
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl">{hero.title}</h1>
        )}
        {editMode ? (
          <EditableText
            value={hero.description}
            onSave={(v) => patch({ description: v })}
            multiline
            className="mt-5 block max-w-2xl text-base text-paper-dim sm:text-lg"
          />
        ) : hero.description ? (
          <p className="mt-5 max-w-2xl text-base text-paper-dim sm:text-lg">{hero.description}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
