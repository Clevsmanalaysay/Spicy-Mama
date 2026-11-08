import Image from "next/image";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders a real image when `src` is set (e.g. once uploaded via Admin to
 * Firebase Storage). Otherwise shows a branded placeholder so every page
 * works before real assets are collected (see README "Content checklist").
 */
export function PlaceholderMedia({
  src,
  alt,
  label,
  className,
  seed = 0,
  fill = true,
  fit = "cover",
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  seed?: number;
  fill?: boolean;
  /** "contain" never crops — use for real posters/key art shown at their own aspect ratio. */
  fit?: "cover" | "contain";
}) {
  if (src) {
    // next/image's `fill` mode requires a parent with an already-fixed
    // aspect ratio (hence `fit="contain"` still letterboxes inside it).
    // `fill={false}` instead renders a plain <img> at its own natural size
    // — no forced box, no bars — for the few spots (e.g. an event's header
    // photo) that should show the upload exactly as-is.
    if (!fill) {
      // next/image requires width+height without fill, which we don't know for an arbitrary upload.
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} className={cn("h-auto w-full", className)} />;
    }
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className={fit === "contain" ? "object-contain" : "object-cover"}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
    );
  }

  const angle = 135 + ((seed * 37) % 90);
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 overflow-hidden text-center",
        className,
      )}
      style={{
        background: `linear-gradient(${angle}deg, var(--color-ink-raised), var(--color-ink) 55%, var(--color-hot-deep) 140%)`,
      }}
      role="img"
      aria-label={alt}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-hot) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <Sparkle className="relative size-8 fill-hot text-hot animate-sparkle" aria-hidden="true" />
      {label ? (
        <span className="relative max-w-[80%] font-display text-xs font-bold uppercase tracking-wide text-paper-dim">
          {label}
        </span>
      ) : null}
    </div>
  );
}
