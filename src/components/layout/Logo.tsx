import Link from "next/link";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stand-in wordmark. The brief keeps the real script logo as an image-only
 * asset ("Logo source files (SVG/PNG)" is still on the launch checklist) —
 * swap this for an <Image src="/logo.svg" /> once that file is supplied.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("focus-ring group flex items-center gap-1.5 shrink-0", className)}>
      <Sparkle className="size-5 fill-hot text-hot transition-transform group-hover:rotate-12" aria-hidden="true" />
      <span className="font-display text-xl font-bold tracking-tight text-paper">
        Spicy <span className="text-hot">Mama</span>
      </span>
    </Link>
  );
}
