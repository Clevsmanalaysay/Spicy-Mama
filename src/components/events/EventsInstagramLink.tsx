"use client";

import { useState } from "react";
import { EditableText } from "@/components/edit/EditableText";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { useEditMode } from "@/lib/edit-mode";
import { updateSiteSettings } from "@/lib/admin-data";
import type { SiteSettings } from "@/lib/types";

/**
 * The venue runs its own separate Instagram account from the main studio's
 * (settings.socials.instagram, used on Home/Footer/Contact) — this is a
 * distinct handle+link shown only here on the Events page.
 */
export function EventsInstagramLink({ settings: initial }: { settings: SiteSettings }) {
  const { editMode } = useEditMode();
  const [settings, setSettings] = useState(initial);

  function patch(data: Partial<SiteSettings>) {
    setSettings((s) => ({ ...s, ...data }));
    return updateSiteSettings(data);
  }

  if (!editMode && !settings.eventsInstagramUrl) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-2 text-center">
      <p className="text-sm text-paper-dim">Follow this space on Instagram</p>
      {editMode ? (
        <div className="flex flex-col items-center gap-1">
          <EditableText
            value={settings.eventsInstagramHandle ?? ""}
            onSave={(v) => patch({ eventsInstagramHandle: v })}
            placeholder="@handle"
            className="font-display text-lg font-bold text-hot-bright"
          />
          <EditableText
            value={settings.eventsInstagramUrl ?? ""}
            onSave={(v) => patch({ eventsInstagramUrl: v })}
            placeholder="https://instagram.com/..."
            className="text-xs text-paper-dim"
          />
        </div>
      ) : (
        <a
          href={settings.eventsInstagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-2 font-display text-lg font-bold text-hot-bright hover:underline"
        >
          <InstagramIcon className="size-5" />
          {settings.eventsInstagramHandle || "View on Instagram"}
        </a>
      )}
    </div>
  );
}
