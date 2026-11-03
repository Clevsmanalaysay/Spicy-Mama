import { SparkleBullet } from "@/components/ui/SparkleDivider";

export function HouseRules({ rules }: { rules: string[] }) {
  return (
    <div id="house-rules">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">House rules &amp; policies</h2>
      <ul className="mt-6 space-y-3">
        {rules.map((rule) => (
          <li key={rule} className="flex items-start gap-2 text-sm text-paper-dim sm:text-base">
            <SparkleBullet className="mt-1" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
