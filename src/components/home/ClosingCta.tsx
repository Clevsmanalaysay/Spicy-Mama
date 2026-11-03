import { LinkButton } from "@/components/ui/Button";
import { SparkleDivider } from "@/components/ui/SparkleDivider";

export function ClosingCta() {
  return (
    <section className="bg-ink py-20 text-center sm:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <SparkleDivider className="mx-auto max-w-xs" />
        <h2 className="mt-8 font-display text-3xl font-bold sm:text-5xl">
          Got a story? Let&apos;s make it spicy.
        </h2>
        <div className="mt-8">
          <LinkButton href="/contact" size="lg">
            Start a conversation
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
