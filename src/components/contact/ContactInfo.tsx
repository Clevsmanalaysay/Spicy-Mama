"use client";

import { useState } from "react";
import { MapPin, Clock, Mail, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/Section";
import { EditableText } from "@/components/edit/EditableText";
import { InstagramIcon, FacebookIcon, TikTokIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { useEditMode } from "@/lib/edit-mode";
import { updateSiteSettings } from "@/lib/admin-data";
import type { SiteSettings } from "@/lib/types";

const socialFields: { key: keyof SiteSettings["socials"]; label: string; Icon: typeof InstagramIcon }[] = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
];

export function ContactInfo({ settings: initial }: { settings: SiteSettings }) {
  const { editMode } = useEditMode();
  const [settings, setSettings] = useState(initial);

  function patch(data: Partial<SiteSettings>) {
    setSettings((s) => ({ ...s, ...data }));
    return updateSiteSettings(data);
  }

  function patchSocial(key: keyof SiteSettings["socials"], value: string) {
    return patch({ socials: { ...settings.socials, [key]: value } });
  }

  return (
    <div>
      <SectionHeading eyebrow="Reach us directly" title="Contact info" />
      <ul className="mt-8 space-y-5">
        <li className="flex items-start gap-3">
          <Mail className="mt-0.5 size-5 shrink-0 text-hot" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold text-paper">Email</p>
            {editMode ? (
              <EditableText value={settings.contactEmail} onSave={(v) => patch({ contactEmail: v })} className="block text-paper-dim" />
            ) : (
              <a href={`mailto:${settings.contactEmail}`} className="focus-ring text-paper-dim hover:text-hot-bright">
                {settings.contactEmail}
              </a>
            )}
          </div>
        </li>
        <li className="flex items-start gap-3">
          <Phone className="mt-0.5 size-5 shrink-0 text-hot" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold text-paper">Phone</p>
            {editMode ? (
              <EditableText value={settings.phone} onSave={(v) => patch({ phone: v })} className="block text-paper-dim" />
            ) : (
              <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="focus-ring text-paper-dim hover:text-hot-bright">
                {settings.phone}
              </a>
            )}
          </div>
        </li>
        <li className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-5 shrink-0 text-hot" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold text-paper">Address</p>
            {editMode ? (
              <>
                <EditableText value={settings.address} onSave={(v) => patch({ address: v })} multiline className="block text-paper-dim" />
                <EditableText
                  value={settings.mapUrl ?? ""}
                  onSave={(v) => patch({ mapUrl: v })}
                  placeholder="Google Maps link"
                  className="mt-1 block text-xs text-paper-dim"
                />
              </>
            ) : settings.mapUrl ? (
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring text-paper-dim underline decoration-paper-dim/40 underline-offset-2 hover:text-hot-bright hover:decoration-hot-bright"
              >
                {settings.address}
              </a>
            ) : (
              <p className="text-paper-dim">{settings.address}</p>
            )}
          </div>
        </li>
        <li className="flex items-start gap-3">
          <Clock className="mt-0.5 size-5 shrink-0 text-hot" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold text-paper">Hours</p>
            {editMode ? (
              <EditableText value={settings.hours} onSave={(v) => patch({ hours: v })} className="block text-paper-dim" />
            ) : (
              <p className="text-paper-dim">{settings.hours}</p>
            )}
          </div>
        </li>
      </ul>

      {editMode ? (
        <div className="mt-8 space-y-3">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-paper">Social links</p>
          {socialFields.map(({ key, label, Icon }) => (
            <div key={key} className="flex items-center gap-2">
              <Icon className="size-5 shrink-0 text-paper-dim" />
              <EditableText
                value={settings.socials[key] ?? ""}
                onSave={(v) => patchSocial(key, v)}
                placeholder={`${label} URL`}
                className="flex-1 text-sm text-paper-dim"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex items-center gap-4">
          {settings.socials.instagram ? (
            <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="focus-ring text-paper hover:text-hot" aria-label="Instagram">
              <InstagramIcon className="size-6" />
            </a>
          ) : null}
          {settings.socials.facebook ? (
            <a href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="focus-ring text-paper hover:text-hot" aria-label="Facebook">
              <FacebookIcon className="size-6" />
            </a>
          ) : null}
          {settings.socials.tiktok ? (
            <a href={settings.socials.tiktok} target="_blank" rel="noopener noreferrer" className="focus-ring text-paper hover:text-hot" aria-label="TikTok">
              <TikTokIcon className="size-6" />
            </a>
          ) : null}
          {settings.socials.youtube ? (
            <a href={settings.socials.youtube} target="_blank" rel="noopener noreferrer" className="focus-ring text-paper hover:text-hot" aria-label="YouTube">
              <YoutubeIcon className="size-6" />
            </a>
          ) : null}
        </div>
      )}

      {!editMode && settings.mapUrl ? (
        <a
          href={settings.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-8 flex items-center gap-2 rounded-full border border-line px-5 py-3 font-display text-sm font-bold text-paper transition-colors hover:border-hot hover:text-hot-bright"
        >
          <MapPin className="size-4" aria-hidden="true" />
          View on Google Maps
        </a>
      ) : null}
    </div>
  );
}
