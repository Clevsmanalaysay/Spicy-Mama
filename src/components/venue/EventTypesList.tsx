import { Cake, PartyPopper, Rocket, Clapperboard, Presentation, Camera } from "lucide-react";

const types = [
  { icon: Cake, label: "Birthdays" },
  { icon: PartyPopper, label: "Private parties" },
  { icon: Rocket, label: "Launches" },
  { icon: Clapperboard, label: "Screenings" },
  { icon: Presentation, label: "Workshops" },
  { icon: Camera, label: "Photo & video shoots" },
];

export function EventTypesList() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {types.map((t) => (
        <li
          key={t.label}
          className="flex flex-col items-center gap-2 rounded-lg border border-line bg-ink-soft px-3 py-5 text-center"
        >
          <t.icon className="size-6 text-hot" aria-hidden="true" />
          <span className="font-display text-xs font-bold uppercase tracking-wide text-paper">{t.label}</span>
        </li>
      ))}
    </ul>
  );
}
