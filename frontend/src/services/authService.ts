import { supabase } from '@/lib/supabase/client';
import { userService } from "@/services/userService";
import type { User } from "@/types/user";

export type LoginResult =
  | { success: true; user: User }
  | { success: true; requiresProfileSetup: true }
  | { success: false; error: string };

export type RegisterResult =
  | { success: true; requiresConfirmation: true }
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
      return { success: true, requiresProfileSetup: true };
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

const register = async (email: string, password: string): Promise<RegisterResult> => {
  if (!password || password.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters long.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message ?? "Registration failed. Please try again.",
    };
  }

  return { success: true, requiresConfirmation: true };
};

export const authService = {
  getSessionUser,
  login,
  logout,
  register,
};
