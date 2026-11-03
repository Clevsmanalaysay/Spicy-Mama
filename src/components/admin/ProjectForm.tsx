"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, TextInput, TextArea, Select } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "./ImageUploadField";
import { MultiImageUploadField } from "./MultiImageUploadField";
import { deleteProject, saveProject } from "@/lib/admin-data";
import type { Credit, FestivalEntry, PressLink, Project, ProjectType } from "@/lib/types";

const typeOptions: { value: ProjectType; label: string }[] = [
  { value: "film", label: "Film" },
  { value: "commercial", label: "Commercial" },
  { value: "music-video", label: "Music Video" },
  { value: "collaboration", label: "Collaboration" },
  { value: "event", label: "Event" },
];

function emptyProject(): Omit<Project, "id"> {
  return {
    slug: "",
    title: "",
    type: "film",
    year: new Date().getFullYear(),
    format: "",
    runtime: "",
    genre: "",
    logline: "",
    role: "",
    posterUrl: undefined,
    trailerUrl: "",
    credits: [],
    festivals: [],
    pressLinks: [],
    gallery: [],
    featuredOnHome: false,
    order: 50,
    status: "draft",
  };
}

export function ProjectForm({ projectId, initial }: { projectId: string | null; initial?: Project }) {
  const router = useRouter();
  const [values, setValues] = useState<Omit<Project, "id">>(initial ?? emptyProject());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof Omit<Project, "id">>(key: K, value: Omit<Project, "id">[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSave(status: "draft" | "published") {
    setSaving(true);
    setError("");
    try {
      const id = await saveProject(projectId, { ...values, status });
      router.push("/admin/projects");
      router.refresh();
      void id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save — try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!projectId) return;
    if (!confirm(`Delete "${values.title}"? This can't be undone.`)) return;
    await deleteProject(projectId);
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Basics</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Title" htmlFor="title" required>
            <TextInput id="title" value={values.title} onChange={(e) => update("title", e.target.value)} required />
          </Field>
          <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate from the title">
            <TextInput id="slug" value={values.slug} onChange={(e) => update("slug", e.target.value)} placeholder="auto-generated" />
          </Field>
          <Field label="Type" htmlFor="type" required>
            <Select id="type" value={values.type} onChange={(e) => update("type", e.target.value as ProjectType)}>
              {typeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Year" htmlFor="year" required>
            <TextInput id="year" type="number" value={values.year} onChange={(e) => update("year", Number(e.target.value))} required />
          </Field>
          <Field label="Format" htmlFor="format">
            <TextInput id="format" value={values.format ?? ""} onChange={(e) => update("format", e.target.value)} placeholder="Feature, Short, Spot…" />
          </Field>
          <Field label="Runtime" htmlFor="runtime">
            <TextInput id="runtime" value={values.runtime ?? ""} onChange={(e) => update("runtime", e.target.value)} placeholder="e.g. 24 min" />
          </Field>
          <Field label="Genre" htmlFor="genre">
            <TextInput id="genre" value={values.genre ?? ""} onChange={(e) => update("genre", e.target.value)} />
          </Field>
          <Field label="Spicy Mama's role" htmlFor="role" required>
            <TextInput id="role" value={values.role} onChange={(e) => update("role", e.target.value)} placeholder="Production company, Line producer…" />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Logline" htmlFor="logline" required>
            <TextArea id="logline" value={values.logline} onChange={(e) => update("logline", e.target.value)} required />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Poster &amp; trailer</h2>
        <div className="mt-4 flex flex-wrap items-start gap-8">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-wide text-ink">Poster</p>
            <div className="mt-2">
              <ImageUploadField value={values.posterUrl} onChange={(url) => update("posterUrl", url)} pathPrefix={`projects/${values.slug || "new"}/poster`} label="Poster" />
            </div>
          </div>
          <div className="min-w-64 flex-1">
            <Field label="Trailer URL" htmlFor="trailerUrl" hint="YouTube or Vimeo link">
              <TextInput id="trailerUrl" value={values.trailerUrl ?? ""} onChange={(e) => update("trailerUrl", e.target.value)} placeholder="https://youtube.com/watch?v=…" />
            </Field>
          </div>
        </div>
      </div>

      <RepeatableCredits credits={values.credits} onChange={(credits) => update("credits", credits)} />
      <RepeatableFestivals festivals={values.festivals} onChange={(festivals) => update("festivals", festivals)} />
      <RepeatablePress pressLinks={values.pressLinks} onChange={(pressLinks) => update("pressLinks", pressLinks)} />

      <div className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Stills gallery</h2>
        <div className="mt-4">
          <MultiImageUploadField value={values.gallery} onChange={(gallery) => update("gallery", gallery)} pathPrefix={`projects/${values.slug || "new"}/stills`} />
        </div>
      </div>

      <div className="rounded-xl border border-line-light bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Publishing</h2>
        <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            checked={values.featuredOnHome}
            onChange={(e) => update("featuredOnHome", e.target.checked)}
            className="size-4 accent-[var(--color-hot-deep)]"
          />
          Feature on homepage
        </label>
        <div className="mt-4 max-w-[10rem]">
          <Field label="Order (lower = first / pinned)" htmlFor="order">
            <TextInput id="order" type="number" value={values.order} onChange={(e) => update("order", Number(e.target.value))} />
          </Field>
        </div>
      </div>

      {error ? <p className="text-sm font-semibold text-hot-deep">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => handleSave("draft")} variant="secondary" disabled={saving}>
          Save draft
        </Button>
        <Button type="button" onClick={() => handleSave("published")} disabled={saving}>
          {saving ? "Saving…" : "Publish"}
        </Button>
        {projectId ? (
          <button
            type="button"
            onClick={handleDelete}
            className="focus-ring ml-auto flex items-center gap-1 text-sm font-semibold text-hot-deep hover:underline"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete project
          </button>
        ) : null}
      </div>
    </div>
  );
}

function RepeatableCredits({ credits, onChange }: { credits: Credit[]; onChange: (c: Credit[]) => void }) {
  return (
    <div className="rounded-xl border border-line-light bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Credits</h2>
        <button
          type="button"
          onClick={() => onChange([...credits, { name: "", role: "" }])}
          className="focus-ring flex items-center gap-1 text-sm font-semibold text-hot-deep hover:underline"
        >
          <Plus className="size-4" /> Add credit
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {credits.map((credit, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3">
            <div className="min-w-40 flex-1">
              <Field label="Name" htmlFor={`credit-name-${i}`}>
                <TextInput
                  id={`credit-name-${i}`}
                  value={credit.name}
                  onChange={(e) => onChange(credits.map((c, idx) => (idx === i ? { ...c, name: e.target.value } : c)))}
                />
              </Field>
            </div>
            <div className="min-w-40 flex-1">
              <Field label="Role" htmlFor={`credit-role-${i}`}>
                <TextInput
                  id={`credit-role-${i}`}
                  value={credit.role}
                  onChange={(e) => onChange(credits.map((c, idx) => (idx === i ? { ...c, role: e.target.value } : c)))}
                  placeholder="Director, Cast, Key crew, Partner…"
                />
              </Field>
            </div>
            <button type="button" onClick={() => onChange(credits.filter((_, idx) => idx !== i))} className="focus-ring p-2 text-ink/40 hover:text-hot-deep" aria-label="Remove credit">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {!credits.length ? <p className="text-sm text-ink/50">No credits added yet.</p> : null}
      </div>
    </div>
  );
}

function RepeatableFestivals({ festivals, onChange }: { festivals: FestivalEntry[]; onChange: (f: FestivalEntry[]) => void }) {
  return (
    <div className="rounded-xl border border-line-light bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Festivals, screenings &amp; awards</h2>
        <button
          type="button"
          onClick={() => onChange([...festivals, { name: "", result: "", year: "", link: "" }])}
          className="focus-ring flex items-center gap-1 text-sm font-semibold text-hot-deep hover:underline"
        >
          <Plus className="size-4" /> Add entry
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {festivals.map((f, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 rounded-lg border border-line-light p-3 sm:grid-cols-5">
            <TextInput placeholder="Festival/award name" value={f.name} onChange={(e) => onChange(festivals.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))} />
            <TextInput placeholder="Result" value={f.result ?? ""} onChange={(e) => onChange(festivals.map((x, idx) => (idx === i ? { ...x, result: e.target.value } : x)))} />
            <TextInput placeholder="Year" value={f.year ?? ""} onChange={(e) => onChange(festivals.map((x, idx) => (idx === i ? { ...x, year: e.target.value } : x)))} />
            <TextInput placeholder="Link" value={f.link ?? ""} onChange={(e) => onChange(festivals.map((x, idx) => (idx === i ? { ...x, link: e.target.value } : x)))} />
            <button type="button" onClick={() => onChange(festivals.filter((_, idx) => idx !== i))} className="focus-ring justify-self-start p-2 text-ink/40 hover:text-hot-deep" aria-label="Remove entry">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {!festivals.length ? <p className="text-sm text-ink/50">No festivals added yet.</p> : null}
      </div>
    </div>
  );
}

function RepeatablePress({ pressLinks, onChange }: { pressLinks: PressLink[]; onChange: (p: PressLink[]) => void }) {
  return (
    <div className="rounded-xl border border-line-light bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Press links</h2>
        <button
          type="button"
          onClick={() => onChange([...pressLinks, { title: "", outlet: "", url: "" }])}
          className="focus-ring flex items-center gap-1 text-sm font-semibold text-hot-deep hover:underline"
        >
          <Plus className="size-4" /> Add link
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {pressLinks.map((p, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 rounded-lg border border-line-light p-3 sm:grid-cols-4">
            <TextInput placeholder="Title" value={p.title} onChange={(e) => onChange(pressLinks.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))} />
            <TextInput placeholder="Outlet" value={p.outlet ?? ""} onChange={(e) => onChange(pressLinks.map((x, idx) => (idx === i ? { ...x, outlet: e.target.value } : x)))} />
            <TextInput placeholder="URL" value={p.url} onChange={(e) => onChange(pressLinks.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))} />
            <button type="button" onClick={() => onChange(pressLinks.filter((_, idx) => idx !== i))} className="focus-ring justify-self-start p-2 text-ink/40 hover:text-hot-deep" aria-label="Remove link">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {!pressLinks.length ? <p className="text-sm text-ink/50">No press links added yet.</p> : null}
      </div>
    </div>
  );
}
