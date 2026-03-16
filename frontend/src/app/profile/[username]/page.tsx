"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ProfileHeader } from "@/components/ProfileHeader";
import { useAuth } from "@/context/AuthContext";
import { postService } from "@/services/postService";
import { userService } from "@/services/userService";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { user: sessionUser, isAdmin, isLoading } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      const foundUser = await userService.getUserByUsername(username);

      if (!foundUser) {
        setProfileUser(null);
        setPosts([]);
        setUsers([]);
        setIsPageLoading(false);
        return;
      }

      const [authorPosts, allUsers] = await Promise.all([
        postService.getPostsByAuthorId(foundUser.id),
        userService.getUsers(),
      ]);

      setProfileUser(foundUser);
      setPosts(authorPosts);
      setUsers(allUsers);
      setIsPageLoading(false);
    };

    void loadProfileData();
  }, [username]);

  if (isPageLoading || isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8">
        <p className="text-[var(--color-muted)]">Loading profile...</p>
      </main>
    );
  }

  if (!profileUser) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Profile not found</h1>
      </main>
    );
  }

  const canEdit = sessionUser?.id === profileUser.id;
  const canViewProfile = !profileUser.banned || isAdmin || canEdit;

  if (!canViewProfile) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Profile not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8">
      <ProfileHeader user={profileUser} canEdit={canEdit} />
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Works</h2>
        <GalleryGrid posts={posts} users={users} />
      </section>
    </main>
  );
}
