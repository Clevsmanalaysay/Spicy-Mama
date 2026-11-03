import { CalendarX2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function Availability({ heldDates }: { heldDates: string[] }) {
  const upcoming = heldDates
    .filter((d) => new Date(d) >= new Date(new Date().toDateString()))
    .sort()
    .slice(0, 12);

  return (
    <div className="rounded-xl border border-line bg-ink-soft p-6">
      <div className="flex items-center gap-2">
        <CalendarX2 className="size-5 text-hot" aria-hidden="true" />
        <h3 className="font-display text-base font-bold text-paper">Currently held or confirmed</h3>
      </div>
      {upcoming.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {upcoming.map((d) => (
            <li key={d} className="rounded-full border border-line px-3 py-1 text-xs text-paper-dim">
              {formatDate(d)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-paper-dim">No dates on hold right now — most dates are open.</p>
      )}
      <p className="mt-4 text-xs text-paper-dim">
        This isn&apos;t live booking — submit a request below and we&apos;ll confirm availability within 2 business
        days.
      </p>
    </div>
  );
}
