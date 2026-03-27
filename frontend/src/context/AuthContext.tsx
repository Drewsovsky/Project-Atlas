"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase/client";
import { authService } from "@/services/authService";
import type { User } from "@/types/user";
import type { NewUserData } from "@/services/userService";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshSessionUser: () => Promise<void>;
  register: (
    username: string,
    password: string,
    userData: Omit<NewUserData, 'nickname'>
  ) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSessionUser = useCallback(async () => {
    const sessionUser = await authService.getSessionUser();
    setUser(sessionUser);
  }, []);

  useEffect(() => {
    // Load initial session
    const loadSession = async () => {
      await refreshSessionUser();
      setIsLoading(false);
    };

    void loadSession();

    // Subscribe to Supabase auth state changes (token refresh, sign-out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await refreshSessionUser();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSessionUser]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);

    if (!result.success) {
      return result.error;
    }

    setUser(result.user);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const register = useCallback(
    async (
      username: string,
      password: string,
      userData: Omit<NewUserData, 'nickname'>
    ) => {
      const result = await authService.register(username, password, userData);

      if (!result.success) {
        return result.error;
      }

      setUser(result.user);
      return null;
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAdmin: user?.role === "admin",
      login,
      logout,
      refreshSessionUser,
      register,
    }),
    [isLoading, login, logout, refreshSessionUser, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
