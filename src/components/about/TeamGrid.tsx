import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { TeamMember } from "@/lib/types";

export function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((member, i) => (
        <div key={member.id} className="rounded-xl border border-line bg-ink-soft p-5">
          <PlaceholderMedia
            src={member.photoUrl}
            alt={member.name}
            seed={i}
            className="aspect-square w-full rounded-lg"
          />
          <h3 className="mt-4 font-display text-lg font-bold text-paper">{member.name}</h3>
          <p className="text-sm font-semibold text-hot-bright">{member.role}</p>
          <p className="mt-2 text-sm text-paper-dim">{member.bio}</p>
        </div>
      ))}
    </div>
  );
}
