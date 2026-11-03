import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
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
          <ContactInfo settings={settings} />
          <ContactForm defaultInquiryType={defaultInquiryType} />
        </div>
      </Section>
    </>
  );
}
