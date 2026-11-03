"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Field, TextInput, Select } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { listUsersAdmin, removeStaffProfile, upsertStaffProfile } from "@/lib/admin-data";
import type { StaffRole, StaffUser } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StaffUser[] | null>(null);
  const [form, setForm] = useState({ uid: "", name: "", email: "", role: "editor" as StaffRole });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function refresh() {
    listUsersAdmin()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load users"));
  }

  useEffect(refresh, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.uid || !form.name || !form.email) return;
    setSaving(true);
    try {
      await upsertStaffProfile(form.uid, { name: form.name, email: form.email, role: form.role });
      setForm({ uid: "", name: "", email: "", role: "editor" });
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save — try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(uid: string) {
    if (!confirm("Remove this person's dashboard access?")) return;
    await removeStaffProfile(uid);
    refresh();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Staff users</h1>
      <p className="mt-1 text-ink/60">
        Create the person&apos;s sign-in first in the Firebase console (Authentication → Add user), then grant them a
        role here using their UID.
      </p>

      {error ? <p className="mt-4 text-sm font-semibold text-hot-deep">{error}</p> : null}

      <form onSubmit={handleAdd} className="mt-6 grid gap-4 rounded-xl border border-line-light bg-white p-6 sm:grid-cols-2">
        <Field label="Firebase Auth UID" htmlFor="uid" required>
          <TextInput id="uid" value={form.uid} onChange={(e) => setForm({ ...form, uid: e.target.value })} required />
        </Field>
        <Field label="Name" htmlFor="name" required>
          <TextInput id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <TextInput id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </Field>
        <Field label="Role" htmlFor="role" required>
          <Select id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })}>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Grant access"}
          </Button>
        </div>
      </form>

      <div className="mt-8 overflow-hidden rounded-xl border border-line-light bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line-light bg-paper-dim/20 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.uid} className="border-b border-line-light last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{u.name}</td>
                <td className="px-4 py-3 text-ink/70">{u.email}</td>
                <td className="px-4 py-3 capitalize text-ink/70">{u.role}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => handleRemove(u.uid)} className="focus-ring text-ink/40 hover:text-hot-deep" aria-label={`Remove ${u.name}`}>
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            {users && !users.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink/50">
                  No staff users yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
