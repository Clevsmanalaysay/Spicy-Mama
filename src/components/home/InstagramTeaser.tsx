import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import type { SiteSettings } from "@/lib/types";

export function InstagramTeaser({ settings }: { settings: SiteSettings }) {
  if (!settings.socials.instagram) return null;
  return (
    <Section tone="raised" className="py-14 sm:py-20">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <InstagramIcon className="size-7 text-hot" aria-hidden="true" />
          <h2 className="font-display text-2xl font-bold sm:text-3xl">@spicymamastudio</h2>
        </div>
        <LinkButton href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" variant="secondary">
          Follow on Instagram
        </LinkButton>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PlaceholderMedia
            key={i}
            alt="Latest Instagram post"
            seed={i}
            className="aspect-square rounded-lg"
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-paper-dim">
        Live feed embed or manual picks — connect in Admin once Instagram access is set up.
      </p>
    </Section>
  );
}
