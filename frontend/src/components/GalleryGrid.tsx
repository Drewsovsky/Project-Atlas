import type { Post } from "@/types/post";
import type { User } from "@/types/user";
import { PostCard } from "@/components/PostCard";

type GalleryGridProps = {
  posts: Post[];
  users: User[];
};

export function GalleryGrid({ posts, users }: GalleryGridProps) {
  const usersById = new Map(users.map((user) => [user.id, user]));

  if (!posts.length) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center text-[var(--color-muted)]">
        No posts match current filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {posts.map((post) => {
        const author = usersById.get(post.authorId);
        return (
          <PostCard
            key={post.id}
            post={post}
            authorName={author?.username ?? "unknown"}
          />
        );
      })}
    </div>
  );
}
