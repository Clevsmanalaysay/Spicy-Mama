"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseAuth } from "./firebase-auth";
import { getDb, isFirebaseConfigured } from "./firebase";
import type { StaffRoleOrPending } from "./types";

interface AuthState {
  loading: boolean;
  user: User | null;
  role: StaffRoleOrPending | null;
  name: string | null;
  /** True only once the role doc exists AND is "admin" or "editor" — a "pending" request is not staff. */
  isStaff: boolean;
  /** True when the user has a users/{uid} doc but it's still awaiting admin approval. */
  isPending: boolean;
  configured: boolean;
}

/**
 * Subscribes to Firebase Auth + the matching `users/{uid}` staff profile.
 * A signed-in Firebase user is only "staff" once their role doc exists —
 * this mirrors the Firestore rule that reads users/{uid}.role, so the UI
 * and the security rules agree on who counts as staff.
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: isFirebaseConfigured,
    user: null,
    role: null,
    name: null,
    isStaff: false,
    isPending: false,
    configured: isFirebaseConfigured,
  });

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const auth = getFirebaseAuth();
    if (!auth) return;

    let unsubProfile: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      unsubProfile?.();
      if (!user) {
        setState({ loading: false, user: null, role: null, name: null, isStaff: false, isPending: false, configured: true });
        return;
      }
      const db = getDb();
      if (!db) {
        setState({ loading: false, user, role: null, name: null, isStaff: false, isPending: false, configured: true });
        return;
      }
      unsubProfile = onSnapshot(
        doc(db, "users", user.uid),
        (snap) => {
          const data = snap.data();
          const role = (data?.role as StaffRoleOrPending) ?? null;
          setState({
            loading: false,
            user,
            role,
            name: (data?.name as string) ?? user.email,
            isStaff: role === "admin" || role === "editor",
            isPending: role === "pending",
            configured: true,
          });
        },
        () => {
          setState({ loading: false, user, role: null, name: user.email, isStaff: false, isPending: false, configured: true });
        },
      );
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
    };
  }, []);

  return state;
}
