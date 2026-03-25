"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MobileMenu } from "@/components/MobileMenu";

const navItems = [
  { href: "/gallery", label: "Галерея" },
  { href: "/leaderboard", label: "Таблиця лідерів" },
  { href: "/events", label: "Івенти" },
];

export function AppHeader() {
  const router = useRouter();
  const { user, logout, isLoading, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/gallery");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <Link href="/" className="font-display text-xl font-semibold text-[var(--color-text)]">
          BunePlacess
        </Link>

        <nav className="hidden items-center gap-2 md:flex lg:gap-4">
          {navItems.map((item) => (
            
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-full px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              Адмін
            </Link>
          )}

          {!isLoading && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/post/create"
                className="rounded-full bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white"
              >
                Публікувати
              </Link>
              <Link
                href="/profile/me"
                className="rounded-full border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)]"
              >
                Профіль
              </Link>
              <span className="text-sm text-[var(--color-muted)]">{user.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)]"
              >
                Вийти
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-full border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)]"
            >
              Увійти
            </Link>
          )}
        </nav>

        <MobileMenu
          navItems={navItems}
          isLoggedIn={!isLoading && !!user}
          profileHref={user ? "/profile/me" : undefined}
          createPostHref={user ? "/post/create" : undefined}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}
