"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";

type FormState = {
  name: string;
  bio: string;
  linksText: string;
};

export default function EditProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const router = useRouter();
  const { user, isLoading, refreshSessionUser } = useAuth();

  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", bio: "", linksText: "" });
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const foundUser = await userService.getUserByUsername(username);

      if (!foundUser) {
        setError("Profile not found.");
        setPageLoading(false);
        return;
      }

      setTargetUserId(foundUser.id);
      setForm({
        name: foundUser.name,
        bio: foundUser.bio,
        linksText: foundUser.links.join("\n"),
      });
      setPageLoading(false);
    };

    void loadProfile();
  }, [username]);

  const canEdit = useMemo(() => {
    return !!user && !!targetUserId && user.id === targetUserId;
  }, [targetUserId, user]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !targetUserId || user.id !== targetUserId) {
      setError("You do not have permission to edit this profile.");
      return;
    }

    const trimmedName = form.name.trim();
    const trimmedBio = form.bio.trim();

    if (!trimmedName || !trimmedBio) {
      setError("Name and bio are required.");
      return;
    }

    const links = form.linksText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    setSaving(true);
    setError(null);

    const updated = await userService.updateUserProfile(targetUserId, {
      name: trimmedName,
      bio: trimmedBio,
      links,
    });

    if (!updated) {
      setError("Could not save profile updates.");
      setSaving(false);
      return;
    }

    await refreshSessionUser();
    router.push(`/profile/${updated.username}`);
  };

  if (isLoading || pageLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <p className="text-[var(--color-muted)]">Loading editor...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Sign in required</h1>
          <p className="text-[var(--color-muted)]">You need to sign in to edit a profile.</p>
          <Link href="/auth/login" className="text-[var(--color-accent)]">
            Go to login
          </Link>
        </section>
      </main>
    );
  }

  if (!canEdit) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Access denied</h1>
          <p className="text-[var(--color-muted)]">Only profile owner can edit this page.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
      <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h1 className="text-3xl font-semibold text-[var(--color-text)]">Edit Profile</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
            Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
            Bio
            <textarea
              value={form.bio}
              onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
              rows={4}
              className="rounded-md border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)]"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
            External links (one per line)
            <textarea
              value={form.linksText}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, linksText: event.target.value }))
              }
              rows={4}
              className="rounded-md border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)]"
            />
          </label>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="min-h-11 rounded-full bg-[var(--color-accent)] px-5 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            <Link
              href={`/profile/${username}`}
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-border)] px-5 text-sm text-[var(--color-text)]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
