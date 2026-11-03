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

