"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function TrailerEmbed({ trailerUrl, posterUrl, title }: { trailerUrl?: string; posterUrl?: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = trailerUrl ? toEmbedUrl(trailerUrl) : null;

  if (playing && embedUrl) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-line bg-ink-soft">
        <iframe
          src={embedUrl}
          title={`${title} trailer`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // No trailer to play: show the poster at its own aspect ratio (object-contain,
  // never cropped) instead of forcing it into a 16:9 video frame.
  if (!embedUrl) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl border border-line bg-ink-soft">
          <PlaceholderMedia src={posterUrl} alt={`${title} poster`} className="h-full w-full" fit="contain" />
        </div>
        <span className="mt-4 rounded-full bg-ink-soft px-3 py-1 text-xs font-semibold text-paper-dim">
          Trailer coming soon
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="focus-ring group relative block aspect-video w-full overflow-hidden rounded-xl border border-line"
      aria-label={`Watch ${title} trailer`}
    >
      <PlaceholderMedia src={posterUrl} alt={`${title} poster`} className="h-full w-full" />
      <span className="absolute inset-0 flex items-center justify-center bg-ink/30 transition-colors group-hover:bg-ink/50">
        <span className="flex size-16 items-center justify-center rounded-full bg-hot text-ink">
          <Play className="size-7 translate-x-0.5 fill-ink" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
