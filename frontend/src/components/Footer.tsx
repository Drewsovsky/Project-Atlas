import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Project Atlas</h3>
            <p className="text-sm text-[var(--color-muted)] max-w-xs">
              The premier community platform for miniature artists to share, compete, and grow together.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[var(--color-text)]">Explore</h4>
            <div className="space-y-2">
              <Link href="/gallery" className="block text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
                Gallery
              </Link>
              <Link href="/leaderboard" className="block text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
                Leaderboard
              </Link>
              <Link href="/events" className="block text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
                Events
              </Link>
            </div>
          </div>

          {/* Community Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[var(--color-text)]">Community</h4>
            <div className="space-y-2">
              <Link href="/auth/register" className="block text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
                Join Community
              </Link>
              <Link href="/post/create" className="block text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
                Share Your Work
              </Link>
              <Link href="/profile/me" className="block text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
                My Profile
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-[var(--color-text)]">Follow Us</h4>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Follow us on Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.744.06 7.5.113 7.306.18 7.157.306 7.008.433 6.942.627 6.89.871 6.843 1.116 6.83 1.523 6.83 5.144v13.712c0 3.621.013 4.028.06 4.272.053.244.12.438.246.587.127.149.321.216.565.268.244.047.651.06 4.272.06h13.712c3.621 0 4.028-.013 4.272-.06.244-.052.438-.119.587-.246.149-.127.216-.321.268-.565.047-.244.06-.651.06-4.272V5.144c0-3.621-.013-4.028-.06-4.272-.052-.244-.119-.438-.246-.587-.127-.149-.321-.216-.565-.268C16.028.013 15.621 0 12.017 0zm0 1.441c3.605 0 4.025.012 4.441.063.244.05.438.118.607.275.169.157.229.363.275.607.051.416.063.836.063 4.441v4.441c0 3.605-.012 4.025-.063 4.441-.046.244-.106.45-.275.607-.169.157-.363.225-.607.275-.416.051-.836.063-4.441.063H7.576c-3.605 0-4.025-.012-4.441-.063-.244-.05-.438-.118-.607-.275-.169-.157-.229-.363-.275-.607-.051-.416-.063-.836-.063-4.441V7.576c0-3.605.012-4.025.063-4.441.046-.244.106-.45.275-.607.169-.157.363-.225.607-.275.416-.051.836-.063 4.441-.063h4.441zm0 2.452c-3.259 0-5.897 2.638-5.897 5.897 0 3.259 2.638 5.897 5.897 5.897 3.259 0 5.897-2.638 5.897-5.897 0-3.259-2.638-5.897-5.897-5.897zm0 9.738c-2.122 0-3.841-1.719-3.841-3.841S9.895 8.256 12.017 8.256s3.841 1.719 3.841 3.841-1.719 3.841-3.841 3.841zM18.106 6.034c0 .759-.616 1.375-1.375 1.375s-1.375-.616-1.375-1.375.616-1.375 1.375-1.375 1.375.616 1.375 1.375z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Follow us on Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.080l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Follow us on YouTube"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
                </svg>
              </a>
              <a 
                href="https://discord.gg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Join our Discord"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-[var(--color-border)] pt-8 text-center">
          <p className="text-sm text-[var(--color-muted)]">
            © {new Date().getFullYear()} Project Atlas. Community platform for miniature artists.
          </p>
        </div>
      </div>
    </footer>
  );
}