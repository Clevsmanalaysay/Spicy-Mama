export type ProjectType =
  | "film"
  | "commercial"
  | "music-video"
  | "collaboration"
  | "event";

export type ContentStatus = "draft" | "published";

export interface Credit {
  name: string;
  role: string;
}

export interface FestivalEntry {
  name: string;
  result?: string;
  year?: string;
  link?: string;
}

export interface PressLink {
  title: string;
  outlet?: string;
  url: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  type: ProjectType;
  year: number;
  format?: string;
  runtime?: string;
  genre?: string;
  logline: string;
  role: string;
  posterUrl?: string;
  trailerUrl?: string;
  credits: Credit[];
  festivals: FestivalEntry[];
  pressLinks: PressLink[];
  gallery: string[];
  featuredOnHome: boolean;
  order: number;
  status: ContentStatus;
  seoTitle?: string;
  seoDescription?: string;
  shareImage?: string;
}

export interface SpicyEvent {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: string;
  summary: string;
  description?: string;
  coverUrl?: string;
  photos: string[];
  hostConsent: boolean;
  isPublic: boolean;
  status: ContentStatus;
  order: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  deliverables: string[];
  relatedProjectSlugs: string[];
  order: number;
}

export interface Collaborator {
  id: string;
  name: string;
  logoUrl?: string;
  link?: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  bio: string;
  order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface PressMention {
  id: string;
  outlet: string;
  title: string;
  url: string;
  date?: string;
  order: number;
}

export interface VenuePackage {
  name: string;
  priceFrom?: string;
  description: string;
}

export interface VenueContent {
  intro: string;
  capacityStanding: number;
  capacitySeated: number;
  amenities: string[];
  packages: VenuePackage[];
  rules: string[];
  gallery: string[];
  /**
   * ISO dates (YYYY-MM-DD) currently held or confirmed. No names or contact
   * details live here — this is the only booking-derived data visitors can
   * read; the full `bookings` collection stays staff-only. Admin updates
   * this when changing a booking's status (see Admin → Inbox workflow).
   */
  heldDates: string[];
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

export interface PageHeroContent {
  eyebrow: string;
  title: string;
  description: string;
}

/** Keys match the icon options in lib/icon-options.ts. */
export type WhatWeDoIconKey = "film" | "megaphone" | "party" | "camera" | "music" | "sparkle";

export interface WhatWeDoTile {
  icon: WhatWeDoIconKey;
  title: string;
  description: string;
  href: string;
}

export interface SiteSettings {
  contactEmail: string;
  notifyEmail: string;
  phone: string;
  address: string;
  hours: string;
  /** Google Maps link the address links out to (a regular share URL, not an embed src). */
  mapUrl?: string;
  socials: SocialLinks;
  /** Display text for the Instagram teaser on Home, e.g. "@spicymamastudio". */
  instagramHandle: string;
  /** Manually curated photos for the Instagram teaser grid — not a live feed. */
  instagramPhotos: string[];
  heroHeadline: string;
  heroTagline: string;
  heroSubtext: string;
  heroMedia?: string;
  whatWeDoTiles: WhatWeDoTile[];
  closingCtaHeading: string;
  aboutValues: string[];
  /**
   * Free-form section headings keyed by a unique id per usage site (e.g.
   * "home.featuredWork", "about.values") — see EditableSectionHeading. A
   * key with no entry here just uses that call site's hardcoded defaults.
   */
  sectionHeadings?: Record<string, { eyebrow?: string; title: string; description?: string }>;
  pageHero: {
    studio: PageHeroContent;
    about: PageHeroContent;
    venue: PageHeroContent;
    contact: PageHeroContent;
    events: PageHeroContent;
    work: PageHeroContent;
  };
}

export type BookingStatus = "new" | "held" | "confirmed" | "declined";

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  backupDate?: string;
  startTime: string;
  endTime: string;
  guests: number;
  addOns: string[];
  budget?: string;
  notes?: string;
  agreeHouseRules: boolean;
  status?: BookingStatus;
  createdAt?: string;
}

export type MessageStatus = "new" | "read" | "replied" | "archived";

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: string;
  budgetRange?: string;
  timeline?: string;
  message: string;
  consent: boolean;
  status?: MessageStatus;
  createdAt?: string;
}

export type StaffRole = "admin" | "editor";

/** "pending" is a self-signed-up request awaiting admin approval — it grants no dashboard access. */
export type StaffRoleOrPending = StaffRole | "pending";

export interface StaffUser {
  uid: string;
  name: string;
  email: string;
  role: StaffRoleOrPending;
  requestedAt?: string;
}
