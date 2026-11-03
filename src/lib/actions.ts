"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import type { BookingFormValues, ContactFormValues } from "./validation";

export class NotConfiguredError extends Error {
  constructor() {
    super(
      "This site isn't connected to a Firebase project yet, so submissions can't be saved. Add Firebase config to .env.local — see README.md.",
    );
    this.name = "NotConfiguredError";
  }
}

/**
 * Best-effort email relay via our /api/notify route — fire-and-forget so a
 * flaky third-party relay never blocks or fails the user-facing submission,
 * which has already succeeded by the time this runs (the Firestore write,
 * and the admin Inbox entry it creates, is the thing that must not fail).
 */
function notifyByEmail(type: "message" | "booking", subject: string, fields: Record<string, unknown>) {
  fetch("/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, subject, fields }),
  }).catch((err) => console.error("Email notification failed:", err));
}

export async function submitContactMessage(values: ContactFormValues) {
  const db = getDb();
  if (!db || !isFirebaseConfigured) throw new NotConfiguredError();
  const rest = { ...values };
  delete rest.company_website;
  await addDoc(collection(db, "messages"), {
    ...rest,
    status: "new",
    createdAt: serverTimestamp(),
  });
  notifyByEmail("message", `New message from ${rest.name} — Spicy Mama website`, rest);
}

export async function submitNewsletterSignup(email: string) {
  const db = getDb();
  if (!db || !isFirebaseConfigured) throw new NotConfiguredError();
  await addDoc(collection(db, "newsletterSignups"), {
    email,
    createdAt: serverTimestamp(),
  });
}

export async function submitBookingRequest(values: BookingFormValues) {
  const db = getDb();
  if (!db || !isFirebaseConfigured) throw new NotConfiguredError();
  const rest = { ...values };
  delete rest.company_website;
  await addDoc(collection(db, "bookings"), {
    ...rest,
    status: "new",
    createdAt: serverTimestamp(),
  });
  notifyByEmail("booking", `New booking request from ${rest.name} — Spicy Mama website`, rest);
}
