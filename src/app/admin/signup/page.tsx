"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { requestStaffAccess } from "@/lib/signup";
import { NotConfiguredError } from "@/lib/actions";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function AdminSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      await requestStaffAccess({ name, email, password });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      if (err instanceof NotConfiguredError) {
        setError(err.message);
      } else if (err && typeof err === "object" && "code" in err && err.code === "auth/email-already-in-use") {
        setError("That email already has an account — try signing in instead.");
      } else if (err && typeof err === "object" && "code" in err && err.code === "auth/weak-password") {
        setError("Choose a stronger password (at least 6 characters).");
      } else {
        setError("Couldn't create your account — try again.");
      }
    }
  }

  if (status === "done") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-16 text-paper">
        <Logo className="mb-10" />
        <div className="w-full max-w-sm rounded-xl border border-line bg-ink-soft p-8 text-center">
          <CheckCircle2 className="mx-auto size-10 text-hot" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold">Request sent</h1>
          <p className="mt-2 text-sm text-paper-dim">
            Your account is created and waiting on an admin to approve access. You&apos;ll be able to sign in once
            that happens.
          </p>
          <Link href="/admin/login" className="focus-ring mt-6 inline-block font-display text-sm font-bold text-hot-bright hover:underline">
            Back to sign-in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-16 text-paper">
      <Logo className="mb-10" />
      <div className="w-full max-w-sm rounded-xl border border-line bg-ink-soft p-8">
        <h1 className="font-display text-2xl font-bold">Request access</h1>
        <p className="mt-1 text-sm text-paper-dim">An admin reviews every request before it&apos;s active.</p>

        {!isFirebaseConfigured ? (
          <p className="mt-6 rounded-lg bg-ink p-4 text-sm text-paper-dim">
            Firebase isn&apos;t configured yet. Add credentials to <code className="text-hot-bright">.env.local</code>{" "}
            — see README.md.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="font-display text-xs font-bold uppercase tracking-wide text-paper">
                Name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-line bg-ink px-4 py-3 text-sm text-paper"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-display text-xs font-bold uppercase tracking-wide text-paper">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-line bg-ink px-4 py-3 text-sm text-paper"
              />
            </div>
            <div>
              <label htmlFor="password" className="font-display text-xs font-bold uppercase tracking-wide text-paper">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-line bg-ink px-4 py-3 text-sm text-paper"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="font-display text-xs font-bold uppercase tracking-wide text-paper">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="focus-ring mt-2 w-full rounded-lg border border-line bg-ink px-4 py-3 text-sm text-paper"
              />
            </div>
            {error ? <p className="text-sm font-semibold text-hot-bright">{error}</p> : null}
            <Button type="submit" disabled={status === "loading"} className="w-full">
              {status === "loading" ? "Submitting…" : "Request access"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-paper-dim">
          Already approved?{" "}
          <Link href="/admin/login" className="font-semibold text-hot-bright hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
