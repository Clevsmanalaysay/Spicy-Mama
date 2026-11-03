"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Sparkle, Trash2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { Badge, UnverifiedFlag } from "@/components/ui/Badge";
import { TrailerEmbed } from "@/components/work/TrailerEmbed";
import { EditableImage } from "@/components/edit/EditableImage";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton, RemoveItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { deleteProject, patchProject } from "@/lib/admin-data";
import { useRouter } from "next/navigation";
import type { Credit, FestivalEntry, PressLink, Project, ProjectType } from "@/lib/types";

const typeLabels: Record<ProjectType, string> = {
  film: "Film",
  commercial: "Commercial",
  "music-video": "Music Video",
  collaboration: "Collaboration",
  event: "Event",
};

export function ProjectDetailEditor({ project: initial }: { project: Project }) {
  const router = useRouter();
  const { ready, canEdit, canPublish, editMode } = useEditMode();
  const [project, setProject] = useState(initial);

  const isDraft = project.status === "draft";
  if (isDraft && !ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Sparkle className="size-8 animate-sparkle fill-hot text-hot" aria-hidden="true" />
      </div>
    );
  }
  if (isDraft && !canEdit) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl font-bold">This project isn&apos;t published yet.</h1>
        <LinkButton href="/work" className="mt-6">
          Back to work
        </LinkButton>
      </div>
    );
  }

  function patch(data: Partial<Project>) {
    const next = { ...project, ...data };
    setProject(next);
    // Send the full merged object, not just the diff — this project may
    // only exist as seed data so far, and a partial first-time write would
    // create a Firestore doc missing fields (slug, status) later queries
    // filter on, making it invisible to the public site.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripping id, not using it
    const { id: _id, ...payload } = next;
    return patchProject(project.id, payload);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    await deleteProject(project.id);
    router.push("/work");
  }

  return (
    <>
      <Section tone="dark" className="pb-10 pt-20 sm:pt-28">
        <Link href="/work" className="focus-ring text-sm font-semibold text-paper-dim hover:text-hot">
          &larr; Back to work
        </Link>

        {editMode ? (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-hot/30 bg-ink-soft p-4">
            <select
              value={project.status}
              onChange={(e) => patch({ status: e.target.value as Project["status"] })}
              disabled={!canPublish}
              className="focus-ring rounded-full border border-line bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-paper disabled:opacity-50"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {!canPublish ? <span className="text-xs text-paper-dim">Only admins can publish</span> : null}
            <label className="flex items-center gap-2 text-xs font-semibold text-paper">
              Order
              <input
                type="number"
                value={project.order}
                onChange={(e) => patch({ order: Number(e.target.value) || 0 })}
                className="focus-ring w-16 rounded border border-line bg-ink px-2 py-1 text-paper"
              />
            </label>
            {canPublish ? (
              <button
                type="button"
                onClick={handleDelete}
                className="focus-ring ml-auto flex items-center gap-1 text-xs font-semibold text-hot-bright hover:underline"
              >
                <Trash2 className="size-3.5" /> Delete project
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {editMode ? (
            <select
              value={project.type}
              onChange={(e) => patch({ type: e.target.value as ProjectType })}
              className="focus-ring rounded-full border border-hot bg-ink-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-hot"
            >
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          ) : (
            <Badge>{typeLabels[project.type]}</Badge>
          )}
          <EditableText
            value={String(project.year)}
            onSave={(v) => patch({ year: Number(v) || project.year })}
            type="number"
            className="font-display text-sm font-bold text-paper-dim"
          />
          {project.unverified ? <UnverifiedFlag /> : null}
        </div>
        <EditableText
          value={project.title}
          onSave={(v) => patch({ title: v })}
          as="h1"
          className="mt-4 block max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl"
        />
        <EditableText
          value={project.logline}
          onSave={(v) => patch({ logline: v })}
          multiline
          as="p"
          className="mt-5 block max-w-2xl text-lg text-paper-dim"
        />

        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
          <div>
            <dt className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Spicy Mama&apos;s role</dt>
            <dd className="mt-1 text-sm text-paper">
              <EditableText value={project.role} onSave={(v) => patch({ role: v })} />
            </dd>
          </div>
          {editMode || project.format ? (
            <div>
              <dt className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Format</dt>
              <dd className="mt-1 text-sm text-paper">
                <EditableText value={project.format ?? ""} onSave={(v) => patch({ format: v })} placeholder="Add format" />
              </dd>
            </div>
          ) : null}
          {editMode || project.runtime ? (
            <div>
              <dt className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Runtime</dt>
              <dd className="mt-1 text-sm text-paper">
                <EditableText value={project.runtime ?? ""} onSave={(v) => patch({ runtime: v })} placeholder="Add runtime" />
              </dd>
            </div>
          ) : null}
          {editMode || project.genre ? (
            <div>
              <dt className="font-display text-xs font-bold uppercase tracking-wide text-hot-bright">Genre</dt>
              <dd className="mt-1 text-sm text-paper">
                <EditableText value={project.genre ?? ""} onSave={(v) => patch({ genre: v })} placeholder="Add genre" />
              </dd>
            </div>
          ) : null}
        </dl>
      </Section>

      <Section tone="dark" className="pt-0">
        {editMode ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl border border-line bg-ink-soft">
              <EditableImage
                src={project.posterUrl}
                alt={`${project.title} poster`}
                pathPrefix={`projects/${project.slug}/poster`}
                onSave={(url) => patch({ posterUrl: url })}
                fit="contain"
                className="h-full w-full"
              />
            </div>
            <EditableText
              value={project.trailerUrl ?? ""}
              onSave={(v) => patch({ trailerUrl: v })}
              placeholder="Trailer URL (YouTube or Vimeo)"
              className="w-full max-w-sm text-center text-sm text-paper-dim"
            />
          </div>
        ) : (
          <TrailerEmbed trailerUrl={project.trailerUrl} posterUrl={project.posterUrl} title={project.title} />
        )}
      </Section>

      <CreditsSection project={project} patch={patch} />
      <FestivalsAndPressSection project={project} patch={patch} />
      <GallerySection project={project} patch={patch} />
    </>
  );
}

function CreditsSection({ project, patch }: { project: Project; patch: (data: Partial<Project>) => void }) {
  const { editMode } = useEditMode();
  if (!editMode && !project.credits.length) return null;

  function update(credits: Credit[]) {
    patch({ credits });
  }

  return (
    <Section tone="raised">
      <SectionHeading eyebrow="Credits" title="Who made it" />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {project.credits.map((credit, i) => (
          <li key={i} className="relative rounded-lg border border-line bg-ink p-4">
            {editMode ? (
              <>
                <RemoveItemButton onClick={() => update(project.credits.filter((_, idx) => idx !== i))} label="Remove credit" />
                <EditableText
                  value={credit.name}
                  onSave={(v) => update(project.credits.map((c, idx) => (idx === i ? { ...c, name: v } : c)))}
                  className="block font-display text-base font-bold text-paper"
                />
                <EditableText
                  value={credit.role}
                  onSave={(v) => update(project.credits.map((c, idx) => (idx === i ? { ...c, role: v } : c)))}
                  placeholder="Role"
                  className="mt-0.5 block text-sm text-paper-dim"
                />
              </>
            ) : (
              <>
                <p className="font-display text-base font-bold text-paper">{credit.name}</p>
                <p className="text-sm text-paper-dim">{credit.role}</p>
              </>
            )}
          </li>
        ))}
      </ul>
      {editMode ? (
        <AddItemButton
          onClick={() => update([...project.credits, { name: "New credit", role: "Role" }])}
          label="Add credit"
          className="mt-4 w-full"
        />
      ) : null}
    </Section>
  );
}

function FestivalsAndPressSection({ project, patch }: { project: Project; patch: (data: Partial<Project>) => void }) {
  const { editMode } = useEditMode();
  if (!editMode && !project.festivals.length && !project.pressLinks.length) return null;

  function updateFestivals(festivals: FestivalEntry[]) {
    patch({ festivals });
  }
  function updatePress(pressLinks: PressLink[]) {
    patch({ pressLinks });
  }

  return (
    <Section tone="dark">
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold">Festivals &amp; screenings</h2>
          <ul className="mt-4 space-y-3">
            {project.festivals.map((f, i) => (
              <li key={i} className="text-sm text-paper-dim">
                {editMode ? (
                  <div className="relative grid grid-cols-2 gap-2 rounded-lg border border-line p-3">
                    <RemoveItemButton onClick={() => updateFestivals(project.festivals.filter((_, idx) => idx !== i))} label="Remove entry" />
                    <EditableText value={f.name} onSave={(v) => updateFestivals(project.festivals.map((x, idx) => (idx === i ? { ...x, name: v } : x)))} placeholder="Name" className="text-paper" />
                    <EditableText value={f.result ?? ""} onSave={(v) => updateFestivals(project.festivals.map((x, idx) => (idx === i ? { ...x, result: v } : x)))} placeholder="Result" />
                    <EditableText value={f.year ?? ""} onSave={(v) => updateFestivals(project.festivals.map((x, idx) => (idx === i ? { ...x, year: v } : x)))} placeholder="Year" />
                    <EditableText value={f.link ?? ""} onSave={(v) => updateFestivals(project.festivals.map((x, idx) => (idx === i ? { ...x, link: v } : x)))} placeholder="Link" />
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-paper">{f.name}</span>
                    {f.year ? ` · ${f.year}` : ""}
                    {f.result ? ` · ${f.result}` : ""}
                    {f.link ? (
                      <a href={f.link} target="_blank" rel="noopener noreferrer" className="focus-ring ml-2 text-hot-bright hover:underline">
                        <ExternalLink className="inline size-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                  </>
                )}
              </li>
            ))}
          </ul>
          {editMode ? (
            <AddItemButton
              onClick={() => updateFestivals([...project.festivals, { name: "New entry" }])}
              label="Add festival"
              className="mt-3 w-full py-2"
            />
          ) : null}
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Press</h2>
          <ul className="mt-4 space-y-3">
            {project.pressLinks.map((p, i) => (
              <li key={i} className="text-sm">
                {editMode ? (
                  <div className="relative grid grid-cols-1 gap-2 rounded-lg border border-line p-3">
                    <RemoveItemButton onClick={() => updatePress(project.pressLinks.filter((_, idx) => idx !== i))} label="Remove link" />
                    <EditableText value={p.title} onSave={(v) => updatePress(project.pressLinks.map((x, idx) => (idx === i ? { ...x, title: v } : x)))} placeholder="Title" className="text-paper" />
                    <EditableText value={p.outlet ?? ""} onSave={(v) => updatePress(project.pressLinks.map((x, idx) => (idx === i ? { ...x, outlet: v } : x)))} placeholder="Outlet" />
                    <EditableText value={p.url} onSave={(v) => updatePress(project.pressLinks.map((x, idx) => (idx === i ? { ...x, url: v } : x)))} placeholder="URL" />
                  </div>
                ) : (
                  <>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="focus-ring font-semibold text-hot-bright underline hover:text-hot">
                      {p.title}
                    </a>
                    {p.outlet ? <span className="text-paper-dim"> &middot; {p.outlet}</span> : null}
                  </>
                )}
              </li>
            ))}
          </ul>
          {editMode ? (
            <AddItemButton
              onClick={() => updatePress([...project.pressLinks, { title: "New link", url: "" }])}
              label="Add press link"
              className="mt-3 w-full py-2"
            />
          ) : null}
        </div>
      </div>
    </Section>
  );
}

function GallerySection({ project, patch }: { project: Project; patch: (data: Partial<Project>) => void }) {
  const { editMode } = useEditMode();
  const images = project.gallery.length ? project.gallery : editMode ? [] : Array(4).fill(undefined);

  function update(i: number, src: string) {
    const gallery = [...project.gallery];
    gallery[i] = src;
    patch({ gallery });
  }

  return (
    <Section tone="raised">
      <h2 className="font-display text-2xl font-bold">Stills</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((src: string | undefined, i: number) => (
          <div key={i} className="relative">
            {editMode ? (
              <RemoveItemButton onClick={() => patch({ gallery: project.gallery.filter((_, idx) => idx !== i) })} label="Remove still" />
            ) : null}
            <EditableImage
              src={src}
              alt={`${project.title} still ${i + 1}`}
              seed={i + 3}
              pathPrefix={`projects/${project.slug}/stills`}
              onSave={(url) => update(i, url)}
              className="aspect-[4/5] rounded-lg"
            />
          </div>
        ))}
        {editMode ? (
          <label className="focus-ring flex aspect-[4/5] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-hot/40 font-display text-xs font-bold text-hot hover:border-hot">
            + Add still
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const { uploadImage } = await import("@/lib/admin-data");
                const url = await uploadImage(file, `projects/${project.slug}/stills`);
                patch({ gallery: [...project.gallery, url] });
              }}
            />
          </label>
        ) : null}
      </div>
    </Section>
  );
}
