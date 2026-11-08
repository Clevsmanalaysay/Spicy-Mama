"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useEditMode } from "@/lib/edit-mode";
import { uploadImage } from "@/lib/admin-data";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Lightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

export function EditableImage({
  src,
  alt,
  pathPrefix,
  onSave,
  className,
  fit = "cover",
  seed,
  label,
  expandable = true,
  fill = true,
}: {
  src?: string;
  alt: string;
  pathPrefix: string;
  onSave: (url: string) => Promise<unknown> | void;
  className?: string;
  fit?: "cover" | "contain";
  seed?: number;
  label?: string;
  /** Click-to-expand in a lightbox when not in edit mode. On by default — set false for images where that doesn't make sense (e.g. a tiny icon-like image). */
  expandable?: boolean;
  /** False shows the upload at its own natural size/aspect ratio (no forced box, no letterbox bars) instead of filling a fixed-aspect-ratio container. */
  fill?: boolean;
}) {
  const { canEdit, editMode } = useEditMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, pathPrefix);
      await onSave(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save — try again.");
    } finally {
      setUploading(false);
    }
  }

  if (!canEdit || !editMode) {
    if (expandable && src) {
      return (
        <>
          {/* appearance-none: a <button> keeps native widget rendering by default,
              which in some browsers overrides the CSS aspect-ratio sizing that
              PlaceholderMedia's box depends on — the image silently renders at
              zero height. A plain, unsized wrapper here avoids that entirely. */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="focus-ring block w-full appearance-none"
            aria-label={`Expand ${alt}`}
          >
            <PlaceholderMedia src={src} alt={alt} className={className} fill={fill} fit={fit} seed={seed} label={label} />
          </button>
          {lightboxOpen ? <Lightbox src={src} alt={alt} onClose={() => setLightboxOpen(false)} /> : null}
        </>
      );
    }
    return <PlaceholderMedia src={src} alt={alt} className={className} fill={fill} fit={fit} seed={seed} label={label} />;
  }

  return (
    <>
      <div className={cn("group relative", fill ? className : className?.replace(/\baspect-\S+\b/g, ""))}>
        <PlaceholderMedia src={src} alt={alt} className={fill ? "h-full w-full" : undefined} fill={fill} fit={fit} seed={seed} label={label} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all group-hover:bg-ink/60 group-hover:opacity-100 disabled:bg-ink/60 disabled:opacity-100"
        >
          <span className="flex items-center gap-2 rounded-full bg-hot px-4 py-2 font-display text-xs font-bold text-ink">
            <Upload className="size-4" aria-hidden="true" />
            {uploading ? "Uploading…" : "Change image"}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {error ? <p className="mt-1 text-xs font-semibold text-red-500">⚠ {error}</p> : null}
    </>
  );
}
