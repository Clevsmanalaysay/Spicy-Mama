# Spicy Mama Creative Studio — Website

A Next.js (App Router, TypeScript, Tailwind v4) site for Spicy Mama Creative Studio, built from the
"Website Content Strategy" brief: win production/brand work, book the venue, and let staff keep the
site current from a dashboard — no code required.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS v4** — brand tokens in `src/app/globals.css`
- **Firebase** — Firestore (content + form submissions), Firebase Auth (staff sign-in), Cloud Storage
  (images)
- **Zod** for form validation, **lucide-react** for icons

## Quickstart

```bash
npm install
cp .env.local.example .env.local   # fill in Firebase config — see below
npm run dev
```

Without a configured Firebase project, **the public site still works** — every page falls back to the
seed content in `src/lib/seed-data.ts` (see "How content loading works" below). Forms and the admin
dashboard need a real Firebase project to function.

## Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Add a **Web app** (Project settings → General → Your apps) and copy the config into `.env.local`
   (see `.env.local.example`).
3. Enable **Firestore** (production mode), **Authentication → Email/Password**, and **Storage**.
4. Deploy the security rules in this repo:
   ```bash
   npm install -g firebase-tools   # if you don't have it
   firebase login
   firebase use --add              # select your project
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
5. Create your first staff user: Firebase console → Authentication → **Add user** (email + password).
   Copy their **User UID**, then either:
   - add a document manually at Firestore path `users/{uid}` with `{ name, email, role: "admin" }`, or
   - sign in to `/admin/login` with any staff account already granted `admin`, then use
     **Admin → Users** to grant the new UID a role.

   The very first admin has to be created manually (chicken-and-egg) — every admin after that can be
   added through the dashboard.
6. Recommended Firebase **Extensions** (optional, not required to run the site):
   - **Resize Images** — auto-generates thumbnail/card/full sizes on upload to Storage.
   - **Trigger Email** (or a Cloud Function using SendGrid/Resend) — emails `siteSettings.notifyEmail`
     whenever a new `messages` or `bookings` document is created. A minimal trigger would look like:
     ```js
     exports.onNewLead = functions.firestore
       .document("{messages,bookings}/{id}")
       .onCreate(async (snap) => { /* send email via your provider */ });
     ```
     This repo ships the Firestore schema and rules this function would read from, but not the
     function itself — wire up your preferred email provider's API key as a Cloud Functions secret.

## How content loading works

Every public page reads through `src/lib/content.ts`. Each getter (`getProjects`, `getEvents`,
`getSiteSettings`, …) tries Firestore first and falls back to the matching seed data in
`src/lib/seed-data.ts` when Firebase isn't configured, a collection is empty, or a read fails. This
means:

- The site is fully previewable/deployable before any real content exists.
- Once staff publish real content through `/admin`, it replaces the seed content automatically — no
  code changes needed.
- Seed items that use placeholder facts (e.g. *Dreamboi*, *Multwoh: Patay na Patay Sa'yo* — logline,
  cast/crew, trailer, stills are mostly still TBD per the brief) are flagged `unverified: true` and
  show a yellow **"Unverified — confirm before launch"** badge. Replace them via **Admin → Projects**
  before going live.

## Content model (Firestore)

Matches the brief's "Content model for Firebase" table. See `src/lib/types.ts` for full field types.

| Collection | Purpose |
| --- | --- |
| `projects` | Films & collaborations (Portfolio + project pages) |
| `events` | Upcoming/past events at the venue |
| `services` | Service blocks on the Studio page |
| `collaborators` | Logo strip (Home) |
| `team` | Team bios (About) |
| `press` | Press mentions (About) |
| `faq` | FAQ (Studio) |
| `venue/content` | Single doc: venue copy, capacity, amenities, packages, rules, gallery, `heldDates` |
| `siteSettings/global` | Single doc: contact info, socials, homepage hero |
| `bookings` | Venue booking requests (write-only for visitors) |
| `messages` | Contact/project inquiries (write-only for visitors) |
| `newsletterSignups` | Footer newsletter opt-ins |
| `users` | Staff accounts: `{ uid, name, email, role: "admin" \| "editor" }` |

**Design note on availability:** the brief asks for a public "booked/held dates" calendar on the Venue
page, but also says the full `bookings` collection (with names/contact info) must be staff-only. This
build resolves that by keeping booking PII in `bookings` (staff-only) and mirroring just the *dates*
(no names) into `venue.heldDates` whenever staff change a booking's status to `held`/`confirmed` (see
`updateBookingStatus` in `src/lib/admin-data.ts`). The public Venue page reads only `venue.heldDates`.

## Roles & permissions

Enforced in `firestore.rules`, not just the UI:

| | Visitor | Editor | Admin |
| --- | --- | --- | --- |
| View public site | ✅ | ✅ | ✅ |
| Edit content | – | ✅ (drafts only) | ✅ |
| Publish | – | – | ✅ |
| Edit site settings & socials | – | – | ✅ |
| Manage staff users | – | – | ✅ |
| See form submissions | – | ✅ | ✅ |

## Editing content

There's no separate form-based CMS screen for page content — staff edit the real public pages
directly. Sign in at **`/admin/login`** (staff only — linked quietly from the public footer, not the
main nav), then visit any page: a floating bar appears at the bottom with an **Edit this page**
toggle. Turning it on turns every CMS-backed piece of content on that page into click-to-edit text,
click-to-replace images, and add/remove controls for list content (team members, services, FAQ,
credits, festivals, stills, etc.) — changes save to Firestore as you go, with no separate "preview"
step, because you're always looking at the real page.

This covers everything the brief marks `(CMS)`: the Home hero and collaborators strip; Studio's
service blocks and FAQ; the Venue page's space/gallery/capacity/amenities, packages and house rules;
About's team and press mentions; Contact's info and social links; and full project/event editing on
their own detail pages (poster, trailer, credits, festivals, press, stills, draft/publish status,
host-consent, etc. — matching the two documented "Add a new film" / "Add an event" workflows, just
done in place on `/work/<slug>` and `/events/<slug>` instead of a form). A **"+ Add project/event"**
tile appears in the Work/Events grids in edit mode to create a new draft and jump straight to editing
it.

`src/lib/edit-mode.tsx` (the `EditModeProvider`/`useEditMode` context) and `src/components/edit/`
(`EditableText`, `EditableImage`, `AddItemButton`/`RemoveItemButton`, the floating `StaffEditBar`) are
the reusable primitives behind this — every editable page is a thin client component around them.
Per the roles table above, editors can edit everything but only save drafts; the draft/publish select
is disabled for editors on project/event pages, and `siteSettings`/`venue` writes are gated to admins
in `firestore.rules` regardless of what the UI allows.

The **Admin dashboard** (`/admin`) itself is only for things that aren't "page content": **Inbox**
(contact messages and booking requests; changing a booking's status also updates the public
availability list) and **Users** (approve/deny self-service access requests, or grant/revoke access
directly by Firebase Auth UID — see Firebase setup step 5). `/admin/projects` and `/admin/events` are
simple read-only indexes (useful for finding a draft that isn't on the public grid yet) that link out
to the real pages to edit.

## Signup & approval flow

`/admin/signup` is public and lets anyone create a staff login — but a fresh signup gets a
`users/{uid}` doc with `role: "pending"`, which `firestore.rules` and `useAuth`/`AuthGuard` both treat
as zero access: they can sign in, but land on a "waiting on approval" screen instead of the dashboard.
An existing admin approves (assigns `admin`/`editor`) or denies (deletes the doc) from **Admin →
Users**. The Firestore rule is deliberately narrow — a user can only ever create *their own* doc, and
only with `role: "pending"`; they cannot self-assign a real role, and only an admin can update or
delete a `users/{uid}` doc afterward.

## SEO, accessibility & performance notes

- Every public page sets per-page `<title>`/description via Next.js Metadata; `sitemap.xml` and
  `robots.txt` are generated at `/sitemap.xml` and `/robots.txt` (admin routes excluded).
- JSON-LD structured data: `Organization` (site-wide), `Movie` (film project pages), `EventVenue`
  (Venue page), `Event` (event detail pages).
- Clean URLs: `/work/<slug>`, `/events/<slug>`.
- Contrast: the accent pink (`#E8436A`) on the near-black background (`#141414`) measures **4.77:1**
  — passes WCAG AA for small text. Body copy uses off-white (`#F5EFE6`, 16:1) rather than pink, per
  the brief. Forms sit on a light cream section with dark text for readability, as specified.
