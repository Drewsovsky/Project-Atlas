import Image from "next/image";
import Link from "next/link";
import type { User } from "@/types/user";

type ProfileHeaderProps = {
  user: User;
  canEdit?: boolean;
};

export function ProfileHeader({ user, canEdit = false }: ProfileHeaderProps) {
  return (
    <header className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Image
          src={user.avatar}
          alt={user.name}
          width={88}
          height={88}
          className="h-22 w-22 rounded-full object-cover"
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">{user.name}</h1>
          <p className="text-sm text-[var(--color-muted)]">@{user.username}</p>
          <p className="text-[var(--color-text)]">{user.bio}</p>
          <p className="text-sm font-medium text-[var(--color-accent)]">
            Rating: {user.rating}
          </p>
          {canEdit && (
            <div>
              <Link
                href={`/profile/${user.username}/edit`}
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-border)] px-4 text-sm text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Edit Profile
              </Link>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {user.links.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {link.replace("https://", "")}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
