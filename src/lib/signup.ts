"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseAuth } from "./firebase-auth";
import { getDb, isFirebaseConfigured } from "./firebase";
import { NotConfiguredError } from "./actions";

/**
 * Self-service staff access request. Creates the Firebase Auth account and a
 * `users/{uid}` doc with role "pending" — a pending doc grants no dashboard
 * access (see useAuth/AuthGuard and firestore.rules) until an admin approves
 * it from Admin → Users.
 */
export async function requestStaffAccess({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const auth = getFirebaseAuth();
  const db = getDb();
  if (!auth || !db || !isFirebaseConfigured) throw new NotConfiguredError();

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", credential.user.uid), {
    name,
    email,
    role: "pending",
    requestedAt: serverTimestamp(),
  });
}
