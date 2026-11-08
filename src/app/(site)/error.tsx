"use client";

import { useEffect } from "react";
import { LinkButton } from "@/components/ui/Button";

/**
 * Catches any unexpected render error on a public page (e.g. a future bug
 * in a Firestore-backed component) so visitors see a plain, on-brand
 * message instead of the browser/platform's raw crash screen. Does not
 * catch errors in the layout itself (Header/Footer) — see the sibling
 * global-error.tsx for that.
 */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Public page render error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-ink px-6 text-center text-paper">
      <h1 className="font-display text-2xl font-bold">Something went wrong loading this page.</h1>
      <p className="max-w-md text-paper-dim">
        This is on us, not something you did — try reloading. If it keeps happening, let us know what
        page you were on.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="focus-ring rounded-full bg-hot px-5 py-2.5 font-display text-sm font-bold text-ink hover:bg-hot-bright"
        >
          Try again
        </button>
        <LinkButton href="/" variant="secondary">
          Back to home
        </LinkButton>
      </div>
    </div>
  );
}
