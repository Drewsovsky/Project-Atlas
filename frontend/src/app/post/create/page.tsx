"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { postService } from "@/services/postService";
import {
  MAX_POST_IMAGE_BYTES,
  MAX_POST_IMAGES,
  type PostLevel,
} from "@/types/post";

type FormState = {
  title: string;
  description: string;
  level: PostLevel;
  genre: string;
};

type LocalImage = {
  file: File;
  previewUrl: string;
};

const mbLimit = Math.floor(MAX_POST_IMAGE_BYTES / (1024 * 1024));

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    level: "gaming",
    genre: "",
  });
  const [selectedImages, setSelectedImages] = useState<LocalImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const selectedImagesRef = useRef<LocalImage[]>([]);

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const replaceSelectedImages = (next: LocalImage[]) => {
    selectedImagesRef.current.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
    });
    selectedImagesRef.current = next;
    setSelectedImages(next);
  };

  const onFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);

    if (incoming.length > MAX_POST_IMAGES) {
      setError(`You can upload up to ${MAX_POST_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    const oversized = incoming.find((file) => file.size > MAX_POST_IMAGE_BYTES);

    if (oversized) {
      setError(`Each image must be ${mbLimit}MB or less.`);
      event.target.value = "";
      return;
    }

    setError(null);
    replaceSelectedImages(
      incoming.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    );
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setError("Sign in to create a post.");
      return;
    }

    if (!form.title.trim() || !form.description.trim() || !form.genre.trim()) {
      setError("Title, description, and genre are required.");
      return;
    }

    if (!selectedImages.length) {
      setError("Add at least one image.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const created = await postService.createPost(user.id, {
        title: form.title,
        description: form.description,
        level: form.level,
        genre: form.genre,
        images: selectedImages.map((item) => item.previewUrl),
      });

      router.push(`/post/${created.id}`);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to create post.",
      );
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <p className="text-[var(--color-muted)]">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Sign in required</h1>
          <p className="text-[var(--color-muted)]">You need an account to create a post.</p>
          <Link href="/auth/login?returnTo=/post/create" className="text-[var(--color-accent)]">
            Go to login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
      <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h1 className="text-3xl font-semibold text-[var(--color-text)]">Create Post</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Files are temporary in MVP and reset after refresh.
        </p>

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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
              Level
              <select
                value={form.level}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    level: event.target.value as PostLevel,
                  }))
                }
                className="min-h-11 rounded-md border border-[var(--color-border)] bg-white px-3 text-[var(--color-text)]"
              >
                <option value="gaming">Gaming</option>
                <option value="display">Display</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
              Genre
              <input
                type="text"
                value={form.genre}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, genre: event.target.value }))
                }
                className="min-h-11 rounded-md border border-[var(--color-border)] px-3 text-[var(--color-text)]"
                placeholder="fantasy"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
            Images (up to {MAX_POST_IMAGES}, max {mbLimit}MB each)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onFilesChange}
              className="min-h-11 rounded-md border border-[var(--color-border)] px-3 py-2 text-[var(--color-text)]"
            />
          </label>

          {!!selectedImages.length && (
            <ul className="space-y-1 text-xs text-[var(--color-muted)]">
              {selectedImages.map(({ file }) => {
                return (
                  <li key={file.name + String(file.lastModified)}>
                    {file.name} ({(file.size / (1024 * 1024)).toFixed(1)}MB)
                  </li>
                );
              })}
            </ul>
          )}

          {!!selectedImages.length && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {selectedImages.map(({ file, previewUrl }) => (
                <figure key={file.name + String(file.lastModified)} className="space-y-1">
                  <Image
                    src={previewUrl}
                    alt={file.name}
                    width={320}
                    height={160}
                    unoptimized
                    className="h-24 w-full rounded-md border border-[var(--color-border)] object-cover"
                  />
                  <figcaption className="truncate text-xs text-[var(--color-muted)]">
                    {file.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

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
              {saving ? "Creating..." : "Create Post"}
            </button>
            <Link
              href="/gallery"
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
