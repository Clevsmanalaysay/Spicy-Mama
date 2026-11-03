import { SparkleBullet } from "@/components/ui/SparkleDivider";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { VenueContent } from "@/lib/types";

export function TheSpace({ venue }: { venue: VenueContent }) {
  const photos = venue.gallery.length ? venue.gallery : Array(6).fill(undefined);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid grid-cols-3 gap-3">
        {photos.slice(0, 6).map((src: string | undefined, i: number) => (
          <PlaceholderMedia key={i} src={src} alt="The venue" seed={i} className="aspect-square rounded-lg" />
        ))}
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">The space</h2>
        <p className="mt-3 text-paper-dim">{venue.intro}</p>
        <div className="mt-6 flex gap-8">
          <div>
            <p className="font-display text-3xl font-bold text-hot-bright">{venue.capacityStanding}</p>
            <p className="text-xs uppercase tracking-wide text-paper-dim">Standing</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-hot-bright">{venue.capacitySeated}</p>
            <p className="text-xs uppercase tracking-wide text-paper-dim">Seated</p>
          </div>
        </div>
        <h3 className="mt-6 font-display text-sm font-bold uppercase tracking-wide text-paper">Amenities</h3>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {venue.amenities.map((a) => (
            <li key={a} className="flex items-center gap-2 text-sm text-paper-dim">
              <SparkleBullet />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
