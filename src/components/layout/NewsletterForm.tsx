"use client";

import { useId, useState } from "react";
import { submitNewsletterSignup } from "@/lib/actions";

export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      await submitNewsletterSignup(email);
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <div>
      <p className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Stay in the loop</p>
      <p className="mt-4 text-sm text-paper-dim">New drops, screenings and open dates — occasionally, not spammy.</p>
      {state === "done" ? (
        <p className="mt-3 text-sm font-semibold text-hot-bright">You&apos;re on the list. Thanks!</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <label htmlFor={id} className="sr-only">
            Email address
          </label>
          <input
            id={id}
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring w-full min-w-0 rounded-full border border-line bg-ink-soft px-4 py-2 text-sm text-paper placeholder:text-paper-dim/70"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="focus-ring shrink-0 rounded-full bg-hot px-4 py-2 font-display text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-hot-bright disabled:opacity-50"
          >
            Join
          </button>
        </form>
      )}
      {state === "error" ? (
        <p className="mt-2 text-xs text-hot-bright">Couldn&apos;t sign you up right now — try again shortly.</p>
      ) : null}
    </div>
  );
}
