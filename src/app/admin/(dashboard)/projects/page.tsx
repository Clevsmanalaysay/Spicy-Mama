"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { deleteProject, listProjectsAdmin } from "@/lib/admin-data";
import type { Project } from "@/lib/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState("");

  function refresh() {
    listProjectsAdmin()
      .then(setProjects)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load projects"));
  }

  useEffect(refresh, []);

  async function handleDelete(p: Project) {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    try {
      await deleteProject(p.id);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete — try again.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Projects</h1>
        <LinkButton href="/work" size="md">
          <Plus className="size-4" /> Add on the live page
        </LinkButton>
      </div>
      <p className="mt-1 text-ink/60">
        Projects are edited directly on their live page — turn on <strong>Edit this page</strong> there. This is just
        an index, useful for finding drafts that aren&apos;t on the public Work page yet.
      </p>

      {error ? <p className="mt-6 text-sm font-semibold text-hot-deep">{error}</p> : null}

      <div className="mt-6 overflow-hidden rounded-xl border border-line-light bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line-light bg-paper-dim/20 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects?.map((p) => (
              <tr key={p.id} className="border-b border-line-light last:border-0 hover:bg-paper-dim/10">
                <td className="px-4 py-3 font-semibold text-ink">{p.title}</td>
                <td className="px-4 py-3 capitalize text-ink/70">{p.type.replace("-", " ")}</td>
                <td className="px-4 py-3 text-ink/70">{p.year}</td>
                <td className="px-4 py-3">
                  <span className={p.status === "published" ? "text-green-700" : "text-ink/50"}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-ink/70">{p.featuredOnHome ? "Yes" : ""}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/work/${p.slug}`} className="focus-ring inline-flex items-center gap-1 font-semibold text-hot-deep hover:underline">
                      Edit <ExternalLink className="size-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="focus-ring text-ink/40 hover:text-hot-deep"
                      aria-label={`Delete ${p.title}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects && !projects.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                  No projects yet — add your first one from the Work page.
                </td>
              </tr>
            ) : null}
            {!projects && !error ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                  Loading…
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
