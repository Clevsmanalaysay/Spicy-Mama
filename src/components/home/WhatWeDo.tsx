import { Clapperboard, Megaphone, PartyPopper } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";

const tiles = [
  {
    icon: Clapperboard,
    title: "Film & Video Production",
    description: "Narrative features, short films and music videos — brief to delivery.",
    href: "/studio",
  },
  {
    icon: Megaphone,
    title: "Brand Collaborations",
    description: "Branded content and campaigns for brands that want a filmmaker's eye.",
    href: "/studio",
  },
  {
    icon: PartyPopper,
    title: "Venue & Events",
    description: "Our house, your stage — parties, launches, screenings and shoots.",
    href: "/venue",
  },
];

export function WhatWeDo() {
  return (
    <Section tone="raised">
      <SectionHeading eyebrow="What we do" title="Three ways to work with us." />
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {tiles.map((tile) => (
          <a
            key={tile.title}
            href={tile.href}
            className="focus-ring group flex flex-col gap-4 rounded-xl border border-line bg-ink p-6 transition-colors hover:border-hot"
          >
            <tile.icon className="size-8 text-hot" aria-hidden="true" />
            <h3 className="font-display text-xl font-bold text-paper group-hover:text-hot-bright">{tile.title}</h3>
            <p className="text-sm text-paper-dim">{tile.description}</p>
          </a>
        ))}
      </div>
    </Section>
  );
}
