import { Section } from "@/components/ui/Section";
import type { Collaborator } from "@/lib/types";

export function CollaboratorsStrip({ collaborators }: { collaborators: Collaborator[] }) {
  if (!collaborators.length) return null;
  return (
    <Section tone="dark" className="py-10 sm:py-14">
      <p className="text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-paper-dim">
        Collaborators &amp; partners
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {collaborators.map((c) =>
          c.link ? (
            <a
              key={c.id}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring font-display text-lg font-bold text-paper-dim transition-colors hover:text-hot-bright"
            >
              {c.name}
            </a>
          ) : (
            <span key={c.id} className="font-display text-lg font-bold text-paper-dim">
              {c.name}
            </span>
          ),
        )}
      </div>
    </Section>
  );
}
