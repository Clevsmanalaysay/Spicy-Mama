"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadImage } from "@/lib/admin-data";

export function ImageUploadField({
  value,
  onChange,
  pathPrefix,
  label = "Image",
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  pathPrefix: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, pathPrefix);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          <Image src={value} alt={label} width={160} height={160} className="rounded-lg border border-line-light object-cover" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="focus-ring absolute -right-2 -top-2 rounded-full bg-ink p-1 text-paper"
            aria-label={`Remove ${label}`}
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line-light text-ink/50 hover:border-hot-deep hover:text-hot-deep disabled:opacity-50"
        >
          <Upload className="size-5" aria-hidden="true" />
          <span className="text-xs">{uploading ? "Uploading…" : "Upload"}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {error ? <p className="mt-1 text-xs font-semibold text-hot-deep">{error}</p> : null}
    </div>
  );
}
