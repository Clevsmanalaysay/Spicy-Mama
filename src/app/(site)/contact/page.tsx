import type { Metadata } from "next";
import { EditablePageHero } from "@/components/ui/EditablePageHero";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { getSiteSettings } from "@/lib/content";
import { inquiryTypeOptions } from "@/lib/seed-data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Spicy Mama Creative Studio for productions, collaborations, venue bookings or press.",
};

// Contact info/socials here are staff-editable via Firestore — render fresh
// on every request instead of caching a static build-time snapshot.
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ type?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const [settings, { type }] = await Promise.all([getSiteSettings(), searchParams]);
  const defaultInquiryType = inquiryTypeOptions.includes(type ?? "") ? (type as string) : "";

  return (
    <>
      <EditablePageHero page="contact" settings={settings} />

      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <ContactInfo settings={settings} />
          <ContactForm defaultInquiryType={defaultInquiryType} />
        </div>
      </Section>
    </>
  );
}
