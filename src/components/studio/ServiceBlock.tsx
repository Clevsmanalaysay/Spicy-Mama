import Link from "next/link";
import { SparkleBullet } from "@/components/ui/SparkleDivider";
import type { Project, Service } from "@/lib/types";

export function ServiceBlock({ service, relatedProjects }: { service: Service; relatedProjects: Project[] }) {
  return (
    <div className="rounded-xl border border-line bg-ink-soft p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold text-paper sm:text-2xl">{service.name}</h3>
      <p className="mt-2 text-sm text-paper-dim sm:text-base">{service.description}</p>
      <ul className="mt-4 space-y-2">
        {service.deliverables.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-paper">
            <SparkleBullet className="mt-1" />
            {item}
          </li>
        ))}
      </ul>
      {relatedProjects.length ? (
        <p className="mt-5 text-sm text-paper-dim">
          Related work:{" "}
          {relatedProjects.map((p, i) => (
            <span key={p.id}>
              <Link href={`/work/${p.slug}`} className="focus-ring font-semibold text-hot-bright hover:underline">
                {p.title}
              </Link>
              {i < relatedProjects.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
