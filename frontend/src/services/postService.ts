import { posts as sourcePosts } from "@/lib/dummy-data/posts";
import {
  MAX_POST_IMAGES,
  type CreatePostInput,
  type Post,
  type PostLevel,
  type PostSort,
} from "@/types/post";

export type PostQuery = {
  level?: PostLevel;
  genre?: string;
  sort?: PostSort;
};

type PostService = {
  getPosts: (query?: PostQuery) => Promise<Post[]>;
  getPostById: (id: string) => Promise<Post | undefined>;
  getPostsByAuthorId: (authorId: string) => Promise<Post[]>;
  createPost: (authorId: string, input: CreatePostInput) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
};

let posts = [...sourcePosts];

const sortPosts = (items: Post[], sort: PostSort): Post[] => {
  if (sort === "popular") {
    return [...items].sort((a, b) => b.likes - a.likes);
  }

  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

const getPosts = async (query?: PostQuery): Promise<Post[]> => {
  let filtered = [...posts];

  if (query?.level) {
    filtered = filtered.filter((post) => post.level === query.level);
  }

  if (query?.genre) {
    filtered = filtered.filter((post) => post.genre === query.genre);
  }

  return sortPosts(filtered, query?.sort ?? "new");
};

const getPostById = async (id: string): Promise<Post | undefined> => {
  return posts.find((post) => post.id === id);
};

const getPostsByAuthorId = async (authorId: string): Promise<Post[]> => {
  return posts.filter((post) => post.authorId === authorId);
};

const createPost = async (authorId: string, input: CreatePostInput): Promise<Post> => {
  if (!input.title.trim() || !input.description.trim() || !input.genre.trim()) {
    throw new Error("Title, description, and genre are required.");
  }

  if (!input.images.length) {
    throw new Error("At least one image is required.");
  }

  if (input.images.length > MAX_POST_IMAGES) {
    throw new Error(`Maximum ${MAX_POST_IMAGES} images are allowed.`);
  }

  const created: Post = {
    id: `p${posts.length + 1}`,
    authorId,
    title: input.title.trim(),
    description: input.description.trim(),
    images: input.images,
    level: input.level,
    genre: input.genre.trim().toLowerCase(),
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  posts = [created, ...posts];

  return created;
};

const deletePost = async (id: string): Promise<void> => {
  posts = posts.filter((post) => post.id !== id);
};

export const postService: PostService = {
  getPosts,
  getPostById,
  getPostsByAuthorId,
  createPost,
  deletePost,
};
