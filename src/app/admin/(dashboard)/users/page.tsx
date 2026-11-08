"use client";

import { useEffect, useState } from "react";
import { Trash2, Check, X, Clock } from "lucide-react";
import { Field, TextInput, Select } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { approveStaffUser, inviteStaffUser, listUsersAdmin, removeStaffProfile } from "@/lib/admin-data";
import type { StaffRole, StaffUser } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StaffUser[] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "editor" as StaffRole });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [invited, setInvited] = useState("");
  const [approvingRole, setApprovingRole] = useState<Record<string, StaffRole>>({});

  function refresh() {
    listUsersAdmin()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load users"));
  }

  useEffect(refresh, []);

  const pending = users?.filter((u) => u.role === "pending") ?? [];
  const staff = users?.filter((u) => u.role === "admin" || u.role === "editor") ?? [];

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSaving(true);
    setError("");
    setInvited("");
    try {
      await inviteStaffUser(form.name, form.email, form.role);
      setInvited(form.email);
      setForm({ name: "", email: "", role: "editor" });
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the invite — try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleApprove(uid: string) {
    await approveStaffUser(uid, approvingRole[uid] ?? "editor");
    refresh();
  }

  async function handleDeny(uid: string, name: string) {
    if (!confirm(`Deny access for ${name}? This removes their request.`)) return;
    await removeStaffProfile(uid);
    refresh();
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
        Invite someone by email below — no Firebase console steps needed. They&apos;ll get an email to set their
        password and sign in. People can also request access themselves at{" "}
        <code className="text-hot-deep">/admin/signup</code>, which you approve or deny below.
      </p>

      {error ? <p className="mt-4 text-sm font-semibold text-hot-deep">{error}</p> : null}
      {invited ? (
        <p className="mt-4 text-sm font-semibold text-hot-deep">
          Invited {invited} — they&apos;ll get an email shortly to set their password.
        </p>
      ) : null}

      {pending.length ? (
        <div className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Clock className="size-4 text-hot-deep" aria-hidden="true" />
            Pending requests ({pending.length})
          </h2>
          <div className="mt-3 space-y-3">
            {pending.map((u) => (
              <div
                key={u.uid}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hot-deep/30 bg-white p-4"
              >
                <div>
                  <p className="font-semibold text-ink">{u.name}</p>
                  <p className="text-sm text-ink/60">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={approvingRole[u.uid] ?? "editor"}
                    onChange={(e) => setApprovingRole((r) => ({ ...r, [u.uid]: e.target.value as StaffRole }))}
                    className="w-32"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </Select>
                  <Button type="button" onClick={() => handleApprove(u.uid)} size="md">
                    <Check className="size-4" /> Approve
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDeny(u.uid, u.name)}
                    className="focus-ring flex items-center gap-1 rounded-full border border-line-light px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink/60 hover:border-hot-deep hover:text-hot-deep"
                  >
                    <X className="size-4" /> Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <form onSubmit={handleInvite} className="mt-8 grid gap-4 rounded-xl border border-line-light bg-white p-6 sm:grid-cols-2">
        <p className="font-display text-sm font-bold text-ink sm:col-span-2">Invite by email</p>
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
            {saving ? "Sending invite…" : "Send invite"}
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
            {staff.map((u) => (
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
            {users && !staff.length ? (
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
