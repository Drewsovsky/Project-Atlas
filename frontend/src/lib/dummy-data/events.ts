import type { Event, EventNews } from "@/types/event";

const thisYear = new Date().getUTCFullYear();

export const events: Event[] = [
  {
    id: "e1",
    title: "Spring Brush Clash",
    cover: "https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=1400&q=80",
    description: "A timed challenge focused on character miniatures and scenic basing.",
    date: new Date(Date.UTC(thisYear, 2, 20, 12, 0, 0)).toISOString(),
    createdBy: "u3",
    createdAt: new Date(Date.UTC(thisYear, 1, 10, 9, 30, 0)).toISOString(),
  },
  {
    id: "e2",
    title: "Summer Diorama Invitational",
    cover: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
    description: "Narrative-driven diorama event judged by guest artists.",
    date: new Date(Date.UTC(thisYear, 6, 9, 14, 0, 0)).toISOString(),
    createdBy: "u1",
    createdAt: new Date(Date.UTC(thisYear, 2, 1, 8, 0, 0)).toISOString(),
  },
  {
    id: "e3",
    title: "Winter Display Masters",
    cover: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1400&q=80",
    description: "Invitation-only final with long-form critique sessions.",
    date: new Date(Date.UTC(thisYear - 1, 11, 15, 16, 0, 0)).toISOString(),
    createdBy: "u2",
    createdAt: new Date(Date.UTC(thisYear - 1, 8, 20, 10, 0, 0)).toISOString(),
  },
];

export const eventNews: EventNews[] = [
  {
    id: "n1",
    eventId: "e1",
    cover: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    title: "Theme Announced: Ancient Relics",
    text: "Participants can submit one hero miniature with optional scenic base.",
    createdAt: new Date(Date.UTC(thisYear, 1, 18, 12, 0, 0)).toISOString(),
  },
  {
    id: "n2",
    eventId: "e1",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    title: "Submission Window Extended",
    text: "The deadline has been moved by 48 hours due to regional outages.",
    createdAt: new Date(Date.UTC(thisYear, 2, 16, 15, 0, 0)).toISOString(),
  },
  {
    id: "n3",
    eventId: "e2",
    cover: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80",
    title: "Jury Panel Confirmed",
    text: "Three guest judges from international miniature studios will review entries.",
    createdAt: new Date(Date.UTC(thisYear, 2, 28, 9, 45, 0)).toISOString(),
  },
];
