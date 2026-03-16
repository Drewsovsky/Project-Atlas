import { userService } from "@/services/userService";
import type { User } from "@/types/user";

const SESSION_KEY = "atlas-session-user-id";

const demoCredentials: Record<string, string> = {
  user: "user123",
  admin: "admin123",
};

export type LoginResult =
  | { success: true; user: User }
  | { success: false; error: string };

const getStoredUserId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(SESSION_KEY);
};

const setStoredUserId = (userId: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, userId);
};

const clearStoredUserId = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
};

const getSessionUser = async (): Promise<User | null> => {
  const userId = getStoredUserId();
  if (!userId) {
    return null;
  }

  const user = await userService.getUserById(userId);
  return user ?? null;
};

const login = async (username: string, password: string): Promise<LoginResult> => {
  const normalizedUsername = username.trim().toLowerCase();
  const expectedPassword = demoCredentials[normalizedUsername];

  if (!expectedPassword || expectedPassword !== password) {
    return {
      success: false,
      error: "Invalid username or password.",
    };
  }

  const user = await userService.getUserByUsername(normalizedUsername);

  if (!user) {
    return {
      success: false,
      error: "Demo account is not configured.",
    };
  }

  setStoredUserId(user.id);

  return {
    success: true,
    user,
  };
};

const logout = (): void => {
  clearStoredUserId();
};

export const authService = {
  getSessionUser,
  login,
  logout,
};
