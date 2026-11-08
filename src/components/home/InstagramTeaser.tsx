"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { EditableText } from "@/components/edit/EditableText";
import { useEditMode } from "@/lib/edit-mode";
import { updateSiteSettings } from "@/lib/admin-data";
import type { SiteSettings } from "@/lib/types";

export function InstagramTeaser({ settings: initial }: { settings: SiteSettings }) {
  const { editMode } = useEditMode();
  const [settings, setSettings] = useState(initial);

  function patch(data: Partial<SiteSettings>) {
    setSettings((s) => ({ ...s, ...data }));
    return updateSiteSettings(data);
  }

  if (!editMode && !settings.socials.instagram) return null;

  return (
    <Section tone="raised" className="py-14 sm:py-20">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <InstagramIcon className="size-7 text-hot" aria-hidden="true" />
          {editMode ? (
            <EditableText
              value={settings.instagramHandle}
              onSave={(v) => patch({ instagramHandle: v })}
              as="h2"
              className="block font-display text-2xl font-bold sm:text-3xl"
            />
          ) : (
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{settings.instagramHandle}</h2>
          )}
        </div>
        {settings.socials.instagram ? (
          <LinkButton href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" variant="secondary">
            Follow on Instagram
          </LinkButton>
        ) : null}
      </div>
      {editMode ? (
        <div className="mt-4 max-w-sm">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-paper">Instagram link</p>
          <EditableText
            value={settings.socials.instagram ?? ""}
            onSave={(v) => patch({ socials: { ...settings.socials, instagram: v } })}
            placeholder="https://www.instagram.com/your-handle/"
            className="mt-1 block text-sm text-paper-dim"
          />
          <p className="mt-1 text-xs text-paper-dim">
            This section only shows to visitors once this link is set.
          </p>
        </div>
      ) : null}
      {settings.socials.instagram ? (
        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PlaceholderMedia key={i} alt="Latest Instagram post" seed={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : null}
    </Section>
  );
}
