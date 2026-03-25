import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { PostCard } from "@/components/PostCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { events } from "@/lib/dummy-data/events";
import { posts } from "@/lib/dummy-data/posts";
import { users } from "@/lib/dummy-data/users";

// Helper function to determine if an event is upcoming
const isUpcoming = (dateStr: string) => {
  const eventDate = new Date(dateStr);
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return eventDate > now && eventDate <= oneWeekFromNow;
};

export default function Home() {
  // Get upcoming events
  const upcomingEvents = events.filter(event => isUpcoming(event.date));
  
  // Get featured posts (top liked posts)
  const featuredPosts = posts
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4);
  
  // Get leaderboard data (top 5 users)
  const leaderboardData = users
    .filter(user => !user.banned)
    .map(user => ({
      user,
      postsCount: posts.filter(post => post.authorId === user.id).length
    }))
    .sort((a, b) => b.user.rating - a.user.rating)
    .slice(0, 5);

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Miniature art workspace"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-text)]/60 to-[var(--color-text)]/30" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Craft. Share. Compete.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Join the premier community for miniature artists. Share your masterpieces, participate in events, and climb the leaderboard.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/gallery"
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              Explore Gallery
            </Link>
            <Link
              href="/auth/register"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg transition-colors backdrop-blur-sm"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Banner */}
      {upcomingEvents.length > 0 && (
        <section className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Upcoming Events</h2>
              <p className="text-white/90">Don&apos;t miss these exciting community events!</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <EventCard event={event} bucket="upcoming" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Posts */}
      <section className="py-16 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--color-text)] mb-4">Featured Artwork</h2>
            <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
              Discover the most popular miniatures from our talented community artists.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredPosts.map((post) => {
              const author = users.find(user => user.id === post.authorId);
              return (
                <div key={post.id} className="group">
                  <PostCard post={post} authorName={author?.name || "Unknown"} />
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white px-8 py-4 rounded-full font-semibold transition-colors"
            >
              View All Artwork
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner with Social Media */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-8">
          <h2 className="text-4xl font-bold text-[var(--color-text)] mb-6">
            Ready to Share Your Art?
          </h2>
          <p className="text-xl text-[var(--color-muted)] mb-8 max-w-2xl mx-auto">
            Join thousands of miniature artists in our vibrant community. Share your work, get feedback, and participate in exciting events.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link
              href="/auth/register"
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/post/create"
              className="border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text)] px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              Upload Your Art
            </Link>
          </div>
          
          {/* Social Media Links */}
          <div className="border-t border-[var(--color-border)] pt-8">
            <p className="text-[var(--color-muted)] mb-4">Follow us on social media</p>
            <div className="flex gap-6 justify-center">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[var(--color-surface)] hover:bg-[var(--color-accent)] text-[var(--color-muted)] hover:text-white p-3 rounded-full transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.744.06 7.5.113 7.306.18 7.157.306 7.008.433 6.942.627 6.89.871 6.843 1.116 6.83 1.523 6.83 5.144v13.712c0 3.621.013 4.028.06 4.272.053.244.12.438.246.587.127.149.321.216.565.268.244.047.651.06 4.272.06h13.712c3.621 0 4.028-.013 4.272-.06.244-.052.438-.119.587-.246.149-.127.216-.321.268-.565.047-.244.06-.651.06-4.272V5.144c0-3.621-.013-4.028-.06-4.272-.052-.244-.119-.438-.246-.587-.127-.149-.321-.216-.565-.268C16.028.013 15.621 0 12.017 0z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[var(--color-surface)] hover:bg-[var(--color-accent)] text-[var(--color-muted)] hover:text-white p-3 rounded-full transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.080l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[var(--color-surface)] hover:bg-[var(--color-accent)] text-[var(--color-muted)] hover:text-white p-3 rounded-full transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
                </svg>
              </a>
              <a 
                href="https://discord.gg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[var(--color-surface)] hover:bg-[var(--color-accent)] text-[var(--color-muted)] hover:text-white p-3 rounded-full transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-16 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-[var(--color-text)] mb-4">Community Leaders</h2>
            <p className="text-xl text-[var(--color-muted)]">
              See who&apos;s leading the community in skill and contribution.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)]">
            <LeaderboardTable rows={leaderboardData} />
          </div>
          <div className="text-center mt-8">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text)] px-6 py-3 rounded-full font-semibold transition-colors"
            >
              View Full Leaderboard
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
