"use client";

import { useState } from "react";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Lightbox } from "@/components/ui/Lightbox";
import { Pagination } from "@/components/ui/Pagination";
import { AddPhotoTile } from "@/components/edit/AddPhotoTile";
import { AddVideoTile } from "@/components/edit/AddVideoTile";
import { toEmbedUrl } from "@/lib/video-embed";
import type { HeaderMediaItem, SpicyEvent } from "@/lib/types";

/**
 * The event detail page's hero media — one or more photos and/or videos,
 * shown one at a time at full header size (never the small "From the
 * night" gallery size), with Previous/Next paging when there's more than
 * one. A video can be an uploaded file or a pasted YouTube/Vimeo link.
 */
export function EventHeaderMedia({
  event,
  editMode,
  onChange,
}: {
  event: SpicyEvent;
  editMode: boolean;
  onChange: (headerMedia: HeaderMediaItem[]) => Promise<unknown> | void;
}) {
  const items: HeaderMediaItem[] = event.headerMedia?.length
    ? event.headerMedia
    : event.coverUrl
      ? [{ type: "image", url: event.coverUrl }]
      : [];

  const [index, setIndex] = useState(0);
  const [linkValue, setLinkValue] = useState("");
  const [linkError, setLinkError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const current = items[Math.min(index, items.length - 1)];

  function commit(next: HeaderMediaItem[], nextIndex: number) {
    setIndex(Math.max(0, Math.min(nextIndex, next.length - 1)));
    return onChange(next);
  }

  function handleAddLink() {
    const url = linkValue.trim();
    if (!url) return;
    if (!toEmbedUrl(url)) {
      setLinkError("That doesn't look like a YouTube or Vimeo link.");
      return;
    }
    setLinkError("");
    setLinkValue("");
    commit([...items, { type: "video", url }], items.length);
  }

  if (!items.length) {
    return (
      <div>
        <PlaceholderMedia alt={event.title} label={event.title} className="aspect-video w-full rounded-xl border border-line bg-ink-soft" />
        {editMode ? (
          <HeaderMediaControls
            slug={event.slug}
            linkValue={linkValue}
            linkError={linkError}
            onLinkChange={setLinkValue}
            onAddLink={handleAddLink}
            onAddPhoto={(url) => commit([...items, { type: "image", url }], items.length)}
            onAddVideo={(url) => commit([...items, { type: "video", url }], items.length)}
          />
        ) : null}
      </div>
    );
  }

  const embedUrl = current.type === "video" ? toEmbedUrl(current.url) : null;

  return (
    <div>
      <div className="relative">
        {editMode ? (
          <button
            type="button"
            onClick={() => commit(items.filter((_, i) => i !== index), index - 1)}
            aria-label="Remove this header media"
            className="focus-ring absolute -right-2 -top-2 z-10 flex size-7 items-center justify-center rounded-full bg-hot text-ink shadow hover:bg-hot-bright"
          >
            ×
          </button>
        ) : null}

        {current.type === "image" ? (
          editMode ? (
            <PlaceholderMedia
              src={current.url}
              alt={event.title}
              fill={false}
              className="w-full overflow-hidden rounded-xl border border-line"
            />
          ) : (
            <>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="focus-ring block w-full overflow-hidden rounded-xl border border-line"
                aria-label={`Expand ${event.title} photo`}
              >
                <PlaceholderMedia src={current.url} alt={event.title} fill={false} className="w-full" />
              </button>
              {lightboxOpen ? <Lightbox src={current.url} alt={event.title} onClose={() => setLightboxOpen(false)} /> : null}
            </>
          )
        ) : embedUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-line bg-ink-soft">
            <iframe
              src={embedUrl}
              title={event.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video src={current.url} controls playsInline className="h-auto w-full rounded-xl border border-line" />
        )}
      </div>

      {items.length > 1 ? (
        <Pagination currentPage={index + 1} totalPages={items.length} onChange={(p) => setIndex(p - 1)} />
      ) : null}

      {editMode ? (
        <HeaderMediaControls
          slug={event.slug}
          linkValue={linkValue}
          linkError={linkError}
          onLinkChange={setLinkValue}
          onAddLink={handleAddLink}
          onAddPhoto={(url) => commit([...items, { type: "image", url }], items.length)}
          onAddVideo={(url) => commit([...items, { type: "video", url }], items.length)}
        />
      ) : null}
    </div>
  );
}

function HeaderMediaControls({
  slug,
  linkValue,
  linkError,
  onLinkChange,
  onAddLink,
  onAddPhoto,
  onAddVideo,
}: {
  slug: string;
  linkValue: string;
  linkError: string;
  onLinkChange: (v: string) => void;
  onAddLink: () => void;
  onAddPhoto: (url: string) => void;
  onAddVideo: (url: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-start gap-3">
      <AddPhotoTile pathPrefix={`events/${slug}/header`} onAdd={onAddPhoto} label="+ Add photo" className="h-12 w-40" />
      <AddVideoTile pathPrefix={`events/${slug}/header`} onAdd={onAddVideo} label="+ Add video" className="h-12 w-40" />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <input
          type="url"
          value={linkValue}
          onChange={(e) => onLinkChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddLink();
            }
          }}
          placeholder="Or paste a YouTube/Vimeo link"
          className="focus-ring h-12 min-w-0 flex-1 rounded-lg border border-line bg-ink px-3 text-sm text-paper placeholder:text-paper-dim"
        />
        <button
          type="button"
          onClick={onAddLink}
          className="focus-ring h-12 shrink-0 rounded-lg border border-hot/40 px-4 font-display text-xs font-bold text-hot hover:border-hot"
        >
          Add link
        </button>
      </div>
      {linkError ? <p className="w-full text-xs font-semibold text-red-500">⚠ {linkError}</p> : null}
    </div>
  );
}
