import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getDb } from "./firebase";
import {
  seedCollaborators,
  seedEvents,
  seedFaq,
  seedPress,
  seedProjects,
  seedServices,
  seedSiteSettings,
  seedTeam,
  seedVenue,
} from "./seed-data";
import type {
  Collaborator,
  FaqItem,
  PressMention,
  Project,
  Service,
  SiteSettings,
  SpicyEvent,
  TeamMember,
  VenueContent,
} from "./types";

// Every getter here tries Firestore first (so the site renders live, staff-
// edited content and stays server-rendered for SEO) and falls back to the
// local seed data whenever Firestore isn't configured, a collection is still
// empty, or a read fails — so the site always has something to show.

async function safeQuery<T>(run: () => Promise<T[]>, fallback: T[]): Promise<T[]> {
  const db = getDb();
  if (!db) return fallback;
  try {
    const result = await run();
    return result.length ? result : fallback;
  } catch (err) {
    console.error("content.ts query failed, using seed data:", err);
    return fallback;
  }
}

async function safeDoc<T>(run: () => Promise<T | null>, fallback: T | null): Promise<T | null> {
  const db = getDb();
  if (!db) return fallback;
  try {
    const result = await run();
    return result ?? fallback;
  } catch (err) {
    console.error("content.ts doc read failed, using seed data:", err);
    return fallback;
  }
}

export async function getProjects(options?: { type?: string; limit?: number }): Promise<Project[]> {
  const projects = await safeQuery(async () => {
    const db = getDb()!;
    const constraints = [where("status", "==", "published"), orderBy("order", "asc")];
    const q = options?.limit
      ? query(collection(db, "projects"), ...constraints, fbLimit(options.limit))
      : query(collection(db, "projects"), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Project);
  }, seedProjects.filter((p) => p.status === "published"));

  const filtered = options?.type ? projects.filter((p) => p.type === options.type) : projects;
  return options?.limit ? filtered.slice(0, options.limit) : filtered;
}

export async function getFeaturedProjects(max = 4): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featuredOnHome).slice(0, max);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return safeDoc(async () => {
    const db = getDb()!;
    const q = query(collection(db, "projects"), where("slug", "==", slug), fbLimit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Project;
  }, seedProjects.find((p) => p.slug === slug) ?? null);
}

export async function getServices(): Promise<Service[]> {
  return safeQuery(async () => {
    const db = getDb()!;
    const q = query(collection(db, "services"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Service);
  }, seedServices);
}

export async function getFaq(): Promise<FaqItem[]> {
  return safeQuery(async () => {
    const db = getDb()!;
    const q = query(collection(db, "faq"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FaqItem);
  }, seedFaq);
}

export async function getCollaborators(): Promise<Collaborator[]> {
  return safeQuery(async () => {
    const db = getDb()!;
    const q = query(collection(db, "collaborators"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Collaborator);
  }, seedCollaborators);
}

export async function getEvents(options?: { publicOnly?: boolean }): Promise<SpicyEvent[]> {
  const events = await safeQuery(async () => {
    const db = getDb()!;
    const q = query(collection(db, "events"), where("status", "==", "published"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SpicyEvent);
  }, seedEvents.filter((e) => e.status === "published"));

  return options?.publicOnly === false ? events : events.filter((e) => e.isPublic);
}

export async function getEventBySlug(slug: string): Promise<SpicyEvent | null> {
  return safeDoc(async () => {
    const db = getDb()!;
    const q = query(collection(db, "events"), where("slug", "==", slug), fbLimit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as SpicyEvent;
  }, seedEvents.find((e) => e.slug === slug) ?? null);
}

export async function getTeam(): Promise<TeamMember[]> {
  return safeQuery(async () => {
    const db = getDb()!;
    const q = query(collection(db, "team"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TeamMember);
  }, seedTeam);
}

export async function getPress(): Promise<PressMention[]> {
  return safeQuery(async () => {
    const db = getDb()!;
    const snap = await getDocs(collection(db, "press"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PressMention);
  }, seedPress);
}

export async function getVenueContent(): Promise<VenueContent> {
  const result = await safeDoc(async () => {
    const db = getDb()!;
    const snap = await getDoc(doc(db, "venue", "content"));
    return snap.exists() ? (snap.data() as VenueContent) : null;
  }, seedVenue);
  return result ?? seedVenue;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await safeDoc(async () => {
    const db = getDb()!;
    const snap = await getDoc(doc(db, "siteSettings", "global"));
    return snap.exists() ? (snap.data() as SiteSettings) : null;
  }, seedSiteSettings);
  return result ?? seedSiteSettings;
}
