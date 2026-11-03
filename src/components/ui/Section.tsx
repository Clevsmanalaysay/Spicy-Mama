import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light" | "raised";
  id?: string;
  as?: "section" | "div";
}

const tones = {
  dark: "bg-ink text-paper",
  light: "bg-paper text-ink",
  raised: "bg-ink-soft text-paper",
};

export function Section({ children, className, tone = "dark", id, as = "section" }: SectionProps) {
  const Tag = as;
  return (
    <Tag id={id} className={cn(tones[tone], "py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </Tag>
  );
}

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p
      className={cn(
        "font-display text-xs font-bold uppercase tracking-[0.2em]",
        tone === "dark" ? "text-hot-bright" : "text-hot-deep",
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      {description ? (
        <p className={cn("mt-4 text-base sm:text-lg", tone === "dark" ? "text-paper-dim" : "text-ink/70")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
