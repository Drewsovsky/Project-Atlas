export type UserRole = "user" | "admin";

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  links: string[];
  rating: number;
  role: UserRole;
  banned: boolean;
  createdAt: string;
};
