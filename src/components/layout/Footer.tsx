import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { FacebookIcon, InstagramIcon, TikTokIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  const { socials } = settings;
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-paper-dim">{settings.heroTagline}</p>
            <div className="mt-5 flex items-center gap-4">
              {socials.instagram ? (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring text-paper transition-colors hover:text-hot"
                  aria-label="Spicy Mama on Instagram"
                >
                  <InstagramIcon className="size-5" />
                </a>
              ) : null}
              {socials.facebook ? (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring text-paper transition-colors hover:text-hot"
                  aria-label="Spicy Mama on Facebook"
                >
                  <FacebookIcon className="size-5" />
                </a>
              ) : null}
              {socials.tiktok ? (
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring text-paper transition-colors hover:text-hot"
                  aria-label="Spicy Mama on TikTok"
                >
                  <TikTokIcon className="size-5" />
                </a>
              ) : null}
              {socials.youtube ? (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring text-paper transition-colors hover:text-hot"
                  aria-label="Spicy Mama on YouTube"
                >
                  <YoutubeIcon className="size-5" />
                </a>
              ) : null}
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-paper-dim">
              {[
                ["/work", "Work"],
                ["/studio", "Studio & Services"],
                ["/venue", "Venue & Bookings"],
                ["/events", "Events"],
                ["/about", "About"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="focus-ring transition-colors hover:text-hot">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Reach us</p>
            <ul className="mt-4 space-y-3 text-sm text-paper-dim">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-hot" aria-hidden="true" />
                <a href={`mailto:${settings.contactEmail}`} className="focus-ring hover:text-hot">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-hot" aria-hidden="true" />
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="focus-ring hover:text-hot">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-hot" aria-hidden="true" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

          <NewsletterForm />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-paper-dim sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Spicy Mama Creative Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="focus-ring hover:text-hot">
              Privacy policy
            </Link>
            <Link href="/admin/login" className="focus-ring hover:text-hot">
              Staff sign-in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
