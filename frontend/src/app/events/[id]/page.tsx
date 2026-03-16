"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { eventService } from "@/services/eventService";
import type { Event, EventNews } from "@/types/event";

type NewsFormState = {
  title: string;
  cover: string;
  text: string;
};

const emptyNewsForm: NewsFormState = {
  title: "",
  cover: "",
  text: "",
};

export default function EventPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { isAdmin } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [news, setNews] = useState<EventNews[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<NewsFormState>(emptyNewsForm);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<NewsFormState>(emptyNewsForm);

  useEffect(() => {
    const loadPageData = async () => {
      const [loadedEvent, loadedNews] = await Promise.all([
        eventService.getEventById(id),
        eventService.getEventNewsByEventId(id),
      ]);

      setEvent(loadedEvent ?? null);
      setNews(loadedNews);
      setIsPageLoading(false);
    };

    void loadPageData();
  }, [id]);

  const validateNewsForm = (form: NewsFormState): string | null => {
    if (!form.title.trim() || !form.cover.trim() || !form.text.trim()) {
      return "Title, cover URL, and text are required.";
    }

    return null;
  };

  const onCreateNews = async (eventObj: React.FormEvent<HTMLFormElement>) => {
    eventObj.preventDefault();

    const validationError = validateNewsForm(createForm);
    if (validationError) {
      setError(validationError);
      return;
    }

    const created = await eventService.createEventNews({
      eventId: id,
      title: createForm.title.trim(),
      cover: createForm.cover.trim(),
      text: createForm.text.trim(),
    });

    setNews(await eventService.getEventNewsByEventId(id));
    setCreateForm(emptyNewsForm);
    setError(null);

    // Keep newly created entry visible by nudging edit state off.
    if (editingNewsId === created.id) {
      setEditingNewsId(null);
    }
  };

  const startEditNews = (item: EventNews) => {
    setEditingNewsId(item.id);
    setEditForm({
      title: item.title,
      cover: item.cover,
      text: item.text,
    });
    setError(null);
  };

  const onSaveNewsEdit = async (eventObj: React.FormEvent<HTMLFormElement>) => {
    eventObj.preventDefault();

    if (!editingNewsId) {
      return;
    }

    const validationError = validateNewsForm(editForm);
    if (validationError) {
      setError(validationError);
      return;
    }

    const updated = await eventService.editEventNews(editingNewsId, {
      title: editForm.title.trim(),
      cover: editForm.cover.trim(),
      text: editForm.text.trim(),
    });

    if (!updated) {
      setError("Failed to update news item.");
      return;
    }

    setNews(await eventService.getEventNewsByEventId(id));
    setEditingNewsId(null);
    setError(null);
  };

  const onDeleteNews = async (newsId: string) => {
    if (!window.confirm("Delete this news item?")) {
      return;
    }

    await eventService.deleteEventNews(newsId);
    setNews(await eventService.getEventNewsByEventId(id));

    if (editingNewsId === newsId) {
      setEditingNewsId(null);
    }
  };

  if (isPageLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8">
        <p className="text-[var(--color-muted)]">Loading event...</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Event not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-8">
      <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-white p-5">
        <div className="relative aspect-[16/7] overflow-hidden rounded-lg bg-[var(--color-surface)]">
          <Image
            src={event.cover}
            alt={event.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <h1 className="text-3xl font-semibold text-[var(--color-text)]">{event.title}</h1>
        <p className="text-sm text-[var(--color-muted)]">
          {new Date(event.date).toLocaleString()}
        </p>
        <p className="text-[var(--color-text)]">{event.description}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Event News</h2>

        {isAdmin && (
          <form
            className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-4"
            onSubmit={onCreateNews}
          >
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Add News</h3>
            <input
              type="text"
              value={createForm.title}
              onChange={(eventObj) =>
                setCreateForm((prev) => ({ ...prev, title: eventObj.target.value }))
              }
              placeholder="Title"
              className="min-h-11 w-full rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
            />
            <input
              type="url"
              value={createForm.cover}
              onChange={(eventObj) =>
                setCreateForm((prev) => ({ ...prev, cover: eventObj.target.value }))
              }
              placeholder="Cover URL"
              className="min-h-11 w-full rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
            />
            <textarea
              rows={3}
              value={createForm.text}
              onChange={(eventObj) =>
                setCreateForm((prev) => ({ ...prev, text: eventObj.target.value }))
              }
              placeholder="News text"
              className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)]"
            />
            <button
              type="submit"
              className="min-h-11 rounded-full bg-[var(--color-accent)] px-4 text-sm font-medium text-white"
            >
              Add News
            </button>
          </form>
        )}

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="space-y-4">
          {news.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 rounded-xl border border-[var(--color-border)] bg-white p-4 sm:grid-cols-[220px_1fr]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[var(--color-surface)]">
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 220px"
                />
              </div>
              <div className="space-y-2">
                {isAdmin && editingNewsId === item.id ? (
                  <form className="space-y-2" onSubmit={onSaveNewsEdit}>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(eventObj) =>
                        setEditForm((prev) => ({ ...prev, title: eventObj.target.value }))
                      }
                      className="min-h-11 w-full rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
                    />
                    <input
                      type="url"
                      value={editForm.cover}
                      onChange={(eventObj) =>
                        setEditForm((prev) => ({ ...prev, cover: eventObj.target.value }))
                      }
                      className="min-h-11 w-full rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
                    />
                    <textarea
                      rows={3}
                      value={editForm.text}
                      onChange={(eventObj) =>
                        setEditForm((prev) => ({ ...prev, text: eventObj.target.value }))
                      }
                      className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)]"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="submit"
                        className="rounded-md bg-[var(--color-accent)] px-3 py-2 text-xs font-medium text-white"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingNewsId(null)}
                        className="rounded-md border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text)]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-[var(--color-text)]">{item.title}</h3>
                    <p className="text-xs text-[var(--color-muted)]">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <p className="text-[var(--color-text)]">{item.text}</p>
                    {isAdmin && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => startEditNews(item)}
                          className="rounded-md border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text)]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDeleteNews(item.id)}
                          className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </article>
          ))}
          {!news.length && (
            <p className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-muted)]">
              No event news yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
