import type { Metadata } from "next";
import { MapPin, Clock, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { InstagramIcon, FacebookIcon, TikTokIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { getSiteSettings } from "@/lib/content";
import { inquiryTypeOptions } from "@/lib/seed-data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Spicy Mama Creative Studio for productions, collaborations, venue bookings or press.",
};

type SearchParams = Promise<{ type?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const [settings, { type }] = await Promise.all([getSiteSettings(), searchParams]);
  const defaultInquiryType = inquiryTypeOptions.includes(type ?? "") ? (type as string) : "";

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Got a story? Let's make it spicy."
        description="Production inquiries, brand collaborations, press or anything else — tell us about it below."
      />

      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Reach us directly" title="Contact info" />
            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-hot" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-paper">Email</p>
                  <a href={`mailto:${settings.contactEmail}`} className="focus-ring text-paper-dim hover:text-hot-bright">
                    {settings.contactEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-hot" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-paper">Phone</p>
                  <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="focus-ring text-paper-dim hover:text-hot-bright">
                    {settings.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-hot" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-paper">Address</p>
                  {settings.mapUrl ? (
                    <a
                      href={settings.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring text-paper-dim underline decoration-paper-dim/40 underline-offset-2 hover:text-hot-bright hover:decoration-hot-bright"
                    >
                      {settings.address}
                    </a>
                  ) : (
                    <p className="text-paper-dim">{settings.address}</p>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-hot" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-paper">Hours</p>
                  <p className="text-paper-dim">{settings.hours}</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-4">
              {settings.socials.instagram ? (
                <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="focus-ring text-paper hover:text-hot" aria-label="Instagram">
                  <InstagramIcon className="size-6" />
                </a>
              ) : null}
              {settings.socials.facebook ? (
                <a href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="focus-ring text-paper hover:text-hot" aria-label="Facebook">
                  <FacebookIcon className="size-6" />
                </a>
              ) : null}
              {settings.socials.tiktok ? (
                <a href={settings.socials.tiktok} target="_blank" rel="noopener noreferrer" className="focus-ring text-paper hover:text-hot" aria-label="TikTok">
                  <TikTokIcon className="size-6" />
                </a>
              ) : null}
              {settings.socials.youtube ? (
                <a href={settings.socials.youtube} target="_blank" rel="noopener noreferrer" className="focus-ring text-paper hover:text-hot" aria-label="YouTube">
                  <YoutubeIcon className="size-6" />
                </a>
              ) : null}
            </div>

            {settings.mapUrl ? (
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-8 flex items-center gap-2 rounded-full border border-line px-5 py-3 font-display text-sm font-bold text-paper transition-colors hover:border-hot hover:text-hot-bright"
              >
                <MapPin className="size-4" aria-hidden="true" />
                View on Google Maps
              </a>
            ) : null}
          </div>

          <ContactForm defaultInquiryType={defaultInquiryType} />
        </div>
      </Section>
    </>
  );
}
