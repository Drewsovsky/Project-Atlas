"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { eventService } from "@/services/eventService";

type EventFormState = {
  title: string;
  cover: string;
  description: string;
  date: string;
};

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const { user, isAdmin, isLoading } = useAuth();

  const [form, setForm] = useState<EventFormState>({
    title: "",
    cover: "",
    description: "",
    date: "",
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      const foundEvent = await eventService.getEventById(eventId);

      if (!foundEvent) {
        setError("Event not found.");
        setPageLoading(false);
        return;
      }

      const localDate = new Date(foundEvent.date);
      const offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setForm({
        title: foundEvent.title,
        cover: foundEvent.cover,
        description: foundEvent.description,
        date: offsetDate,
      });
      setPageLoading(false);
    };

    void loadEvent();
  }, [eventId]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !isAdmin) {
      setError("Only admins can edit events.");
      return;
    }

    if (!form.title.trim() || !form.cover.trim() || !form.description.trim() || !form.date) {
      setError("All fields are required.");
      return;
    }

    setSaving(true);
    setError(null);

    const updated = await eventService.editEvent(eventId, {
      title: form.title.trim(),
      cover: form.cover.trim(),
      description: form.description.trim(),
      date: new Date(form.date).toISOString(),
      createdBy: user.id,
    });

    if (!updated) {
      setError("Failed to update event.");
      setSaving(false);
      return;
    }

    router.push(`/events/${updated.id}`);
  };

  if (isLoading || pageLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <p className="text-[var(--color-muted)]">Loading...</p>
      </main>
    );
  }

  if (!user || !isAdmin) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Access denied</h1>
          <p className="text-[var(--color-muted)]">Only admin users can edit events.</p>
          <Link href="/admin" className="text-[var(--color-accent)]">
            Back to admin
          </Link>
        </section>
      </main>
    );
  }

  if (error === "Event not found.") {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Event not found</h1>
          <Link href="/admin" className="text-[var(--color-accent)]">
            Back to admin
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
      <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h1 className="text-3xl font-semibold text-[var(--color-text)]">Edit Event</h1>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
            Cover image URL
            <input
              type="url"
              value={form.cover}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, cover: event.target.value }))
              }
              className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
            Date and time
            <input
              type="datetime-local"
              value={form.date}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, date: event.target.value }))
              }
              className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
            Description
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
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
              href="/admin"
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
