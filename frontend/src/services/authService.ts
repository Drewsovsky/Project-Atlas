import { supabase } from '@/lib/supabase/client';
import { userService } from "@/services/userService";
import type { User } from "@/types/user";
import type { NewUserData } from "@/services/userService";

export type LoginResult =
  | { success: true; user: User }
  | { success: false; error: string };

export type RegisterResult =
  | { success: true; user: User }
  | { success: false; error: string };

const getSessionUser = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return null;
  }

  try {
    const user = await userService.getUserById(session.user.id);
    return user ?? null;
  } catch {
    return null;
  }
};

const login = async (email: string, password: string): Promise<LoginResult> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.session) {
    return {
      success: false,
      error: error?.message ?? "Sign in failed. Please try again.",
    };
  }

  try {
    const user = await userService.getUserById(data.user.id);
    if (!user) {
      return {
        success: false,
        error: "Account found but user profile could not be retrieved.",
      };
    }
    return { success: true, user };
  } catch {
    return {
      success: false,
      error: "Failed to retrieve user profile. Please try again.",
    };
  }
};

const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};

const register = async (
  username: string,
  password: string,
  userData: Omit<NewUserData, 'nickname'>
): Promise<RegisterResult> => {
  const normalizedUsername = username.trim().toLowerCase();

  if (!normalizedUsername || normalizedUsername.length < 3) {
    return {
      success: false,
      error: "Username must be at least 3 characters long.",
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters long.",
    };
  }

  if (!userData.name?.trim()) {
    return {
      success: false,
      error: "Name is required.",
    };
  }

  // Create Supabase auth user
  const { data, error } = await supabase.auth.signUp({
    email: userData.email.trim(),
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message ?? "Registration failed. Please try again.",
    };
  }

  try {
    // Create profile in the .NET backend (JWT is automatically attached via apiClient interceptor)
    const newUser = await userService.createUser({
      nickname: normalizedUsername,
      name: userData.name.trim(),
      email: userData.email.trim(),
      pictureUrl: userData.pictureUrl?.trim() || undefined,
      aboutMe: userData.aboutMe?.trim() || undefined,
      activityScore: 0,
    });

    return { success: true, user: newUser };
  } catch {
    // Roll back Supabase user if profile creation fails
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Failed to create user profile. Please try again.",
    };
  }
};

export const authService = {
  getSessionUser,
  login,
  logout,
  register,
};
