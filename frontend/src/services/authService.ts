import { userService } from "@/services/userService";
import type { User } from "@/types/user";
import type { NewUserData } from "@/services/userService";

const SESSION_KEY = "atlas-session-user-id";

const demoCredentials: Record<string, string> = {
  user: "user123",
  admin: "admin123",
};

export type LoginResult =
  | { success: true; user: User }
  | { success: false; error: string };

export type RegisterResult =
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

const register = async (
  username: string,
  password: string,
  userData: Omit<NewUserData, 'username'>
): Promise<RegisterResult> => {
  const normalizedUsername = username.trim().toLowerCase();
  
  // Validate username
  if (!normalizedUsername) {
    return {
      success: false,
      error: "Username is required.",
    };
  }
  
  if (normalizedUsername.length < 3) {
    return {
      success: false,
      error: "Username must be at least 3 characters long.",
    };
  }
  
  // Check if username already exists
  const existingUser = await userService.getUserByUsername(normalizedUsername);
  if (existingUser) {
    return {
      success: false,
      error: "Username is already taken.",
    };
  }
  
  // Validate password
  if (!password || password.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters long.",
    };
  }
  
  // Validate name
  if (!userData.name?.trim()) {
    return {
      success: false,
      error: "Name is required.",
    };
  }
  
  try {
    // Create the user
    const newUser = await userService.createUser({
      username: normalizedUsername,
      name: userData.name.trim(),
      bio: userData.bio?.trim() || "",
      links: userData.links?.filter(link => link.trim()) || [],
    });
    
    // Store credentials for future login
    demoCredentials[normalizedUsername] = password;
    
    // Log the user in automatically
    setStoredUserId(newUser.id);
    
    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to create account. Please try again.",
    };
  }
};

export const authService = {
  getSessionUser,
  login,
  logout,
  register,
};
