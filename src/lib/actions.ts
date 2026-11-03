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
}
