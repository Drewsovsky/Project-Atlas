import { users } from "@/lib/dummy-data/users";
import type { User } from "@/types/user";

export type UserProfilePatch = {
  name: string;
  bio: string;
  links: string[];
};

export type NewUserData = {
  username: string;
  name: string;
  bio?: string;
  links?: string[];
};

type UserService = {
  getUsers: () => Promise<User[]>;
  getUserById: (id: string) => Promise<User | undefined>;
  getUserByUsername: (username: string) => Promise<User | undefined>;
  createUser: (userData: NewUserData) => Promise<User>;
  updateUserProfile: (
    id: string,
    patch: UserProfilePatch,
  ) => Promise<User | undefined>;
  updateUserRating: (id: string, rating: number) => Promise<User | undefined>;
  setUserBanStatus: (id: string, banned: boolean) => Promise<User | undefined>;
};

let usersStore: User[] = [...users];

const getUsers = async (): Promise<User[]> => {
  return [...usersStore];
};

const getUserById = async (id: string): Promise<User | undefined> => {
  return usersStore.find((user) => user.id === id);
};

const getUserByUsername = async (
  username: string,
): Promise<User | undefined> => {
  return usersStore.find((user) => user.username === username);
};

const createUser = async (userData: NewUserData): Promise<User> => {
  // Generate a unique ID
  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  const newUser: User = {
    id,
    name: userData.name,
    username: userData.username,
    avatar: "/avatars/default.jpg",
    bio: userData.bio || "",
    links: userData.links || [],
    rating: 0,
    role: "user",
    banned: false,
    createdAt: new Date().toISOString(),
  };

  usersStore.push(newUser);
  return newUser;
};

const updateUserProfile = async (
  id: string,
  patch: UserProfilePatch,
): Promise<User | undefined> => {
  let updatedUser: User | undefined;

  usersStore = usersStore.map((user) => {
    if (user.id !== id) {
      return user;
    }

    updatedUser = {
      ...user,
      name: patch.name,
      bio: patch.bio,
      links: patch.links,
    };

    return updatedUser;
  });

  return updatedUser;
};

const updateUserRating = async (
  id: string,
  rating: number,
): Promise<User | undefined> => {
  if (!Number.isFinite(rating) || rating < 0) {
    throw new Error("Rating must be a non-negative number.");
  }

  let updatedUser: User | undefined;

  usersStore = usersStore.map((user) => {
    if (user.id !== id) {
      return user;
    }

    updatedUser = {
      ...user,
      rating: Math.round(rating),
    };

    return updatedUser;
  });

  return updatedUser;
};

const setUserBanStatus = async (
  id: string,
  banned: boolean,
): Promise<User | undefined> => {
  let updatedUser: User | undefined;

  usersStore = usersStore.map((user) => {
    if (user.id !== id) {
      return user;
    }

    updatedUser = {
      ...user,
      banned,
    };

    return updatedUser;
  });

  return updatedUser;
};

export const userService: UserService = {
  getUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUserProfile,
  updateUserRating,
  setUserBanStatus,
};
