import Image from "next/image";
import Link from "next/link";
import { postService } from "@/services/postService";
import { userService } from "@/services/userService";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await postService.getPostById(id);

  if (!post) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Post not found</h1>
        <Link href="/gallery" className="mt-4 inline-block text-[var(--color-accent)]">
          Return to gallery
        </Link>
      </main>
    );
  }

  const author = await userService.getUserById(post.authorId);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-8">
      <Link href="/gallery" className="text-sm text-[var(--color-accent)]">
        Back to gallery
      </Link>

      <section className="grid gap-4 sm:grid-cols-2">
        {post.images.map((image, index) => (
          <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--color-surface)]">
            <Image
              src={image}
              alt={`${post.title} image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
          <span className="uppercase tracking-wide">{post.level}</span>
          <span>{post.genre}</span>
        </div>
        <h1 className="text-3xl font-semibold text-[var(--color-text)]">{post.title}</h1>
        <p className="text-[var(--color-text)]">{post.description}</p>
        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-muted)]">
          <Link href={`/profile/${author?.username ?? "unknown"}`}>
            by {author?.name ?? "Unknown artist"}
          </Link>
          <span>{post.likes} likes</span>
        </div>
      </section>
    </main>
  );
}
