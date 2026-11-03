"use client";

import { useId, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Field, TextInput, TextArea, Select, HoneypotField } from "./fields";
import { Button, LinkButton } from "@/components/ui/Button";
import { submitContactMessage, NotConfiguredError } from "@/lib/actions";
import { contactFormSchema } from "@/lib/validation";
import { budgetRangeOptions, inquiryTypeOptions } from "@/lib/seed-data";

function makeInitialState(defaultInquiryType: string) {
  return {
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: defaultInquiryType,
    budgetRange: "",
    timeline: "",
    message: "",
    consent: false,
    company_website: "",
  };
}

export function ContactForm({ defaultInquiryType = "" }: { defaultInquiryType?: string }) {
  const formId = useId();
  const [values, setValues] = useState(() => makeInitialState(defaultInquiryType));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof ReturnType<typeof makeInitialState>>(
    key: K,
    value: ReturnType<typeof makeInitialState>[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await submitContactMessage(parsed.data);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof NotConfiguredError ? err.message : "Something went wrong — please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-line-light bg-white p-8 text-center text-ink">
        <CheckCircle2 className="mx-auto size-10 text-hot-deep" aria-hidden="true" />
        <h3 className="mt-4 font-display text-2xl font-bold">Message sent!</h3>
        <p className="mt-2 text-ink/70">We reply within 2 business days.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href="/work" variant="secondary">
            See our work
          </LinkButton>
          <LinkButton href="https://www.instagram.com/spicymamastudio/" target="_blank" rel="noopener noreferrer">
            Follow on Instagram
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-line-light bg-white p-6 sm:p-8" noValidate>
      <HoneypotField value={values.company_website} onChange={(v) => update("company_website", v)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor={`${formId}-name`} required error={errors.name}>
          <TextInput id={`${formId}-name`} value={values.name} onChange={(e) => update("name", e.target.value)} required />
        </Field>
        <Field label="Email" htmlFor={`${formId}-email`} required error={errors.email}>
          <TextInput id={`${formId}-email`} type="email" value={values.email} onChange={(e) => update("email", e.target.value)} required />
        </Field>
        <Field label="Phone" htmlFor={`${formId}-phone`} error={errors.phone}>
          <TextInput id={`${formId}-phone`} type="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} />
        </Field>
        <Field label="Company / brand" htmlFor={`${formId}-company`} error={errors.company}>
          <TextInput id={`${formId}-company`} value={values.company} onChange={(e) => update("company", e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Inquiry type" htmlFor={`${formId}-inquiryType`} required error={errors.inquiryType}>
          <Select
            id={`${formId}-inquiryType`}
            value={values.inquiryType}
            onChange={(e) => update("inquiryType", e.target.value)}
            required
          >
            <option value="">Choose one</option>
            {inquiryTypeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Budget range" htmlFor={`${formId}-budgetRange`} error={errors.budgetRange}>
          <Select id={`${formId}-budgetRange`} value={values.budgetRange} onChange={(e) => update("budgetRange", e.target.value)}>
            <option value="">Prefer not to say</option>
            {budgetRangeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Timeline" htmlFor={`${formId}-timeline`} error={errors.timeline} hint="e.g. Shoot date, launch date, event date">
        <TextInput id={`${formId}-timeline`} value={values.timeline} onChange={(e) => update("timeline", e.target.value)} />
      </Field>

      <Field label="Message" htmlFor={`${formId}-message`} required error={errors.message}>
        <TextArea
          id={`${formId}-message`}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us about the project, the brand, or the story you want to tell."
          required
        />
      </Field>

      <label htmlFor={`${formId}-consent`} className="flex items-start gap-3 text-sm text-ink">
        <input
          id={`${formId}-consent`}
          type="checkbox"
          checked={values.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-0.5 size-4 accent-[var(--color-hot-deep)]"
          required
        />
        <span>I consent to Spicy Mama Creative Studio contacting me about this inquiry.</span>
      </label>
      {errors.consent ? <p className="text-xs font-semibold text-hot-deep">{errors.consent}</p> : null}

      {status === "error" ? <p className="text-sm font-semibold text-hot-deep">{errorMessage}</p> : null}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
