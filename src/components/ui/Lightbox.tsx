"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        onClick={onClose}
        className="focus-ring absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-ink-soft text-paper hover:text-hot-bright"
        aria-label="Close"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
      <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1600}
          className="max-h-[85vh] w-auto rounded-lg object-contain"
          sizes="90vw"
        />
      </div>
    </div>
  );
}
