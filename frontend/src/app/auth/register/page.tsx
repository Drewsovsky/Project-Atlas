"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const getSafeReturnTo = (value: string | null): string => {
  if (!value) {
    return "/gallery";
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/gallery";
};

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const returnTo = useMemo(
    () => getSafeReturnTo(searchParams.get("returnTo")),
    [searchParams],
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    if (!name.trim()) {
      setError("Name is required.");
      setSubmitting(false);
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      setSubmitting(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setSubmitting(false);
      return;
    }

    const registerError = await register(username, password, {
      name,
      email,
      pictureUrl: pictureUrl.trim() || undefined,
      aboutMe: aboutMe.trim() || undefined,
    });

    if (registerError) {
      setError(registerError);
      setSubmitting(false);
      return;
    }

    router.push(returnTo);
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text)]">Create Account</h1>
        <p className="text-[var(--color-muted)]">
          Join the miniature artists community to share your work and participate in events.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        {isLoading ? (
          <p className="text-sm text-[var(--color-muted)]">Loading session...</p>
        ) : user ? (
          <div className="space-y-3">
            <p className="text-[var(--color-text)]">
              You are already signed in as <strong>{user.username}</strong>.
            </p>
            <Link href={returnTo} className="text-[var(--color-accent)]">
              Continue
            </Link>
          </div>
        ) : (
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
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
              Email Address *
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
                autoComplete="email"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
                Password *
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
                Confirm Password *
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
                  autoComplete="new-password"
                  required
                  minLength={6}
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
                className="min-h-20 rounded-md border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)] resize-none"
                placeholder="Tell us about yourself and your miniature art..."
                maxLength={500}
              />
            </label>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="min-h-11 rounded-full bg-[var(--color-accent)] px-5 text-sm font-medium text-white disabled:opacity-60"
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
              
              <p className="text-center text-sm text-[var(--color-muted)]">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-[var(--color-accent)] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-8">
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <p className="text-sm text-[var(--color-muted)]">Loading registration page...</p>
          </section>
        </main>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}