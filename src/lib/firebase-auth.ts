"use client";

import { type Auth, getAuth } from "firebase/auth";
import { getFirebaseApp } from "./firebase";

let authInstance: Auth | undefined;

export function getFirebaseAuth(): Auth | undefined {
  const app = getFirebaseApp();
  if (!app) return undefined;
  if (!authInstance) authInstance = getAuth(app);
  return authInstance;
}
