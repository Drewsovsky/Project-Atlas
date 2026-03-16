import Image from "next/image";
import Link from "next/link";
import type { User } from "@/types/user";

type LeaderboardRow = {
  user: User;
  postsCount: number;
};

type LeaderboardTableProps = {
  rows: LeaderboardRow[];
};

export function LeaderboardTable({ rows }: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
      <div className="overflow-x-auto">
      <table className="min-w-[640px] w-full border-collapse">
        <thead className="bg-[var(--color-surface)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Posts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.user.id} className="border-t border-[var(--color-border)]">
              <td className="px-4 py-3 font-semibold text-[var(--color-text)]">
                {index + 1}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/profile/${row.user.username}`}
                  className="flex items-center gap-3 text-[var(--color-text)] hover:text-[var(--color-accent)]"
                >
                  <Image
                    src={row.user.avatar}
                    alt={row.user.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                  <span>{row.user.username}</span>
                </Link>
              </td>
              <td className="px-4 py-3 text-[var(--color-text)]">{row.user.rating}</td>
              <td className="px-4 py-3 text-[var(--color-muted)]">{row.postsCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
