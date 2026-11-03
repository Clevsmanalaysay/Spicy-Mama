import { ExternalLink } from "lucide-react";
import type { PressMention } from "@/lib/types";

export function PressMentions({ press }: { press: PressMention[] }) {
  if (!press.length) {
    return <p className="text-paper-dim">Press mentions will appear here as they&apos;re added in Admin.</p>;
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {press.map((p) => (
        <li key={p.id} className="rounded-lg border border-line bg-ink-soft p-4">
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring flex items-start justify-between gap-2 font-display font-bold text-paper hover:text-hot-bright"
          >
            {p.title}
            <ExternalLink className="mt-1 size-4 shrink-0" aria-hidden="true" />
          </a>
          <p className="mt-1 text-sm text-paper-dim">
            {p.outlet}
            {p.date ? ` · ${p.date}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
