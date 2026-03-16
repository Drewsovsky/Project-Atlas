import { eventNews as sourceEventNews, events as sourceEvents } from "@/lib/dummy-data/events";
import type { Event, EventNews, EventNewsPatch, NewEventNews } from "@/types/event";

type NewEvent = Omit<Event, "id" | "createdAt">;
type EventPatch = Partial<Omit<Event, "id" | "createdAt">>;

type EventService = {
  getEvents: () => Promise<Event[]>;
  getEventById: (id: string) => Promise<Event | undefined>;
  getEventNewsByEventId: (eventId: string) => Promise<EventNews[]>;
  createEventNews: (news: NewEventNews) => Promise<EventNews>;
  editEventNews: (newsId: string, patch: EventNewsPatch) => Promise<EventNews | undefined>;
  deleteEventNews: (newsId: string) => Promise<void>;
  createEvent: (event: NewEvent) => Promise<Event>;
  editEvent: (eventId: string, patch: EventPatch) => Promise<Event | undefined>;
};

let events = [...sourceEvents];
let eventNews = [...sourceEventNews];

const getEvents = async (): Promise<Event[]> => {
  return [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
};

const getEventById = async (id: string): Promise<Event | undefined> => {
  return events.find((event) => event.id === id);
};

const getEventNewsByEventId = async (eventId: string): Promise<EventNews[]> => {
  return [...eventNews]
    .filter((item) => item.eventId === eventId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

const createEventNews = async (news: NewEventNews): Promise<EventNews> => {
  const maxId = eventNews.reduce((max, item) => {
    const parsed = Number(item.id.replace(/^n/, ""));
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
  }, 0);

  const created: EventNews = {
    ...news,
    id: `n${maxId + 1}`,
    createdAt: new Date().toISOString(),
  };

  eventNews = [created, ...eventNews];
  return created;
};

const editEventNews = async (
  newsId: string,
  patch: EventNewsPatch,
): Promise<EventNews | undefined> => {
  let updatedNews: EventNews | undefined;

  eventNews = eventNews.map((item) => {
    if (item.id !== newsId) {
      return item;
    }

    updatedNews = {
      ...item,
      ...patch,
    };

    return updatedNews;
  });

  return updatedNews;
};

const deleteEventNews = async (newsId: string): Promise<void> => {
  eventNews = eventNews.filter((item) => item.id !== newsId);
};

const createEvent = async (event: NewEvent): Promise<Event> => {
  const created: Event = {
    ...event,
    id: `e${events.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  events = [...events, created];
  return created;
};

const editEvent = async (
  eventId: string,
  patch: EventPatch,
): Promise<Event | undefined> => {
  let updated: Event | undefined;

  events = events.map((event) => {
    if (event.id !== eventId) {
      return event;
    }

    updated = { ...event, ...patch };
    return updated;
  });

  return updated;
};

export const eventService: EventService = {
  getEvents,
  getEventById,
  getEventNewsByEventId,
  createEventNews,
  editEventNews,
  deleteEventNews,
  createEvent,
  editEvent,
};
