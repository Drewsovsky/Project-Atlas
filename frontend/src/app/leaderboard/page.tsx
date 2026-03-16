"use client";

import { useEffect, useMemo, useState } from "react";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { useAuth } from "@/context/AuthContext";
import { postService } from "@/services/postService";
import { userService } from "@/services/userService";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";

export default function LeaderboardPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [loadedUsers, loadedPosts] = await Promise.all([
        userService.getUsers(),
        postService.getPosts(),
      ]);

      setUsers(loadedUsers);
      setPosts(loadedPosts);
    };

    void loadData();
  }, []);

  const rows = useMemo(() => {
    const visibleUsers = isAdmin ? users : users.filter((user) => !user.banned);
    const visibleUserIds = new Set(visibleUsers.map((user) => user.id));
    const visiblePosts = posts.filter((post) => visibleUserIds.has(post.authorId));

    return visibleUsers
      .map((user) => ({
        user,
        postsCount: visiblePosts.filter((post) => post.authorId === user.id).length,
      }))
      .sort(
        (a, b) => b.user.rating - a.user.rating || b.postsCount - a.postsCount,
      );
  }, [isAdmin, posts, users]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text)]">
          Leaderboard
        </h1>
        <p className="text-[var(--color-muted)]">
          Community ranking by rating and activity.
        </p>
      </section>

      <LeaderboardTable rows={rows} />
    </main>
  );
}
