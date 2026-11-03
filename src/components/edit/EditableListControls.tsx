"use client";

import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddItemButton({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-hot/40 p-6 font-display text-sm font-bold text-hot hover:border-hot hover:bg-hot/5",
        className,
      )}
    >
      <Plus className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}

export function RemoveItemButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="focus-ring absolute -right-2 -top-2 z-10 flex size-6 items-center justify-center rounded-full bg-hot text-ink shadow hover:bg-hot-bright"
    >
      <X className="size-3.5" />
    </button>
  );
}
