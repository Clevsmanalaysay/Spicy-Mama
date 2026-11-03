import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-ink pb-14 pt-20 sm:pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-hot-bright">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl">{title}</h1>
        {description ? <p className="mt-5 max-w-2xl text-base text-paper-dim sm:text-lg">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}
