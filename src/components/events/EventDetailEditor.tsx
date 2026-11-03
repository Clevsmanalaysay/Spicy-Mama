"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkle, Trash2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { EditableImage } from "@/components/edit/EditableImage";
import { EditableText } from "@/components/edit/EditableText";
import { useEditMode } from "@/lib/edit-mode";
import { deleteEvent, patchEvent, uploadImage } from "@/lib/admin-data";
import { eventTypeOptions } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { SpicyEvent } from "@/lib/types";

export function EventDetailEditor({ event: initial }: { event: SpicyEvent }) {
  const router = useRouter();
  const { ready, canEdit, canPublish, editMode } = useEditMode();
  const [event, setEvent] = useState(initial);

  const hidden = event.status !== "published" || !event.isPublic;
  if (hidden && !ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Sparkle className="size-8 animate-sparkle fill-hot text-hot" aria-hidden="true" />
      </div>
    );
  }
  if (hidden && !canEdit) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl font-bold">This event isn&apos;t public yet.</h1>
        <LinkButton href="/events" className="mt-6">
          Back to events
        </LinkButton>
      </div>
    );
  }

  function patch(data: Partial<SpicyEvent>) {
    const next = { ...event, ...data };
    setEvent(next);
    // Send the full merged object, not just the diff — see ProjectDetailEditor's
    // patch() for why (this event may only exist as seed data so far).
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripping id, not using it
    const { id: _id, ...payload } = next;
    return patchEvent(event.id, payload);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${event.title}"? This can't be undone.`)) return;
    await deleteEvent(event.id);
    router.push("/events");
  }

  async function handlePhotoUpload(file: File) {
    const url = await uploadImage(file, `events/${event.slug}/photos`);
    const photos = [...event.photos, url];
    patch({ photos, coverUrl: event.coverUrl ?? url });
  }

  return (
    <>
      <Section tone="dark" className="pb-10 pt-20 sm:pt-28">
        <Link href="/events" className="focus-ring text-sm font-semibold text-paper-dim hover:text-hot">
          &larr; Back to events
        </Link>

        {editMode ? (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-hot/30 bg-ink-soft p-4">
            <select
              value={event.status}
              onChange={(e) => patch({ status: e.target.value as SpicyEvent["status"] })}
              disabled={!canPublish}
              className="focus-ring rounded-full border border-line bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-paper disabled:opacity-50"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {!canPublish ? <span className="text-xs text-paper-dim">Only admins can publish</span> : null}
            <label className="flex items-center gap-2 text-xs font-semibold text-paper">
              <input
                type="checkbox"
                checked={event.isPublic}
                onChange={(e) => patch({ isPublic: e.target.checked })}
                className="size-4 accent-[var(--color-hot)]"
              />
              Public event
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-paper">
              <input
                type="checkbox"
                checked={event.hostConsent}
                onChange={(e) => patch({ hostConsent: e.target.checked })}
                className="size-4 accent-[var(--color-hot)]"
              />
              Host consent received
            </label>
            {canPublish ? (
              <button
                type="button"
                onClick={handleDelete}
                className="focus-ring ml-auto flex items-center gap-1 text-xs font-semibold text-hot-bright hover:underline"
              >
                <Trash2 className="size-3.5" /> Delete event
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-hot-bright">
          {editMode ? (
            <>
              <EditableText value={event.date} onSave={(v) => patch({ date: v })} type="text" placeholder="YYYY-MM-DD" />
              &middot;
              <select
                value={event.type}
                onChange={(e) => patch({ type: e.target.value })}
                className="focus-ring rounded border border-line bg-ink px-2 py-1 normal-case text-paper"
              >
                {eventTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <span>
              {formatDate(event.date)} &middot; {event.type}
            </span>
          )}
        </div>
        <EditableText
          value={event.title}
          onSave={(v) => patch({ title: v })}
          as="h1"
          className="mt-3 block max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl"
        />
        <EditableText
          value={event.summary}
          onSave={(v) => patch({ summary: v })}
          multiline
          as="p"
          className="mt-5 block max-w-2xl text-lg text-paper-dim"
        />
      </Section>

      <Section tone="dark" className="pt-0">
        <EditableImage
          src={event.coverUrl}
          alt={event.title}
          label={event.title}
          pathPrefix={`events/${event.slug}/cover`}
          onSave={(url) => patch({ coverUrl: url })}
          className="aspect-video w-full rounded-xl border border-line"
        />
      </Section>

      {editMode || event.description ? (
        <Section tone="raised">
          <EditableText
            value={event.description ?? ""}
            onSave={(v) => patch({ description: v })}
            multiline
            placeholder="Full recap"
            as="div"
            className="block max-w-2xl whitespace-pre-line text-paper-dim"
          />
        </Section>
      ) : null}

      <Section tone="dark">
        <SectionHeading eyebrow="Gallery" title="From the night" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(event.photos.length ? event.photos : editMode ? [] : Array(4).fill(undefined)).map(
            (src: string | undefined, i: number) => (
              <div key={i} className="relative">
                {editMode ? (
                  <button
                    type="button"
                    onClick={() => patch({ photos: event.photos.filter((_, idx) => idx !== i) })}
                    aria-label="Remove photo"
                    className="focus-ring absolute -right-2 -top-2 z-10 flex size-6 items-center justify-center rounded-full bg-hot text-ink shadow hover:bg-hot-bright"
                  >
                    ×
                  </button>
                ) : null}
                <EditableImage
                  src={src}
                  alt={`${event.title} photo ${i + 1}`}
                  seed={i + 3}
                  pathPrefix={`events/${event.slug}/photos`}
                  onSave={(url) => {
                    const photos = [...event.photos];
                    photos[i] = url;
                    patch({ photos });
                  }}
                  className="aspect-[4/5] rounded-lg"
                />
              </div>
            ),
          )}
          {editMode ? (
            <label className="focus-ring flex aspect-[4/5] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-hot/40 font-display text-xs font-bold text-hot hover:border-hot">
              + Add photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file);
                }}
              />
            </label>
          ) : null}
        </div>
      </Section>
    </>
  );
}
