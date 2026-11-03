"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Sparkle, Clock } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { getFirebaseAuth } from "@/lib/firebase-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, user, isStaff, isPending, configured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && configured && (!user || (!isStaff && !isPending))) {
      router.replace("/admin/login");
    }
  }, [loading, user, isStaff, isPending, configured, router]);

  async function handleSignOut() {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
  }

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-2xl font-bold text-paper">Firebase isn&apos;t configured yet</h1>
          <p className="mt-3 text-sm text-paper-dim">
            Add your Firebase project credentials to <code className="text-hot-bright">.env.local</code> to enable
            staff sign-in. See README.md for setup steps.
          </p>
        </div>
      </div>
    );
  }

  if (loading || !user || (!isStaff && !isPending)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Sparkle className="size-8 animate-sparkle fill-hot text-hot" aria-hidden="true" />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-center">
        <div className="max-w-sm rounded-xl border border-line bg-ink-soft p-8">
          <Clock className="mx-auto size-8 text-hot" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold text-paper">Waiting on approval</h1>
          <p className="mt-2 text-sm text-paper-dim">
            Your account was created, but an admin still needs to approve it before you can get in. Check back
            later, or ping whoever manages the dashboard.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="focus-ring mt-6 rounded-full border border-line px-4 py-2 text-xs font-bold uppercase tracking-wide text-paper hover:border-hot hover:text-hot-bright"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
