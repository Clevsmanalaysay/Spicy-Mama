"use client";

import { useEffect, useState } from "react";
import { Field, TextInput, TextArea } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MultiImageUploadField } from "@/components/admin/MultiImageUploadField";
import { updateSiteSettings, updateVenueContent } from "@/lib/admin-data";
import { getSiteSettings, getVenueContent } from "@/lib/content";
import type { SiteSettings, VenueContent } from "@/lib/types";

function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [venue, setVenue] = useState<VenueContent | null>(null);
  const [amenitiesText, setAmenitiesText] = useState("");
  const [rulesText, setRulesText] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingVenue, setSavingVenue] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    getSiteSettings().then(setSettings);
    getVenueContent().then((v) => {
      setVenue(v);
      setAmenitiesText(v.amenities.join("\n"));
      setRulesText(v.rules.join("\n"));
    });
  }, []);

  async function saveSettings() {
    if (!settings) return;
    setSavingSettings(true);
    await updateSiteSettings(settings);
    setSavingSettings(false);
    setSavedMsg("Site settings saved.");
    setTimeout(() => setSavedMsg(""), 3000);
  }

  async function saveVenue() {
    if (!venue) return;
    setSavingVenue(true);
    await updateVenueContent({
      ...venue,
      amenities: linesToList(amenitiesText),
      rules: linesToList(rulesText),
    });
    setSavingVenue(false);
    setSavedMsg("Venue content saved.");
    setTimeout(() => setSavedMsg(""), 3000);
  }

  if (!settings || !venue) return <p className="text-ink/50">Loading…</p>;

  return (
    <div className="max-w-3xl space-y-10">
      <h1 className="font-display text-3xl font-bold">Site settings</h1>
      {savedMsg ? <p className="rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">{savedMsg}</p> : null}

      <section className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Homepage hero</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Headline" htmlFor="heroHeadline">
            <TextInput id="heroHeadline" value={settings.heroHeadline} onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })} />
          </Field>
          <Field label="Tagline" htmlFor="heroTagline">
            <TextInput id="heroTagline" value={settings.heroTagline} onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })} />
          </Field>
        </div>
        <div className="mt-4">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-ink">Hero media</p>
          <div className="mt-2">
            <ImageUploadField value={settings.heroMedia} onChange={(url) => setSettings({ ...settings, heroMedia: url })} pathPrefix="site/hero" label="Hero media" />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Contact info</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Public contact email" htmlFor="contactEmail">
            <TextInput id="contactEmail" type="email" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} />
          </Field>
          <Field label="Form notification email" htmlFor="notifyEmail" hint="Where new messages/bookings are sent">
            <TextInput id="notifyEmail" type="email" value={settings.notifyEmail} onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.value })} />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <TextInput id="phone" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          </Field>
          <Field label="Hours" htmlFor="hours">
            <TextInput id="hours" value={settings.hours} onChange={(e) => setSettings({ ...settings, hours: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Address" htmlFor="address">
            <TextInput id="address" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Map embed URL" htmlFor="mapUrl" hint="Google Maps embed src URL">
            <TextInput id="mapUrl" value={settings.mapUrl ?? ""} onChange={(e) => setSettings({ ...settings, mapUrl: e.target.value })} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Social links</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Instagram" htmlFor="instagram">
            <TextInput
              id="instagram"
              value={settings.socials.instagram ?? ""}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, instagram: e.target.value } })}
            />
          </Field>
          <Field label="Facebook" htmlFor="facebook">
            <TextInput
              id="facebook"
              value={settings.socials.facebook ?? ""}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, facebook: e.target.value } })}
            />
          </Field>
          <Field label="TikTok" htmlFor="tiktok">
            <TextInput
              id="tiktok"
              value={settings.socials.tiktok ?? ""}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, tiktok: e.target.value } })}
            />
          </Field>
          <Field label="YouTube" htmlFor="youtube">
            <TextInput
              id="youtube"
              value={settings.socials.youtube ?? ""}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, youtube: e.target.value } })}
            />
          </Field>
        </div>
      </section>

      <Button type="button" onClick={saveSettings} disabled={savingSettings}>
        {savingSettings ? "Saving…" : "Save site settings"}
      </Button>

      <hr className="border-line-light" />

      <h1 className="font-display text-3xl font-bold">Venue content</h1>

      <section className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">The space</h2>
        <div className="mt-4">
          <Field label="Intro" htmlFor="venueIntro">
            <TextArea id="venueIntro" value={venue.intro} onChange={(e) => setVenue({ ...venue, intro: e.target.value })} />
          </Field>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Standing capacity" htmlFor="capacityStanding">
            <TextInput
              id="capacityStanding"
              type="number"
              value={venue.capacityStanding}
              onChange={(e) => setVenue({ ...venue, capacityStanding: Number(e.target.value) })}
            />
          </Field>
          <Field label="Seated capacity" htmlFor="capacitySeated">
            <TextInput
              id="capacitySeated"
              type="number"
              value={venue.capacitySeated}
              onChange={(e) => setVenue({ ...venue, capacitySeated: Number(e.target.value) })}
            />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Amenities" htmlFor="amenities" hint="One per line">
            <TextArea id="amenities" value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} />
          </Field>
        </div>
        <div className="mt-5">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-ink">Gallery</p>
          <div className="mt-2">
            <MultiImageUploadField value={venue.gallery} onChange={(gallery) => setVenue({ ...venue, gallery })} pathPrefix="venue/gallery" max={12} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">House rules &amp; policies</h2>
        <div className="mt-4">
          <Field label="Rules" htmlFor="rules" hint="One per line">
            <TextArea id="rules" value={rulesText} onChange={(e) => setRulesText(e.target.value)} />
          </Field>
        </div>
      </section>

      <Button type="button" onClick={saveVenue} disabled={savingVenue}>
        {savingVenue ? "Saving…" : "Save venue content"}
      </Button>
    </div>
  );
}
