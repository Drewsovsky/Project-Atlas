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

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isLoading } = useAuth();
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("user123");
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

    const loginError = await login(username, password);

    if (loginError) {
      setError(loginError);
      setSubmitting(false);
      return;
    }

    router.push(returnTo);
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text)]">Sign in</h1>
        <p className="text-[var(--color-muted)]">
          Demo accounts: <strong>user/user123</strong> and <strong>admin/admin123</strong>
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        {isLoading ? (
          <p className="text-sm text-[var(--color-muted)]">Loading session...</p>
        ) : user ? (
          <div className="space-y-3">
            <p className="text-[var(--color-text)]">
              You are signed in as <strong>{user.username}</strong>.
            </p>
            <Link href={returnTo} className="text-[var(--color-accent)]">
              Continue
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
              Username
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
                autoComplete="username"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
                autoComplete="current-password"
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
              {submitting ? "Signing in..." : "Sign in"}
            </button>
            
            <p className="text-center text-sm text-[var(--color-muted)]">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-[var(--color-accent)] hover:underline">
                Create one
              </Link>
            </p>
          </form>
        )}
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-8">
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <p className="text-sm text-[var(--color-muted)]">Loading sign in page...</p>
          </section>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
