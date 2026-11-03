"use client";

import { useEffect, useRef, useState } from "react";
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
 * jump), and it saves on blur. This is the core building block for
 * "edit the real page" admin UX — see lib/edit-mode.tsx.
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
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

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
    setEditing(false);
    if (draft !== value) {
      setSaving(true);
      try {
        await onSave(draft);
      } finally {
        setSaving(false);
      }
    }
  }

  if (!editing) {
    return (
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
    );
  }

  const commonProps = {
    ref: ref as never,
    value: draft,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
    onBlur: commit,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setDraft(value);
        setEditing(false);
      }
      if (e.key === "Enter" && !multiline) {
        e.preventDefault();
        (e.target as HTMLElement).blur();
      }
    },
    className: cn(className, "w-full rounded border-2 border-hot bg-ink-soft px-1 py-0.5 outline-none"),
  };

  return multiline ? <textarea {...commonProps} rows={3} /> : <input {...commonProps} type={type} />;
}
