"use client";

import { useState } from "react";
import { uploadVideo } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

/** Same pattern as AddPhotoTile, but for video uploads (Cloudinary's video endpoint). */
export function AddVideoTile({
  pathPrefix,
  onAdd,
  label = "+ Add video",
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
      const url = await uploadVideo(file, pathPrefix);
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
          accept="video/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {error ? <p className="mt-1 text-xs font-semibold text-red-500">⚠ {error}</p> : null}
    </div>
  );
}
