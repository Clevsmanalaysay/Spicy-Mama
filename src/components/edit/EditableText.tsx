"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { useEditMode } from "@/lib/edit-mode";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (next: string) => Promise<unknown> | void;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
  type?: "text" | "number";
  placeholder?: string;
}

/**
 * Renders plain content when not in edit mode. In edit mode, click turns it
 * into an input/textarea in place (same tag/classes, so layout doesn't
 * jump). Saves on blur or Enter, with explicit check/x buttons too (people
 * expect a visible save action, not just "click away"). Firestore write
 * failures are shown inline instead of failing silently — the optimistic
 * local update elsewhere in the app would otherwise make a failed save look
 * like it worked until the next reload.
 */
export function EditableText({
  value,
  onSave,
  as: Tag = "span",
  className,
  multiline = false,
  type = "text",
  placeholder = "Click to edit",
}: EditableTextProps) {
  const { canEdit, editMode } = useEditMode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const committingRef = useRef(false);

  // Keep the draft in sync when `value` changes externally (e.g. a re-fetch),
  // without touching it while the user is mid-edit. Adjusted during render
  // (React's documented pattern for this) rather than in an effect.
  const [lastSeenValue, setLastSeenValue] = useState(value);
  if (value !== lastSeenValue && !editing) {
    setLastSeenValue(value);
    setDraft(value);
  }

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  if (!canEdit || !editMode) {
    return <Tag className={className}>{value || null}</Tag>;
  }

  async function commit() {
    if (committingRef.current) return;
    committingRef.current = true;
    setEditing(false);
    if (draft !== value) {
      setSaving(true);
      setError("");
      try {
        await onSave(draft);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't save — try again.");
      } finally {
        setSaving(false);
      }
    }
    committingRef.current = false;
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
    setError("");
  }

  // className often includes "block" (e.g. a title/paragraph meant to take
  // its own line) — but the wrapper spans below used to be hardcoded
  // inline-block/inline-flex regardless, so two adjacent block-intended
  // fields (like a FAQ question and its answer) would flow side by side
  // instead of stacking, and a width-constrained textarea would look
  // cramped and mismatched against the full-width rendered text. Matching
  // the wrapper's display to what the caller actually asked for fixes both.
  const isBlock = className?.split(/\s+/).includes("block");

  if (!editing) {
    return (
      <span className={cn(isBlock ? "block" : "inline-block", "max-w-full align-top")}>
        <Tag
          className={cn(
            className,
            "focus-ring cursor-text rounded outline-dashed outline-1 outline-offset-2 outline-hot/40 transition-colors hover:bg-hot/10 hover:outline-hot",
            saving && "opacity-50",
          )}
          onClick={() => setEditing(true)}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setEditing(true);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {value || <span className="italic text-hot/60">{placeholder}</span>}
        </Tag>
        {error ? <span className="block text-xs font-semibold text-red-500">⚠ {error}</span> : null}
      </span>
    );
  }

  const commonProps = {
    ref: ref as never,
    value: draft,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
    onBlur: commit,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
      if (e.key === "Enter" && !multiline) {
        e.preventDefault();
        commit();
      }
    },
    className: cn(className, "w-full min-w-0 rounded border-2 border-hot bg-ink-soft px-1 py-0.5 outline-none"),
  };

  return (
    <span className={cn(isBlock ? "flex" : "inline-flex", "max-w-full items-start gap-1 align-top")}>
      {multiline ? <textarea {...commonProps} rows={3} /> : <input {...commonProps} type={type} />}
      <span className="flex shrink-0 gap-0.5">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={commit}
          aria-label="Save"
          className="focus-ring flex size-6 items-center justify-center rounded bg-hot text-ink hover:bg-hot-bright"
        >
          <Check className="size-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={cancel}
          aria-label="Cancel"
          className="focus-ring flex size-6 items-center justify-center rounded bg-ink text-paper hover:bg-ink-raised"
        >
          <X className="size-3.5" />
        </button>
      </span>
    </span>
  );
}
