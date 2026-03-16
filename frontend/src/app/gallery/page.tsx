"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { useAuth } from "@/context/AuthContext";
import { postService } from "@/services/postService";
import { userService } from "@/services/userService";
import type { Post, PostLevel, PostSort } from "@/types/post";
import type { User } from "@/types/user";

export default function GalleryPage() {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [level, setLevel] = useState<"all" | PostLevel>("all");
  const [genre, setGenre] = useState<string>("all");
  const [sort, setSort] = useState<PostSort>("new");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const [loadedUsers, allPosts] = await Promise.all([
        userService.getUsers(),
        postService.getPosts(),
      ]);

      const visibleUsers = isAdmin
        ? loadedUsers
        : loadedUsers.filter((item) => !item.banned);
      const visibleUserIds = new Set(visibleUsers.map((item) => item.id));
      const visiblePosts = allPosts.filter((post) => visibleUserIds.has(post.authorId));

      setUsers(visibleUsers);
      setAllGenres(Array.from(new Set(visiblePosts.map((post) => post.genre))).sort());
    };

    void loadInitialData();
  }, [isAdmin]);

  useEffect(() => {
    const loadPosts = async () => {
      const query = {
        sort,
        level: level === "all" ? undefined : level,
        genre: genre === "all" ? undefined : genre,
      };

      const queriedPosts = await postService.getPosts(query);
      const visibleUserIds = new Set(
        users
          .filter((item) => isAdmin || !item.banned)
          .map((item) => item.id),
      );

      setPosts(
        queriedPosts.filter((post) => visibleUserIds.has(post.authorId)),
      );
    };

    void loadPosts();
  }, [isAdmin, level, genre, sort, users]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (level !== "all") {
      count += 1;
    }
    if (genre !== "all") {
      count += 1;
    }
    if (sort !== "new") {
      count += 1;
    }
    return count;
  }, [genre, level, sort]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8">
      <section className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text)]">
          Gallery
        </h1>
        <p className="max-w-2xl text-[var(--color-muted)]">
          Explore miniature work by genre and painting intent.
        </p>
        {user && (
          <Link
            href="/post/create"
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--color-accent)] px-4 text-sm font-medium text-white"
          >
            Create Post
          </Link>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-4">
        <div className="flex items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-text)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                d="M4 6H20M7 12H17M10 18H14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Filters
          </button>
          <p className="text-xs text-[var(--color-muted)]">
            {activeFilterCount ? `${activeFilterCount} active` : "No filters"}
          </p>
        </div>

        <div className={`${filtersOpen ? "grid" : "hidden"} gap-3 md:grid md:grid-cols-3`}>
        <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
          Level
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value as "all" | PostLevel)}
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[var(--color-text)]"
          >
            <option value="all">All levels</option>
            <option value="gaming">Gaming</option>
            <option value="display">Display</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
          Genre
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[var(--color-text)]"
          >
            <option value="all">All genres</option>
            {allGenres.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as PostSort)}
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[var(--color-text)]"
          >
            <option value="new">New</option>
            <option value="popular">Popular</option>
          </select>
        </label>
        </div>
      </section>

      <GalleryGrid posts={posts} users={users} />
    </main>
  );
}
