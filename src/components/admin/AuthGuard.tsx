"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkle } from "lucide-react";
import { useAuth } from "@/lib/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, user, isStaff, configured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && configured && (!user || !isStaff)) {
      router.replace("/admin/login");
    }
  }, [loading, user, isStaff, configured, router]);

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

  if (loading || !user || !isStaff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Sparkle className="size-8 animate-sparkle fill-hot text-hot" aria-hidden="true" />
      </div>
    );
  }

  return <>{children}</>;
}
