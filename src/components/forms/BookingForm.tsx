"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Field, TextInput, TextArea, Select, CheckboxGroup, HoneypotField } from "./fields";
import { Button, LinkButton } from "@/components/ui/Button";
import { submitBookingRequest, NotConfiguredError } from "@/lib/actions";
import { bookingFormSchema } from "@/lib/validation";
import { addOnOptions, budgetRangeOptions, eventTypeOptions } from "@/lib/seed-data";

const initialState = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  date: "",
  backupDate: "",
  startTime: "",
  endTime: "",
  guests: "",
  addOns: [] as string[],
  budget: "",
  notes: "",
  agreeHouseRules: false,
  company_website: "",
};

export function BookingForm({ heldDates }: { heldDates: string[] }) {
  const formId = useId();
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = bookingFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    if (heldDates.includes(parsed.data.date)) {
      setErrors({ date: "That date is already held — pick another date, or contact us directly." });
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await submitBookingRequest(parsed.data);
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
        <h3 className="mt-4 font-display text-2xl font-bold">Request sent!</h3>
        <p className="mt-2 text-ink/70">We reply within 2 business days with availability and a quote.</p>
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
        <Field label="Phone" htmlFor={`${formId}-phone`} required error={errors.phone}>
          <TextInput id={`${formId}-phone`} type="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} required />
        </Field>
        <Field label="Event type" htmlFor={`${formId}-eventType`} required error={errors.eventType}>
          <Select id={`${formId}-eventType`} value={values.eventType} onChange={(e) => update("eventType", e.target.value)} required>
            <option value="">Choose one</option>
            {eventTypeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Preferred date" htmlFor={`${formId}-date`} required error={errors.date} hint="Booked/held dates are listed above.">
          <TextInput id={`${formId}-date`} type="date" value={values.date} onChange={(e) => update("date", e.target.value)} required />
        </Field>
        <Field label="Backup date" htmlFor={`${formId}-backupDate`} error={errors.backupDate}>
          <TextInput id={`${formId}-backupDate`} type="date" value={values.backupDate} onChange={(e) => update("backupDate", e.target.value)} />
        </Field>
        <Field label="Start time" htmlFor={`${formId}-startTime`} required error={errors.startTime}>
          <TextInput id={`${formId}-startTime`} type="time" value={values.startTime} onChange={(e) => update("startTime", e.target.value)} required />
        </Field>
        <Field label="End time" htmlFor={`${formId}-endTime`} required error={errors.endTime}>
          <TextInput id={`${formId}-endTime`} type="time" value={values.endTime} onChange={(e) => update("endTime", e.target.value)} required />
        </Field>
      </div>

      <Field label="Guest count" htmlFor={`${formId}-guests`} required error={errors.guests}>
        <TextInput
          id={`${formId}-guests`}
          type="number"
          min={1}
          value={values.guests}
          onChange={(e) => update("guests", e.target.value)}
          required
          className="sm:max-w-[10rem]"
        />
      </Field>

      <Field label="Add-ons" htmlFor={`${formId}-addOns`}>
        <CheckboxGroup name={`${formId}-addOns`} options={addOnOptions} values={values.addOns} onChange={(v) => update("addOns", v)} />
      </Field>

      <Field label="Budget" htmlFor={`${formId}-budget`} error={errors.budget}>
        <Select id={`${formId}-budget`} value={values.budget} onChange={(e) => update("budget", e.target.value)}>
          <option value="">Prefer not to say</option>
          {budgetRangeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Notes" htmlFor={`${formId}-notes`} error={errors.notes}>
        <TextArea id={`${formId}-notes`} value={values.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Vision, vendors, anything we should know." />
      </Field>

      <label htmlFor={`${formId}-rules`} className="flex items-start gap-3 text-sm text-ink">
        <input
          id={`${formId}-rules`}
          type="checkbox"
          checked={values.agreeHouseRules}
          onChange={(e) => update("agreeHouseRules", e.target.checked)}
          className="mt-0.5 size-4 accent-[var(--color-hot-deep)]"
          required
        />
        <span>
          I agree to the{" "}
          <Link href="#house-rules" className="font-semibold text-hot-deep underline">
            house rules &amp; policies
          </Link>
          .
        </span>
      </label>
      {errors.agreeHouseRules ? <p className="text-xs font-semibold text-hot-deep">{errors.agreeHouseRules}</p> : null}

      {status === "error" ? <p className="text-sm font-semibold text-hot-deep">{errorMessage}</p> : null}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Submit booking request"}
      </Button>
    </form>
  );
}
