import { EventCard } from "@/components/EventCard";
import { eventService } from "@/services/eventService";
import type { Event } from "@/types/event";

function getBucket(event: Event): "now" | "upcoming" | "archive" {
  const now = Date.now();
  const eventTime = new Date(event.date).getTime();
  const twoDays = 1000 * 60 * 60 * 24 * 2;

  if (Math.abs(eventTime - now) <= twoDays) {
    return "now";
  }

  return eventTime > now ? "upcoming" : "archive";
}

export default async function EventsPage() {
  const events = await eventService.getEvents();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text)]">Events</h1>
        <p className="text-[var(--color-muted)]">
          Browse active, upcoming, and archived community events.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} bucket={getBucket(event)} />
        ))}
      </section>
    </main>
  );
}
