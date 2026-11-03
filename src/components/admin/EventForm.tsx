"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Field, TextInput, TextArea, Select } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { MultiImageUploadField } from "./MultiImageUploadField";
import { deleteEvent, saveEvent } from "@/lib/admin-data";
import { eventTypeOptions } from "@/lib/seed-data";
import type { SpicyEvent } from "@/lib/types";

function emptyEvent(): Omit<SpicyEvent, "id"> {
  return {
    slug: "",
    title: "",
    date: "",
    type: eventTypeOptions[0],
    summary: "",
    description: "",
    coverUrl: undefined,
    photos: [],
    hostConsent: false,
    isPublic: true,
    status: "draft",
    order: 50,
  };
}

export function EventForm({ eventId, initial }: { eventId: string | null; initial?: SpicyEvent }) {
  const router = useRouter();
  const [values, setValues] = useState<Omit<SpicyEvent, "id">>(initial ?? emptyEvent());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof Omit<SpicyEvent, "id">>(key: K, value: Omit<SpicyEvent, "id">[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSave(status: "draft" | "published") {
    setError("");
    if (status === "published" && !values.isPublic && values.photos.length > 0 && !values.hostConsent) {
      setError("This is a private event with photos — tick \"Host consent received\" before publishing.");
      return;
    }
    setSaving(true);
    try {
      await saveEvent(eventId, { ...values, status });
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save — try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!eventId) return;
    if (!confirm(`Delete "${values.title}"? This can't be undone.`)) return;
    await deleteEvent(eventId);
    router.push("/admin/events");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Basics</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Title" htmlFor="title" required>
            <TextInput id="title" value={values.title} onChange={(e) => update("title", e.target.value)} required />
          </Field>
          <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate">
            <TextInput id="slug" value={values.slug} onChange={(e) => update("slug", e.target.value)} placeholder="auto-generated" />
          </Field>
          <Field label="Date" htmlFor="date" required>
            <TextInput id="date" type="date" value={values.date} onChange={(e) => update("date", e.target.value)} required />
          </Field>
          <Field label="Type" htmlFor="type" required>
            <Select id="type" value={values.type} onChange={(e) => update("type", e.target.value)}>
              {eventTypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Short write-up" htmlFor="summary" required hint="Shows on event cards">
            <TextArea id="summary" value={values.summary} onChange={(e) => update("summary", e.target.value)} required />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Full recap" htmlFor="description">
            <TextArea id="description" value={values.description ?? ""} onChange={(e) => update("description", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-line-light bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Visibility &amp; consent</h2>
        </div>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={values.isPublic}
              onChange={(e) => update("isPublic", e.target.checked)}
              className="size-4 accent-[var(--color-hot-deep)]"
            />
            Public event (screenings, workshops, pop-ups)
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={values.hostConsent}
              onChange={(e) => update("hostConsent", e.target.checked)}
              className="size-4 accent-[var(--color-hot-deep)]"
            />
            Host consent received (required to publish private-event photos)
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Photos</h2>
        <p className="mt-1 text-sm text-ink/60">Bulk upload up to 50, then pick a cover.</p>
        <div className="mt-4">
          <MultiImageUploadField
            value={values.photos}
            onChange={(photos) => update("photos", photos)}
            pathPrefix={`events/${values.slug || "new"}/photos`}
            cover={values.coverUrl}
            onCoverChange={(url) => update("coverUrl", url)}
            max={50}
          />
        </div>
      </div>

      <div className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Ordering</h2>
        <div className="mt-4 max-w-[10rem]">
          <Field label="Order" htmlFor="order">
            <TextInput id="order" type="number" value={values.order} onChange={(e) => update("order", Number(e.target.value))} />
          </Field>
        </div>
      </div>

      {error ? <p className="text-sm font-semibold text-hot-deep">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => handleSave("draft")} variant="secondary" disabled={saving}>
          Save draft
        </Button>
        <Button type="button" onClick={() => handleSave("published")} disabled={saving}>
          {saving ? "Saving…" : "Publish"}
        </Button>
        {eventId ? (
          <button
            type="button"
            onClick={handleDelete}
            className="focus-ring ml-auto flex items-center gap-1 text-sm font-semibold text-hot-deep hover:underline"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete event
          </button>
        ) : null}
      </div>
    </div>
  );
}
