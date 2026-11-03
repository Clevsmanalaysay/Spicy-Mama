"use client";

import Link from "next/link";
import { Pencil, Inbox, LayoutDashboard } from "lucide-react";
import { useEditMode } from "@/lib/edit-mode";
import { cn } from "@/lib/utils";

export function StaffEditBar() {
  const { ready, canEdit, editMode, setEditMode } = useEditMode();

  if (!ready || !canEdit) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <div className="flex items-center gap-3 rounded-full border border-line bg-ink/95 px-4 py-2 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className={cn(
            "focus-ring flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs font-bold uppercase tracking-wide transition-colors",
            editMode ? "bg-hot text-ink" : "text-paper hover:text-hot-bright",
          )}
          aria-pressed={editMode}
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          {editMode ? "Editing — click any highlighted content" : "Edit this page"}
        </button>
        <span className="h-5 w-px bg-line" aria-hidden="true" />
        <Link
          href="/admin/inbox"
          className="focus-ring flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-paper-dim hover:text-hot-bright"
        >
          <Inbox className="size-3.5" aria-hidden="true" />
          Inbox
        </Link>
        <Link
          href="/admin"
          className="focus-ring flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-paper-dim hover:text-hot-bright"
        >
          <LayoutDashboard className="size-3.5" aria-hidden="true" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
