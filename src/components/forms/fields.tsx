"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const inputClass =
  "focus-ring w-full rounded-lg border border-line-light bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40";
const labelClass = "font-display text-xs font-bold uppercase tracking-wide text-ink";

export function Field({
  label,
  htmlFor,
  error,
  required,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label} {required ? <span className="text-hot-deep">*</span> : null}
      </label>
      {hint ? <p className="mt-1 text-xs text-ink/60">{hint}</p> : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p role="alert" className="mt-1 text-xs font-semibold text-hot-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, "min-h-32 resize-y", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputClass, props.className)} />;
}

export function CheckboxGroup({
  name,
  options,
  values,
  onChange,
}: {
  name: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((opt) => {
        const id = `${name}-${opt}`;
        const checked = values.includes(opt);
        return (
          <label
            key={opt}
            htmlFor={id}
            className="focus-within:ring-2 focus-within:ring-hot flex items-center gap-2 rounded-lg border border-line-light bg-white px-3 py-2 text-sm text-ink"
          >
            <input
              id={id}
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                onChange(e.target.checked ? [...values, opt] : values.filter((v) => v !== opt));
              }}
              className="size-4 accent-[var(--color-hot-deep)]"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

export function HoneypotField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input id={id} type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
