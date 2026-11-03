"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { getFirebaseAuth } from "@/lib/firebase-auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/lib/use-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isStaff, isPending, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user && (isStaff || isPending)) router.replace("/admin");
  }, [loading, user, isStaff, isPending, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const auth = getFirebaseAuth();
    if (!auth) return;
    setStatus("loading");
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin");
    } catch {
      setStatus("error");
      setError("Couldn't sign in — check your email and password.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-16 text-paper">
      <Logo className="mb-10" />
      <div className="w-full max-w-sm rounded-xl border border-line bg-ink-soft p-8">
        <h1 className="font-display text-2xl font-bold">Staff sign-in</h1>
        <p className="mt-1 text-sm text-paper-dim">Admins and editors only.</p>

        {!isFirebaseConfigured ? (
          <p className="mt-6 rounded-lg bg-ink p-4 text-sm text-paper-dim">
            Firebase isn&apos;t configured yet. Add credentials to <code className="text-hot-bright">.env.local</code>{" "}
            — see README.md.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            {error ? <p className="text-sm font-semibold text-hot-bright">{error}</p> : null}
            <Button type="submit" disabled={status === "loading"} className="w-full">
              {status === "loading" ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-paper-dim">
          Need access?{" "}
          <Link href="/admin/signup" className="font-semibold text-hot-bright hover:underline">
            Request an account
          </Link>
        </p>
      </div>
    </div>
  );
}
