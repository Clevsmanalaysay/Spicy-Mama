"use client";

import { useEffect } from "react";

/**
 * Catches a crash in the root layout itself (Header/Footer/fonts) — the
 * one place (site)/error.tsx can't reach, since Next only lets an error
 * boundary catch errors in the segment below it, not its own layout. Must
 * render its own <html>/<body> since it replaces the root layout entirely.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Root layout render error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#141414] px-6 text-center text-[#F5EFE6]">
        <h1 className="text-2xl font-bold">Something went wrong.</h1>
        <p className="max-w-md text-[#F5EFE6]/70">
          This is on us, not something you did — try reloading the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-[#E8436A] px-5 py-2.5 text-sm font-bold text-[#141414]"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
