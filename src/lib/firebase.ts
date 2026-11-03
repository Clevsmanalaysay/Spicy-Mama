import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Firestore, getFirestore } from "firebase/firestore";
import { type FirebaseStorage, getStorage } from "firebase/storage";

// Firestore + Storage are safe to touch from Server Components (they're used
// to pre-render public content for SEO, per the content strategy). Firebase
// Auth is browser-only and lives in lib/firebase-auth.ts instead.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True once every required Firebase env var is present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;

/**
 * Lazily creates the Firebase app. Returns undefined when the project hasn't
 * been configured yet (no .env.local) so the site still renders with seed
 * content and forms fail gracefully instead of crashing the app.
 */
export function getFirebaseApp(): FirebaseApp | undefined {
  if (!isFirebaseConfigured) return undefined;
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export function getDb(): Firestore | undefined {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;
  if (!dbInstance) dbInstance = getFirestore(firebaseApp);
  return dbInstance;
}

export function getStorageInstance(): FirebaseStorage | undefined {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;
  if (!storageInstance) storageInstance = getStorage(firebaseApp);
  return storageInstance;
}
