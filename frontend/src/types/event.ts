export type Event = {
  id: string;
  title: string;
  cover: string;
  description: string;
  date: string;
  createdBy: string;
  createdAt: string;
};

export type EventNews = {
  id: string;
  eventId: string;
  cover: string;
  title: string;
  text: string;
  createdAt: string;
};

export type NewEventNews = Omit<EventNews, "id" | "createdAt">;

export type EventNewsPatch = Partial<Omit<EventNews, "id" | "eventId" | "createdAt">>;
