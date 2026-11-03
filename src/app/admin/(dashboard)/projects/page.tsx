"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { listProjectsAdmin } from "@/lib/admin-data";
import type { Project } from "@/lib/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listProjectsAdmin()
      .then(setProjects)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load projects"));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Projects</h1>
        <LinkButton href="/admin/projects/new" size="md">
          <Plus className="size-4" /> New project
        </LinkButton>
      </div>

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
            </tr>
          </thead>
          <tbody>
            {projects?.map((p) => (
              <tr key={p.id} className="border-b border-line-light last:border-0 hover:bg-paper-dim/10">
                <td className="px-4 py-3">
                  <Link href={`/admin/projects/${p.id}`} className="focus-ring font-semibold text-ink hover:text-hot-deep">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize text-ink/70">{p.type.replace("-", " ")}</td>
                <td className="px-4 py-3 text-ink/70">{p.year}</td>
                <td className="px-4 py-3">
                  <span className={p.status === "published" ? "text-green-700" : "text-ink/50"}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-ink/70">{p.featuredOnHome ? "Yes" : ""}</td>
              </tr>
            ))}
            {projects && !projects.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
                  No projects yet — add your first one.
                </td>
              </tr>
            ) : null}
            {!projects && !error ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
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
