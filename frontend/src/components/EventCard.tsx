import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types/event";

type EventCardProps = {
  event: Event;
  bucket: "now" | "upcoming" | "archive";
};

export function EventCard({ event, bucket }: EventCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
      <Link href={`/events/${event.id}`} className="block">
        <div className="relative aspect-[16/7] w-full bg-[var(--color-surface)]">
          <Image
            src={event.cover}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 50vw"
          />
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]">{bucket}</p>
        <h3 className="text-xl font-semibold text-[var(--color-text)]">
          <Link href={`/events/${event.id}`}>{event.title}</Link>
        </h3>
        <p className="text-sm text-[var(--color-muted)]">
          {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-sm text-[var(--color-muted)]">{event.description}</p>
      </div>
    </article>
  );
}
