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
  FaqItem,
  MessageStatus,
  PressMention,
  Project,
  Service,
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

/**
 * A small ordered-collection CRUD factory, used for the simple list content
 * types (team, collaborators, services, FAQ, press) so each one doesn't need
 * its own hand-written list/save/delete trio.
 */
function orderedCollectionCrud<T extends { id: string }>(collectionName: string) {
  return {
    list: async (): Promise<T[]> => {
      const db = requireDb();
      const snap = await getDocs(query(collection(db, collectionName), orderBy("order", "asc")));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    },
    save: async (id: string | null, data: Omit<T, "id">): Promise<string> => {
      const db = requireDb();
      if (id) {
        // setDoc+merge (not updateDoc) because this id may only exist as seed
        // data so far — the first edit to it needs to create the Firestore
        // doc, not fail against a document that was never written.
        await setDoc(doc(db, collectionName, id), data, { merge: true });
        return id;
      }
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    },
    remove: async (id: string) => {
      const db = requireDb();
      await deleteDoc(doc(db, collectionName, id));
    },
  };
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
    await setDoc(doc(db, "projects", id), payload, { merge: true });
    return id;
  }
  const docRef = await addDoc(collection(db, "projects"), payload);
  return docRef.id;
}

export async function deleteProject(id: string) {
  const db = requireDb();
  await deleteDoc(doc(db, "projects", id));
}

/**
 * Patch for inline editing, vs. saveProject's full-object save. Uses
 * setDoc+merge rather than updateDoc: many projects only exist as seed data
 * until their first edit, so there may be no Firestore document yet to
 * update — the caller is expected to pass the full current object (not just
 * the changed fields) so a first-time write doesn't leave a partial doc that
 * later queries (which filter on fields like `status`/`slug`) can't find.
 */
export async function patchProject(id: string, data: Partial<Omit<Project, "id">>) {
  const db = requireDb();
  await setDoc(doc(db, "projects", id), data, { merge: true });
}

/**
 * Creates a new draft project with sensible defaults, for the "+ New project"
 * tile on the live Work page. Returns the slug (not the doc id) since that's
 * what the public route needs to navigate straight to it.
 */
export async function createDraftProject(): Promise<string> {
  const db = requireDb();
  const slug = `untitled-${Date.now()}`;
  await addDoc(collection(db, "projects"), {
    slug,
    title: "Untitled project",
    type: "film",
    year: new Date().getFullYear(),
    logline: "",
    role: "Production company",
    credits: [],
    festivals: [],
    pressLinks: [],
    gallery: [],
    featuredOnHome: false,
    order: 99,
    status: "draft",
  });
  return slug;
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
    await setDoc(doc(db, "events", id), payload, { merge: true });
    return id;
  }
  const docRef = await addDoc(collection(db, "events"), payload);
  return docRef.id;
}

export async function deleteEvent(id: string) {
  const db = requireDb();
  await deleteDoc(doc(db, "events", id));
}

/**
 * Patch for inline editing, vs. saveEvent's full-object save. Uses
 * setDoc+merge rather than updateDoc — see patchProject for why: events can
 * exist only as seed data until their first edit.
 */
export async function patchEvent(id: string, data: Partial<Omit<SpicyEvent, "id">>) {
  const db = requireDb();
  await setDoc(doc(db, "events", id), data, { merge: true });
}

/**
 * Creates a new draft event with sensible defaults, for the "+ New event"
 * tile on the live Events page. Returns the slug (not the doc id) since
 * that's what the public route needs to navigate straight to it.
 */
export async function createDraftEvent(): Promise<string> {
  const db = requireDb();
  const slug = `untitled-${Date.now()}`;
  await addDoc(collection(db, "events"), {
    slug,
    title: "Untitled event",
    date: new Date().toISOString().slice(0, 10),
    type: "Other",
    summary: "",
    photos: [],
    hostConsent: false,
    isPublic: true,
    status: "draft",
    order: 99,
  });
  return slug;
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

// ---------- Simple ordered lists (Team, Collaborators, Services, FAQ, Press) ----------

const teamCrud = orderedCollectionCrud<TeamMember>("team");
export const listTeamAdmin = teamCrud.list;
export const saveTeamMember = teamCrud.save;
export const deleteTeamMember = teamCrud.remove;

const collaboratorsCrud = orderedCollectionCrud<Collaborator>("collaborators");
export const listCollaboratorsAdmin = collaboratorsCrud.list;
export const saveCollaborator = collaboratorsCrud.save;
export const deleteCollaborator = collaboratorsCrud.remove;

const servicesCrud = orderedCollectionCrud<Service>("services");
export const listServicesAdmin = servicesCrud.list;
export const saveService = servicesCrud.save;
export const deleteService = servicesCrud.remove;

const faqCrud = orderedCollectionCrud<FaqItem>("faq");
export const listFaqAdmin = faqCrud.list;
export const saveFaqItem = faqCrud.save;
export const deleteFaqItem = faqCrud.remove;

const pressCrud = orderedCollectionCrud<PressMention>("press");
export const listPressAdmin = pressCrud.list;
export const savePressMention = pressCrud.save;
export const deletePressMention = pressCrud.remove;

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

/** Approves a pending self-signup request by granting it a real role. */
export async function approveStaffUser(uid: string, role: StaffRole) {
  const db = requireDb();
  await updateDoc(doc(db, "users", uid), { role });
}

/** Denies a pending request (or revokes an existing staff member) by removing their profile doc. */
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
