"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { supabase } from "@/lib/supabase/client";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { refreshSessionUser } = useAuth();

  const [sessionEmail, setSessionEmail] = useState("");
  const [sessionUserId, setSessionUserId] = useState("");
  const [sessionLoading, setSessionLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/auth/login");
        return;
      }

      // If profile already exists, skip this page
      try {
        const existing = await userService.getUserById(session.user.id);
        if (existing) {
          router.replace("/gallery");
          return;
        }
      } catch {
        // proceed to show the form
      }

      setSessionEmail(session.user.email ?? "");
      setSessionUserId(session.user.id);
      setSessionLoading(false);
    };

    void checkSession();
  }, [router]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const normalizedUsername = username.trim().toLowerCase();

    if (!normalizedUsername || normalizedUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      setSubmitting(false);
      return;
    }

    if (!name.trim()) {
      setError("Display name is required.");
      setSubmitting(false);
      return;
    }

    try {
      await userService.createUser({
        nickname: normalizedUsername,
        name: name.trim(),
        email: sessionEmail,
        pictureUrl: pictureUrl.trim() || undefined,
        aboutMe: aboutMe.trim() || undefined,
        activityScore: 0,
      });

      await refreshSessionUser();
      router.push("/gallery");
    } catch {
      setError("Failed to create profile. Please try again.");
      setSubmitting(false);
    }
  };

  if (sessionLoading) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-8">
        <p className="text-sm text-[var(--color-muted)]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text)]">Complete Your Profile</h1>
        <p className="text-[var(--color-muted)]">
          Tell us a bit about yourself before you get started.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
              Username *
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
                autoComplete="username"
                required
                minLength={3}
                placeholder="e.g. paintmaster"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
              Display Name *
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
                autoComplete="name"
                required
                placeholder="e.g. John Smith"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
            Picture URL
            <input
              type="url"
              value={pictureUrl}
              onChange={(event) => setPictureUrl(event.target.value)}
              className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
              placeholder="https://..."
              autoComplete="photo"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
            About Me
            <textarea
              value={aboutMe}
              onChange={(event) => setAboutMe(event.target.value)}
              className="min-h-20 resize-none rounded-md border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)]"
              placeholder="Tell us about yourself and your miniature art..."
              maxLength={500}
            />
          </label>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="min-h-11 rounded-full bg-[var(--color-accent)] px-5 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>
    </main>
  );
}
