import { LinkButton } from "@/components/ui/Button";
import type { VenuePackage } from "@/lib/types";

export function Packages({ packages }: { packages: VenuePackage[] }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold sm:text-3xl">Packages &amp; pricing</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {packages.map((pkg) => (
          <div key={pkg.name} className="flex flex-col rounded-xl border border-line bg-ink-soft p-6">
            <h3 className="font-display text-xl font-bold text-paper">{pkg.name}</h3>
            <p className="mt-2 flex-1 text-sm text-paper-dim">{pkg.description}</p>
            <p className="mt-4 font-display text-sm font-bold text-hot-bright">{pkg.priceFrom ?? "Request a quote"}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <LinkButton href="#booking-form" variant="secondary">
          Request a quote
        </LinkButton>
      </div>
    </div>
  );
}
