"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseAuth } from "./firebase-auth";
import { getDb, isFirebaseConfigured } from "./firebase";
import type { StaffRole } from "./types";

interface AuthState {
  loading: boolean;
  user: User | null;
  role: StaffRole | null;
  name: string | null;
  /** True once we've confirmed the signed-in user has a staff role document. */
  isStaff: boolean;
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
        setState({ loading: false, user: null, role: null, name: null, isStaff: false, configured: true });
        return;
      }
      const db = getDb();
      if (!db) {
        setState({ loading: false, user, role: null, name: null, isStaff: false, configured: true });
        return;
      }
      unsubProfile = onSnapshot(
        doc(db, "users", user.uid),
        (snap) => {
          const data = snap.data();
          setState({
            loading: false,
            user,
            role: (data?.role as StaffRole) ?? null,
            name: (data?.name as string) ?? user.email,
            isStaff: snap.exists() && Boolean(data?.role),
            configured: true,
          });
        },
        () => {
          setState({ loading: false, user, role: null, name: user.email, isStaff: false, configured: true });
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
