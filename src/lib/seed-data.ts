// Fallback content shown whenever Firestore isn't connected (local dev without a
// Firebase project) or a collection is empty. This is exactly the shape every
// collection takes in Firestore, so swapping to live content is a drop-in —
// see lib/content.ts. Items marked `unverified: true` use placeholder values
// from the content strategy's "to collect" list and should be confirmed by an
// admin on first publish.

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

export const seedProjects: Project[] = [
  {
    id: "dreamboi",
    slug: "dreamboi",
    title: "Dreamboi",
    type: "film",
    year: 2025,
    format: "Feature",
    runtime: "—",
    genre: "Drama",
    logline:
      "A film by Rodina Singh, starring EJ Jallorina, Tony Labrusca and Jenn Rosa. (Full synopsis still pending — confirm with the brief owner.)",
    role: "Production company",
    posterUrl: "/posters/dreamboi.png",
    trailerUrl: "https://www.youtube.com/watch?v=-T2y0yn2Ymo",
    credits: [
      { name: "Rodina Singh", role: "Director" },
      { name: "EJ Jallorina", role: "Cast" },
      { name: "Tony Labrusca", role: "Cast" },
      { name: "Jenn Rosa", role: "Cast" },
    ],
    festivals: [],
    pressLinks: [],
    gallery: [],
    featuredOnHome: true,
    order: 1,
    status: "published",
    unverified: true,
  },
  {
    id: "multwoh-patay-na-patay-sayo",
    slug: "multwoh-patay-na-patay-sayo",
    title: "Multwoh: Patay na Patay Sa'yo",
    type: "film",
    year: 2026,
    format: "Short film",
    runtime: "—",
    genre: "—",
    logline:
      "Logline, director and cast not yet supplied — pending the launch content checklist. (Placeholder — confirm with the brief owner.)",
    role: "Production company",
    posterUrl: "/posters/multwoh.png",
    trailerUrl: "https://www.youtube.com/watch?v=uRc-eeudvS0",
    credits: [],
    festivals: [],
    pressLinks: [],
    gallery: [],
    featuredOnHome: true,
    order: 2,
    status: "published",
    unverified: true,
  },
  {
    id: "sassa-gurl-maria-hiwaga",
    slug: "maria-hiwaga",
    title: "Maria Hiwaga",
    type: "music-video",
    year: 2026,
    format: "Music Video",
    runtime: "—",
    logline: "A music video for Sassa Gurl. (Year and full credits unverified — confirm with the brief owner.)",
    role: "Music video production",
    posterUrl: "https://img.youtube.com/vi/CaqmRKvM-20/hqdefault.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=CaqmRKvM-20",
    credits: [{ name: "Sassa Gurl", role: "Artist" }],
    festivals: [],
    pressLinks: [],
    gallery: [],
    featuredOnHome: false,
    order: 3,
    status: "published",
    unverified: true,
  },
  {
    id: "sassa-gurl-mahiyain",
    slug: "mahiyain",
    title: "Mahiyain",
    type: "music-video",
    year: 2026,
    format: "Music Video",
    runtime: "—",
    logline: "A music video for Sassa Gurl. (Year and full credits unverified — confirm with the brief owner.)",
    role: "Music video production",
    posterUrl: "https://img.youtube.com/vi/UMEzOZ7xVcw/hqdefault.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=UMEzOZ7xVcw",
    credits: [{ name: "Sassa Gurl", role: "Artist" }],
    festivals: [],
    pressLinks: [],
    gallery: [],
    featuredOnHome: false,
    order: 4,
    status: "published",
    unverified: true,
  },
  {
    id: "sassa-gurl-panaginip",
    slug: "panaginip",
    title: "Panaginip",
    type: "music-video",
    year: 2026,
    format: "Music Video",
    runtime: "—",
    logline: "A music video for Sassa Gurl. (Year and full credits unverified — confirm with the brief owner.)",
    role: "Music video production",
    posterUrl: "https://img.youtube.com/vi/EMnmClfxFiQ/hqdefault.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EMnmClfxFiQ",
    credits: [{ name: "Sassa Gurl", role: "Artist" }],
    festivals: [],
    pressLinks: [],
    gallery: [],
    featuredOnHome: false,
    order: 5,
    status: "published",
    unverified: true,
  },
];

