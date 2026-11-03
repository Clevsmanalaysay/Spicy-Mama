"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="focus-ring flex size-9 items-center justify-center rounded-full border border-line text-paper-dim transition-colors hover:border-hot hover:text-paper disabled:opacity-30 disabled:hover:border-line disabled:hover:text-paper-dim"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={cn(
            "focus-ring flex size-9 items-center justify-center rounded-full border font-display text-sm font-bold transition-colors",
            p === currentPage
              ? "border-hot bg-hot text-ink"
              : "border-line text-paper-dim hover:border-hot hover:text-paper",
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="focus-ring flex size-9 items-center justify-center rounded-full border border-line text-paper-dim transition-colors hover:border-hot hover:text-paper disabled:opacity-30 disabled:hover:border-line disabled:hover:text-paper-dim"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
