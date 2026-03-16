"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminTable } from "@/components/AdminTable";
import { useAuth } from "@/context/AuthContext";
import { eventService } from "@/services/eventService";
import { postService } from "@/services/postService";
import { userService } from "@/services/userService";
import type { Event } from "@/types/event";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";

export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (isLoading || !isAdmin) {
      return;
    }

    const load = async () => {
      const [loadedUsers, loadedPosts, loadedEvents] = await Promise.all([
        userService.getUsers(),
        postService.getPosts(),
        eventService.getEvents(),
      ]);
      setUsers(loadedUsers);
      setPosts(loadedPosts);
      setEvents(loadedEvents);
    };

    void load();
  }, [isAdmin, isLoading]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8">
        <p className="text-[var(--color-muted)]">Checking access...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Access denied</h1>
          <p className="text-[var(--color-muted)]">Sign in with an admin account to open this page.</p>
          <Link href="/auth/login" className="text-[var(--color-accent)]">
            Go to login
          </Link>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Access denied</h1>
          <p className="text-[var(--color-muted)]">
            {user.username} is not an admin account. Use <strong>admin/admin123</strong>.
          </p>
        </section>
      </main>
    );
  }

  const deletePost = async (id: string) => {
    await postService.deletePost(id);
    setPosts(await postService.getPosts());
  };

  const refreshUsers = async () => {
    setUsers(await userService.getUsers());
  };

  const editUserRating = async (target: User) => {
    const input = window.prompt(`Set rating for ${target.username}`, String(target.rating));

    if (input === null) {
      return;
    }

    const parsed = Number(input);

    if (!Number.isFinite(parsed) || parsed < 0) {
      window.alert("Rating must be a non-negative number.");
      return;
    }

    await userService.updateUserRating(target.id, parsed);
    await refreshUsers();
  };

  const toggleBan = async (target: User) => {
    if (target.role === "admin") {
      window.alert("Admin account cannot be banned.");
      return;
    }

    await userService.setUserBanStatus(target.id, !target.banned);
    await refreshUsers();
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text)]">Admin</h1>
        <p className="text-[var(--color-muted)]">
          MVP admin controls with in-memory data.
        </p>
      </section>

      <AdminTable
        title="Users"
        rows={users}
        columns={[
          { key: "username", label: "Username", render: (user) => user.username },
          { key: "rating", label: "Rating", render: (user) => user.rating },
          {
            key: "status",
            label: "Status",
            render: (user) => (user.banned ? "Banned" : "Active"),
          },
          { key: "created", label: "Created", render: (user) => new Date(user.createdAt).toLocaleDateString() },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void editUserRating(row)}
                  className="rounded-md border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text)]"
                >
                  Edit Rating
                </button>
                <button
                  type="button"
                  onClick={() => void toggleBan(row)}
                  className="rounded-md border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text)]"
                >
                  {row.banned ? "Unban" : "Ban"}
                </button>
              </div>
            ),
          },
        ]}
      />

      <AdminTable
        title="Posts"
        rows={posts}
        columns={[
          { key: "title", label: "Title", render: (post) => post.title },
          { key: "likes", label: "Likes", render: (post) => post.likes },
          {
            key: "action",
            label: "Action",
            render: (post) => (
              <button
                type="button"
                onClick={() => void deletePost(post.id)}
                className="rounded-md border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text)] hover:border-red-300 hover:text-red-600"
              >
                Delete
              </button>
            ),
          },
        ]}
      />

      <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/events/create"
            className="inline-flex min-h-11 items-center rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
          >
            Create Event
          </Link>
        </div>

        <AdminTable
          title="Events"
          rows={events}
          columns={[
            { key: "title", label: "Title", render: (event) => event.title },
            { key: "date", label: "Date", render: (event) => new Date(event.date).toLocaleDateString() },
            {
              key: "actions",
              label: "Actions",
              render: (event) => (
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="rounded-md border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text)]"
                >
                  Edit
                </Link>
              ),
            },
          ]}
        />
      </section>
    </main>
  );
}