export const seedServices: Service[] = [
  {
    id: "film-production",
    name: "Film Production",
    description:
      "Narrative features and short films, end to end — development through delivery.",
    deliverables: ["Narrative features", "Short films", "Festival-ready masters"],
    relatedProjectSlugs: ["dreamboi"],
    order: 1,
  },
  {
    id: "branded-content",
    name: "Branded Content & Commercials",
    description:
      "Campaigns built for brands that want a film crew's eye, not a template.",
    deliverables: ["Brand films", "Social campaigns", "Commercial spots"],
    relatedProjectSlugs: [],
    order: 2,
  },
  {
    id: "music-videos",
    name: "Music Videos",
    description: "Visuals with the same bite as the track.",
    deliverables: ["Concept to treatment", "Full-day shoots", "Performance + narrative edits"],
    relatedProjectSlugs: ["maria-hiwaga", "mahiyain", "panaginip"],
    order: 3,
  },
  {
    id: "line-production",
    name: "Line Production & Co-production",
    description:
      "Boots-on-the-ground producing and content support for other teams' projects.",
    deliverables: ["Local line producing", "Co-production", "Social content support"],
    relatedProjectSlugs: ["multwoh-patay-na-patay-sayo"],
    order: 4,
  },
  {
    id: "creative-direction",
    name: "Creative Direction & Content for Social",
    description: "Ongoing creative direction and scroll-stopping content built for feeds, not just reels.",
    deliverables: ["Creative direction", "Content calendars", "Short-form edits"],
    relatedProjectSlugs: [],
    order: 5,
  },
];

export const seedFaq: FaqItem[] = [
  {
    id: "timelines",
    question: "How far in advance should we book?",
    answer:
      "For production work, 3–6 weeks for pre-production is typical; branded content can move faster. The sooner we're in, the better the result.",
    order: 1,
  },
  {
    id: "budgets",
    question: "Do you work with a range of budgets?",
    answer:
      "Yes — tell us your budget range in the inquiry form and we'll scope a treatment that fits it, or tell you honestly if it doesn't.",
    order: 2,
  },
  {
    id: "travel",
    question: "Do you travel for shoots?",
    answer: "We do. Travel and accommodation are scoped into the quote once we know the location.",
    order: 3,
  },
  {
    id: "rights",
    question: "Who owns the footage and the rights to use it?",
    answer:
      "Usage rights are agreed per project before we shoot — covered in your production agreement, not left to assumption.",
    order: 4,
  },
];

export const seedCollaborators: Collaborator[] = [
  { id: "cine-silip", name: "Cine Silip", order: 1 },
];

export const seedEvents: SpicyEvent[] = [
  {
    id: "placeholder-screening",
    slug: "placeholder-screening",
    title: "Screening night — details TBD",
    date: "2026-12-01",
    type: "Screening",
    summary:
      "Event recap pending — add past events with photos from the Admin dashboard.",
    photos: [],
    hostConsent: true,
    isPublic: true,
    status: "draft",
    order: 1,
  },
];

export const seedTeam: TeamMember[] = [
  {
    id: "founder",
    name: "Team bios pending",
    role: "Add team members in Admin → About",
    bio: "Names, roles, headshots and short bios are collected on the launch checklist — add the team here once supplied.",
    order: 1,
  },
];

export const seedPress: PressMention[] = [];

export const seedVenue: VenueContent = {
  intro:
    "A creative studio by day. Your party by night. The same space that builds campaigns and shoots films opens up for birthdays, launches, screenings and shoots after hours.",
  capacityStanding: 80,
  capacitySeated: 40,
  amenities: ["Sound system", "Stage lighting", "Projector & screen", "Full bar setup", "Restrooms", "Street parking"],
  packages: [
    {
      name: "Bare space",
      priceFrom: "Request a quote",
      description: "The venue, house lighting and sound — bring your own vendors.",
    },
    {
      name: "Full house",
      priceFrom: "Request a quote",
      description: "Venue, lighting design, sound engineer and house bar staff included.",
    },
  ],
  rules: [
    "Standard hours: 6 PM – 2 AM, extended hours on request.",
    "Noise must stay within city ordinance after 10 PM.",
    "A deposit holds your date; balance due 7 days before the event.",
    "Cancellations within 14 days forfeit the deposit.",
    "Outside catering welcome with advance notice.",
    "Decor must be freestanding — no nails, tape or open flame on walls.",
  ],
  gallery: [],
  heldDates: [],
};

export const seedSiteSettings: SiteSettings = {
  contactEmail: "hello@spicymamastudio.com",
  notifyEmail: "hello@spicymamastudio.com",
  phone: "+63 2 8000 0000",
  address: "Spicy Mama Creative Studio, Metro Manila, Philippines",
  hours: "By appointment · Events Thu–Sun, 6 PM–2 AM",
  mapUrl: undefined,
  socials: {
    instagram: "https://www.instagram.com/spicymamastudio/",
  },
  heroHeadline: "We make films. We throw parties. Both get noticed.",
  heroTagline: "Stories with heat.",
  heroMedia: undefined,
};

export const eventTypeOptions = [
  "Birthday",
  "Private party",
  "Launch",
  "Screening",
  "Workshop",
  "Shoot",
  "Other",
];

export const inquiryTypeOptions = [
  "Production",
  "Brand collaboration",
  "Venue",
  "Press",
  "Other",
];

export const addOnOptions = [
  "Sound",
  "Lights",
  "Projector",
  "Bar",
  "Catering",
  "Decor",
];

export const budgetRangeOptions = [
  "Under ₱100k",
  "₱100k–₱300k",
  "₱300k–₱750k",
  "₱750k+",
  "Let's discuss",
];
