import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StaffEditBar } from "@/components/edit/StaffEditBar";
import { EditModeProvider } from "@/lib/edit-mode";
import { getSiteSettings } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spicymamastudio.com";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Spicy Mama Creative Studio",
    url: siteUrl,
    email: settings.contactEmail,
    telephone: settings.phone,
    sameAs: Object.values(settings.socials).filter(Boolean),
  };

  return (
    <EditModeProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-hot focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pb-20">
        {children}
      </main>
      <Footer settings={settings} />
      <StaffEditBar />
    </EditModeProvider>
  );
}
