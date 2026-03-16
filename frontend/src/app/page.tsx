import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-14 sm:px-8">
      <section className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-accent)]">
          MVP in progress
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-[var(--color-text)] sm:text-6xl">
          Community platform for miniature artists.
        </h1>
        <p className="max-w-2xl text-lg text-[var(--color-muted)]">
          Share visual work, follow events, and grow reputation through a visual-first experience.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/gallery"
            className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white"
          >
            Open gallery
          </Link>
          <Link
            href="/events"
            className="rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-medium text-[var(--color-text)]"
          >
            Browse events
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/gallery" className="rounded-xl border border-[var(--color-border)] bg-white p-5 hover:border-[var(--color-accent)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Gallery</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Filter by level and genre.</p>
        </Link>
        <Link href="/leaderboard" className="rounded-xl border border-[var(--color-border)] bg-white p-5 hover:border-[var(--color-accent)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Leaderboard</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Track top community artists.</p>
        </Link>
        <Link href="/events" className="rounded-xl border border-[var(--color-border)] bg-white p-5 hover:border-[var(--color-accent)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Events</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Now, upcoming, and archive.</p>
        </Link>
        <Link href="/admin" className="rounded-xl border border-[var(--color-border)] bg-white p-5 hover:border-[var(--color-accent)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Admin</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Users, posts, and events controls.</p>
        </Link>
      </section>
    </main>
  );
}
