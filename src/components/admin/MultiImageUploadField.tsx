"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Star } from "lucide-react";
import { uploadImage } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export function MultiImageUploadField({
  value,
  onChange,
  pathPrefix,
  cover,
  onCoverChange,
  max = 50,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  pathPrefix: string;
  cover?: string;
  onCoverChange?: (url: string) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const remaining = max - value.length;
      const toUpload = Array.from(files).slice(0, Math.max(remaining, 0));
      const urls = await Promise.all(toUpload.map((f) => uploadImage(f, pathPrefix)));
      const next = [...value, ...urls];
      onChange(next);
      if (onCoverChange && !cover && next[0]) onCoverChange(next[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="relative">
            <Image
              src={url}
              alt=""
              width={96}
              height={96}
              className={cn(
                "size-24 rounded-lg border object-cover",
                cover === url ? "border-2 border-hot-deep" : "border-line-light",
              )}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="focus-ring absolute -right-2 -top-2 rounded-full bg-ink p-1 text-paper"
              aria-label="Remove photo"
            >
              <X className="size-3" />
            </button>
            {onCoverChange ? (
              <button
                type="button"
                onClick={() => onCoverChange(url)}
                className={cn(
                  "focus-ring absolute -left-2 -top-2 rounded-full p-1",
                  cover === url ? "bg-hot-deep text-paper" : "bg-ink/60 text-paper",
                )}
                aria-label="Set as cover photo"
                title="Set as cover"
              >
                <Star className="size-3" fill={cover === url ? "currentColor" : "none"} />
              </button>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || value.length >= max}
          className="focus-ring flex size-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line-light text-ink/50 hover:border-hot-deep hover:text-hot-deep disabled:opacity-50"
        >
          <Upload className="size-5" aria-hidden="true" />
          <span className="text-xs">{uploading ? "Uploading…" : "Add"}</span>
        </button>
      </div>
      <p className="mt-2 text-xs text-ink/50">
        {value.length} / {max} photos{onCoverChange ? " — click the star to set the cover" : ""}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error ? <p className="mt-1 text-xs font-semibold text-hot-deep">{error}</p> : null}
    </div>
  );
}
