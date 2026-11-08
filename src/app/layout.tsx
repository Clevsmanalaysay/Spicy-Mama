import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spicymamastudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Spicy Mama Creative Studio — Stories with heat.",
    template: "%s — Spicy Mama Creative Studio",
  },
  description:
    "Spicy Mama Creative Studio makes films, brand content and music videos, and opens its venue for parties, launches and shoots. We make films that get noticed.",
  openGraph: {
    siteName: "Spicy Mama Creative Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Runs before paint so a stored light-mode preference applies immediately
// instead of flashing dark-then-light. Static inline code, not user input.
const themeInitScript = `(function(){try{if(localStorage.getItem('spicy-mama-theme')==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-ink text-paper antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
