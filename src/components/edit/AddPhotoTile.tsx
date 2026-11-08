"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

/**
 * The "+ Add photo" upload tile used by every image gallery (project
 * stills, event photos, venue gallery, Instagram picker). Previously each
 * one re-implemented this as a bare <input type="file"> whose onChange
 * handler wasn't awaited or wrapped in try/catch — a failed upload or a
 * failed Firestore write (e.g. a permission error) silently vanished.
 * Locally it still *looked* like it worked, because the optimistic state
 * update elsewhere happens regardless, but nothing ever reached Firestore,
 * so the photo was gone on reload or for anyone else looking at the page.
 */
export function AddPhotoTile({
  pathPrefix,
  onAdd,
  label = "+ Add photo",
  className,
}: {
  pathPrefix: string;
  onAdd: (url: string) => Promise<unknown> | void;
  label?: string;
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, pathPrefix);
      await onAdd(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add — try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={className}>
      <label
        className={cn(
          "focus-ring flex h-full w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed font-display text-xs font-bold transition-colors",
          uploading ? "border-line text-paper-dim" : "border-hot/40 text-hot hover:border-hot",
        )}
      >
        {uploading ? "Uploading…" : label}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {error ? <p className="mt-1 text-xs font-semibold text-red-500">⚠ {error}</p> : null}
    </div>
  );
}
