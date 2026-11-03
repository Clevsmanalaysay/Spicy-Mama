"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useEditMode } from "@/lib/edit-mode";
import { uploadImage } from "@/lib/admin-data";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
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
}: {
  src?: string;
  alt: string;
  pathPrefix: string;
  onSave: (url: string) => Promise<unknown> | void;
  className?: string;
  fit?: "cover" | "contain";
  seed?: number;
  label?: string;
}) {
  const { canEdit, editMode } = useEditMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
    return <PlaceholderMedia src={src} alt={alt} className={className} fit={fit} seed={seed} label={label} />;
  }

  return (
    <>
      <div className={cn("group relative", className)}>
        <PlaceholderMedia src={src} alt={alt} className="h-full w-full" fit={fit} seed={seed} label={label} />
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
