import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/post";

type PostCardProps = {
  post: Post;
  authorName: string;
};

export function PostCard({ post, authorName }: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/post/${post.id}`} className="block">
        <div className="relative aspect-[4/3] w-full bg-[var(--color-surface)]">
          <Image
            src={post.images[0]}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-[var(--color-muted)]">
          <span>{post.level}</span>
          <span>{post.genre}</span>
        </div>
        <h3 className="line-clamp-1 text-lg font-semibold text-[var(--color-text)]">
          <Link href={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        <p className="line-clamp-2 text-sm text-[var(--color-muted)]">
          {post.description}
        </p>
        <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
          <Link href={`/profile/${authorName}`} className="hover:text-[var(--color-accent)]">
            @{authorName}
          </Link>
          <span>{post.likes} likes</span>
        </div>
      </div>
    </article>
  );
}
