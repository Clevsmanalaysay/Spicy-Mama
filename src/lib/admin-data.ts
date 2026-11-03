"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getDb, getStorageInstance } from "./firebase";
import type {
  BookingRequest,
  BookingStatus,
  Collaborator,
  ContactMessage,
  MessageStatus,
  Project,
  SiteSettings,
  SpicyEvent,
  StaffRole,
  StaffUser,
  TeamMember,
  VenueContent,
} from "./types";

function requireDb() {
  const db = getDb();
  if (!db) throw new Error("Firebase isn't configured — add credentials to .env.local.");
  return db;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------- Projects ----------

export async function listProjectsAdmin(): Promise<Project[]> {
  const db = requireDb();
  const snap = await getDocs(query(collection(db, "projects"), orderBy("order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Project);
}

export async function getProjectAdmin(id: string): Promise<Project | null> {
  const db = requireDb();
  const snap = await getDoc(doc(db, "projects", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Project) : null;
}

export async function saveProject(id: string | null, data: Omit<Project, "id">): Promise<string> {
  const db = requireDb();
  const payload = { ...data, slug: data.slug || slugify(data.title) };
  if (id) {
    await updateDoc(doc(db, "projects", id), payload);
    return id;
  }
  const docRef = await addDoc(collection(db, "projects"), payload);
  return docRef.id;
}

export async function deleteProject(id: string) {
  const db = requireDb();
  await deleteDoc(doc(db, "projects", id));
}

// ---------- Events ----------

export async function listEventsAdmin(): Promise<SpicyEvent[]> {
  const db = requireDb();
  const snap = await getDocs(query(collection(db, "events"), orderBy("date", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SpicyEvent);
}

export async function getEventAdmin(id: string): Promise<SpicyEvent | null> {
  const db = requireDb();
  const snap = await getDoc(doc(db, "events", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as SpicyEvent) : null;
}

export async function saveEvent(id: string | null, data: Omit<SpicyEvent, "id">): Promise<string> {
  const db = requireDb();
  const payload = { ...data, slug: data.slug || slugify(data.title) };
  if (id) {
    await updateDoc(doc(db, "events", id), payload);
    return id;
  }
  const docRef = await addDoc(collection(db, "events"), payload);
  return docRef.id;
}

export async function deleteEvent(id: string) {
  const db = requireDb();
  await deleteDoc(doc(db, "events", id));
}

// ---------- Messages & Bookings (Inbox) ----------

export async function listMessagesAdmin(): Promise<(ContactMessage & { id: string })[]> {
  const db = requireDb();
  const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactMessage & { id: string });
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  const db = requireDb();
  await updateDoc(doc(db, "messages", id), { status });
}

export async function listBookingsAdmin(): Promise<(BookingRequest & { id: string })[]> {
  const db = requireDb();
  const snap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BookingRequest & { id: string });
}

/**
 * Updates a booking's status and keeps the public-safe `venue.heldDates`
 * list in sync — held/confirmed dates show as unavailable on the public
 * calendar, without exposing the booker's name or contact details (see
 * lib/types.ts VenueContent.heldDates).
 */
export async function updateBookingStatus(id: string, status: BookingStatus, date: string) {
  const db = requireDb();
  await updateDoc(doc(db, "bookings", id), { status });

  const venueRef = doc(db, "venue", "content");
  const venueSnap = await getDoc(venueRef);
  const current = (venueSnap.data()?.heldDates as string[]) ?? [];
  const shouldHold = status === "held" || status === "confirmed";
  const next = shouldHold ? Array.from(new Set([...current, date])) : current.filter((d) => d !== date);
  await setDoc(venueRef, { heldDates: next }, { merge: true });
}

// ---------- Site settings & Venue ----------

export async function updateSiteSettings(data: Partial<SiteSettings>) {
  const db = requireDb();
  await setDoc(doc(db, "siteSettings", "global"), data, { merge: true });
}

export async function updateVenueContent(data: Partial<VenueContent>) {
  const db = requireDb();
  await setDoc(doc(db, "venue", "content"), data, { merge: true });
}

// ---------- Team & Collaborators (About / Home) ----------

export async function listTeamAdmin(): Promise<TeamMember[]> {
  const db = requireDb();
  const snap = await getDocs(query(collection(db, "team"), orderBy("order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TeamMember);
}

export async function saveTeamMember(id: string | null, data: Omit<TeamMember, "id">) {
  const db = requireDb();
  if (id) return void (await updateDoc(doc(db, "team", id), data));
  await addDoc(collection(db, "team"), data);
}

export async function deleteTeamMember(id: string) {
  const db = requireDb();
  await deleteDoc(doc(db, "team", id));
}

export async function listCollaboratorsAdmin(): Promise<Collaborator[]> {
  const db = requireDb();
  const snap = await getDocs(query(collection(db, "collaborators"), orderBy("order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Collaborator);
}

export async function saveCollaborator(id: string | null, data: Omit<Collaborator, "id">) {
  const db = requireDb();
  if (id) return void (await updateDoc(doc(db, "collaborators", id), data));
  await addDoc(collection(db, "collaborators"), data);
}

export async function deleteCollaborator(id: string) {
  const db = requireDb();
  await deleteDoc(doc(db, "collaborators", id));
}

// ---------- Users ----------

export async function listUsersAdmin(): Promise<StaffUser[]> {
  const db = requireDb();
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as StaffUser);
}

/**
 * Creates/updates the Firestore role profile for a staff member. This does
 * NOT create the Firebase Auth account itself — Auth user creation needs
 * the Admin SDK (a Cloud Function), which is out of scope for the client
 * app. Create the Auth user in the Firebase console first, then use this to
 * grant them a role by uid.
 */
export async function upsertStaffProfile(uid: string, data: { name: string; email: string; role: StaffRole }) {
  const db = requireDb();
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

export async function removeStaffProfile(uid: string) {
  const db = requireDb();
  await deleteDoc(doc(db, "users", uid));
}

// ---------- Storage uploads ----------

export async function uploadImage(file: File, pathPrefix: string): Promise<string> {
  const storage = getStorageInstance();
  if (!storage) throw new Error("Firebase isn't configured — add credentials to .env.local.");
  const path = `${pathPrefix}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export const nowTimestamp = serverTimestamp;
