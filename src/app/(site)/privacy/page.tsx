import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <Section tone="light" className="pt-28">
      <div className="prose-sm max-w-2xl text-ink">
        <h1 className="font-display text-3xl font-bold">Privacy policy</h1>
        <p className="mt-2 text-sm text-ink/60">Draft placeholder — replace with real policy text before launch.</p>

        <h2 className="mt-8 font-display text-xl font-bold">What we collect</h2>
        <p className="mt-2 text-ink/80">
          When you submit the contact or booking form, we collect your name, email, phone number and the details you
          share about your project or event. This is stored in our database to respond to your inquiry.
        </p>

        <h2 className="mt-8 font-display text-xl font-bold">How we use it</h2>
        <p className="mt-2 text-ink/80">
          We use your details only to respond to your inquiry or booking request, and — if you opt in — to send
          occasional updates. We don&apos;t sell your information.
        </p>

        <h2 className="mt-8 font-display text-xl font-bold">Event photography</h2>
        <p className="mt-2 text-ink/80">
          Photos from public events may be published on this site and our social channels. Photos from private
          events are only published with the host&apos;s consent.
        </p>

        <h2 className="mt-8 font-display text-xl font-bold">Contact</h2>
        <p className="mt-2 text-ink/80">
          Questions about this policy? Reach us through the <a href="/contact" className="font-semibold text-hot-deep underline">contact page</a>.
        </p>
      </div>
    </Section>
  );
}
