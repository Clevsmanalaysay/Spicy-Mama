import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-hot/50 bg-hot/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-hot-bright",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function UnverifiedFlag({ children = "Unverified — confirm before launch" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded bg-yellow-300/90 px-2 py-0.5 text-xs font-semibold text-ink">
      {children}
    </span>
  );
}
