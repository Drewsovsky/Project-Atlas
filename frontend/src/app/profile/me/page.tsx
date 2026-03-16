"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function MyProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(`/profile/${user.username}`);
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <p className="text-[var(--color-muted)]">Loading your profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Sign in required</h1>
          <p className="text-[var(--color-muted)]">
            You need to sign in before opening your profile.
          </p>
          <Link href="/auth/login" className="text-[var(--color-accent)]">
            Go to login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
      <p className="text-[var(--color-muted)]">Opening your profile...</p>
    </main>
  );
}
