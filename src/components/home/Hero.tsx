"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { EditableImage } from "@/components/edit/EditableImage";
import { EditableText } from "@/components/edit/EditableText";
import { updateSiteSettings } from "@/lib/admin-data";
import type { SiteSettings } from "@/lib/types";

export function Hero({ settings: initial }: { settings: SiteSettings }) {
  const [settings, setSettings] = useState(initial);

  function patch(data: Partial<SiteSettings>) {
    setSettings((s) => ({ ...s, ...data }));
    return updateSiteSettings(data);
  }

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0">
        <EditableImage
          src={settings.heroMedia}
          alt="Spicy Mama Creative Studio reel"
          pathPrefix="site/hero"
          onSave={(url) => patch({ heroMedia: url })}
          className="h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
      </div>
      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-32 sm:min-h-[85vh]">
        <EditableText
          value={settings.heroTagline}
          onSave={(v) => patch({ heroTagline: v })}
          as="p"
          className="font-display text-sm font-bold uppercase tracking-[0.3em] text-hot-bright"
        />
        <EditableText
          value={settings.heroHeadline}
          onSave={(v) => patch({ heroHeadline: v })}
          as="h1"
          multiline
          className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-6xl"
        />
        <EditableText
          value={settings.heroSubtext}
          onSave={(v) => patch({ heroSubtext: v })}
          as="p"
          multiline
          className="mt-5 block max-w-xl text-base text-paper-dim sm:text-lg"
        />
        <div className="mt-8 flex flex-wrap gap-4">
          <LinkButton href="/contact?type=Production" size="lg">
            Work with us
          </LinkButton>
          <LinkButton href="/venue#booking-form" variant="secondary" size="lg">
            Book the venue
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
