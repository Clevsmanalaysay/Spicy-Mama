"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { SparkleDivider } from "@/components/ui/SparkleDivider";
import { EditableText } from "@/components/edit/EditableText";
import { useEditMode } from "@/lib/edit-mode";
import { updateSiteSettings } from "@/lib/admin-data";
import type { SiteSettings } from "@/lib/types";

export function ClosingCta({ settings: initial }: { settings: SiteSettings }) {
  const { editMode } = useEditMode();
  const [settings, setSettings] = useState(initial);

  function patch(closingCtaHeading: string) {
    setSettings((s) => ({ ...s, closingCtaHeading }));
    return updateSiteSettings({ closingCtaHeading });
  }

  return (
    <section className="bg-ink py-20 text-center sm:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <SparkleDivider className="mx-auto max-w-xs" />
        {editMode ? (
          <EditableText
            value={settings.closingCtaHeading}
            onSave={patch}
            multiline
            className="mt-8 block font-display text-3xl font-bold sm:text-5xl"
          />
        ) : (
          <h2 className="mt-8 font-display text-3xl font-bold sm:text-5xl">{settings.closingCtaHeading}</h2>
        )}
        <div className="mt-8">
          <LinkButton href="/contact" size="lg">
            Start a conversation
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
