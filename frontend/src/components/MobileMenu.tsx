"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  navItems: NavItem[];
  isLoggedIn: boolean;
  profileHref?: string;
  createPostHref?: string;
  onLogout: () => void;
};

export function MobileMenu({
  navItems,
  isLoggedIn,
  profileHref,
  createPostHref,
  onLogout,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Toggle navigation menu"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-3 text-[var(--color-text)]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          {open ? (
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-30 bg-black/35"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 top-[72px] z-40 mx-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-xl">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)]"
                >
                  {item.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  {createPostHref && (
                    <Link
                      href={createPostHref}
                      onClick={() => setOpen(false)}
                      className="mt-2 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white"
                    >
                      Create Post
                    </Link>
                  )}
                  {profileHref && (
                    <Link
                      href={profileHref}
                      onClick={() => setOpen(false)}
                      className="mt-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)]"
                    >
                      My Profile
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setOpen(false);
                    }}
                    className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-left text-sm text-[var(--color-text)]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
