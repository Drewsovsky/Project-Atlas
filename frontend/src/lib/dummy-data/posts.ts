import type { Post } from "@/types/post";

export const posts: Post[] = [
  {
    id: "p1",
    authorId: "u1",
    title: "Rustbound Sentinel",
    description: "Display piece with copper oxidation and controlled edge highlights.",
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526666923127-b2970f64b422?auto=format&fit=crop&w=1200&q=80",
    ],
    level: "display",
    genre: "sci-fi",
    likes: 493,
    createdAt: "2026-02-21T13:10:00.000Z",
  },
  {
    id: "p2",
    authorId: "u2",
    title: "Ashwood Rangers",
    description: "Gaming set with readable contrast designed for tabletop distance.",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
    ],
    level: "gaming",
    genre: "fantasy",
    likes: 312,
    createdAt: "2026-03-01T09:55:00.000Z",
  },
  {
    id: "p3",
    authorId: "u3",
    title: "Drowned Oracle Bust",
    description: "Cold skin tones, wet fabric textures, and subtle OSL accents.",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    ],
    level: "display",
    genre: "horror",
    likes: 701,
    createdAt: "2026-01-14T17:25:00.000Z",
  },
  {
    id: "p4",
    authorId: "u1",
    title: "Iron Chapel Guard",
    description: "Gaming hero model with fast metallic workflow and matte varnish.",
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    ],
    level: "gaming",
    genre: "grimdark",
    likes: 228,
    createdAt: "2026-03-10T11:40:00.000Z",
  },
  {
    id: "p5",
    authorId: "u2",
    title: "Verdant Warden",
    description: "Forest palette study featuring muted greens and warm leather.",
    images: [
      "https://images.unsplash.com/photo-1518186233392-c232efbf2373?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80",
    ],
    level: "display",
    genre: "fantasy",
    likes: 419,
    createdAt: "2026-02-05T15:00:00.000Z",
  },
];