- Every rendered image has an `alt` attribute (auto-derived from title/context today — a free-text alt
  field per upload is a natural follow-up if more control is needed).
- Trailers never autoplay on page load — a poster + play button loads the embed only on click.
- All form fields have visible `<label>`s and inline error text; date/time inputs use native,
  keyboard-operable pickers.

## What's simplified for this build (and how to extend it)

- **Email notifications** on new leads need a Cloud Function + email provider (see Firebase setup
  step 6) — the Firestore writes it would trigger on are already in place.
- **Image resizing/WebP** is best handled by the Firebase "Resize Images" Extension rather than
  application code — install it against the Storage paths used in `src/lib/admin-data.ts`
  (`uploadImage`/`MultiImageUploadField`).
- **Per-image alt text** isn't a separate admin field yet (see Accessibility notes above).
- Member account sign-in (beyond staff) is explicitly a later phase per the brief and isn't built here.

## Launch content checklist

Carried over from the brief — replace seed/placeholder content via `/admin` before launch:

- [x] Logo — `public/brand/logo.png`, used by `src/components/layout/Logo.tsx` in the header,
      footer and admin screens. Favicon stays the hand-built sparkle mark (`src/app/icon.svg`) since
      the full wordmark is illegible at favicon size.
- [ ] Showreel or hero video (30–60s) / hero key art
- [ ] *Multwoh: Patay na Patay Sa'yo* — year, logline, role, director, cast, trailer, stills, screenings
- [ ] *Dreamboi* — confirm logline, exact credited role, trailer, stills, festival details
- [ ] Any other past projects and brand collaborations
- [ ] Collaborator/partner logos with permission to display
- [ ] Venue photos (day and night), floor plan, capacity, amenities list
- [ ] Venue packages, pricing approach, deposit/cancellation policy, house rules
- [ ] 3–5 past event photo sets with host consent
- [ ] Studio story, team names, roles, headshots, bios
- [ ] Address, phone, hours, map embed URL
- [ ] Facebook URL and any other socials
- [ ] Privacy policy text (`src/app/(site)/privacy/page.tsx` has a placeholder)

## Project structure

```
src/app/(site)/      Public pages — share the Header/Footer layout
src/app/admin/        Staff dashboard — separate layout, auth-gated
src/components/       UI primitives, layout, per-page sections, admin forms
src/lib/               types.ts, seed-data.ts, content.ts (reads), admin-data.ts (writes),
                       firebase.ts / firebase-auth.ts, validation.ts, actions.ts (public form writes)
firestore.rules        Security rules (roles table enforced server-side)
storage.rules           Image upload rules
```

## Deploying

This is a standard Next.js app — deploy it anywhere Next.js runs:

- **Firebase App Hosting**: `firebase init apphosting` then `firebase deploy --only apphosting`
  (`apphosting.yaml` is included).
- **Vercel**: `vercel deploy` (framework auto-detected).

Either way, also deploy the Firestore/Storage rules (`firebase deploy --only firestore,storage`) and
set the same environment variables from `.env.local` in your hosting provider's dashboard.
