export type PostLevel = "gaming" | "display";

export const MAX_POST_IMAGES = 4;
export const MAX_POST_IMAGE_BYTES = 36 * 1024 * 1024;

export type Post = {
  id: string;
  authorId: string;
  title: string;
  description: string;
  images: string[];
  level: PostLevel;
  genre: string;
  likes: number;
  createdAt: string;
};

export type CreatePostInput = {
  title: string;
  description: string;
  images: string[];
  level: PostLevel;
  genre: string;
};

export type PostSort = "new" | "popular";
