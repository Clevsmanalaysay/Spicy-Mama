"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteApp, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import { firebaseConfig, getDb } from "./firebase";
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

/**
 * Looks up a project by slug as the signed-in staff user, so a draft (one
 * that `getProjectBySlug` in content.ts can't see — that read has no signed-in
 * user, so it can only ever find published docs) is still reachable by the
 * staff member who's looking right at it. Unlike content.ts's version this
 * doesn't filter by status: the security rule lets any signed-in staff
 * member read any project regardless of status, and since that condition
 * doesn't depend on the document's own data, Firestore can verify it's safe
 * without a status filter in the query.
 */
export async function getProjectBySlugAsStaff(slug: string): Promise<Project | null> {
  const db = requireDb();
  const q = query(collection(db, "projects"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Project;
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

/** Looks up an event by slug as the signed-in staff user — see getProjectBySlugAsStaff. */
export async function getEventBySlugAsStaff(slug: string): Promise<SpicyEvent | null> {
  const db = requireDb();
  const q = query(collection(db, "events"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as SpicyEvent;
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
export async function createDraftEvent(defaultDate?: string): Promise<string> {
  const db = requireDb();
  const slug = `untitled-${Date.now()}`;
  await addDoc(collection(db, "events"), {
    slug,
    title: "Untitled event",
    date: defaultDate ?? new Date().toISOString().slice(0, 10),
    type: "Other",
    summary: "",
    photos: [],
    videos: [],
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
 * Creates/updates the Firestore role profile for a staff member, by uid, for
 * an Auth account that already exists. Prefer inviteStaffUser below, which
 * creates that account too — this is here for the Firebase-console-created
 * case (or correcting an existing profile).
 */
export async function upsertStaffProfile(uid: string, data: { name: string; email: string; role: StaffRole }) {
  const db = requireDb();
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

/**
 * Invites a new staff member by email — no Firebase Console step, no UID to
 * copy. Creates their Firebase Auth account and grants the chosen role
 * directly, then emails them a link (via Firebase Auth's own free email
 * delivery) to set their password and sign in.
 *
 * The account is created on a throwaway secondary Firebase App instance,
 * not the app's shared one: createUserWithEmailAndPassword auto-signs-in as
 * whichever account it just created, which would otherwise boot the admin
 * out of their own session the moment they invited someone.
 */
export async function inviteStaffUser(name: string, email: string, role: StaffRole) {
  const secondaryApp = initializeApp(firebaseConfig, `invite-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const tempPassword = crypto.randomUUID();
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, tempPassword);
    await sendPasswordResetEmail(secondaryAuth, email);
    await upsertStaffProfile(credential.user.uid, { name, email, role });
  } finally {
    await signOut(secondaryAuth).catch(() => {});
    await deleteApp(secondaryApp).catch(() => {});
  }
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

// ---------- Image uploads (Cloudinary) ----------
//
// Firebase Storage now requires the paid Blaze plan to even create a
// bucket, so image uploads go to Cloudinary's free tier instead — an
// unsigned upload preset lets the browser upload directly, no backend
// secret or server round-trip needed, same as the Storage flow this
// replaced.

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file: File, pathPrefix: string): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Image uploads aren't configured — add Cloudinary credentials to .env.local.");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", pathPrefix);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Image upload failed — try again.");
  }
  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}

export async function uploadVideo(file: File, pathPrefix: string): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Video uploads aren't configured — add Cloudinary credentials to .env.local.");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", pathPrefix);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Video upload failed — try again.");
  }
  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}

export const nowTimestamp = serverTimestamp;
