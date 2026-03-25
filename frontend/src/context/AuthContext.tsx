"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "@/services/authService";
import type { User } from "@/types/user";
import type { NewUserData } from "@/services/userService";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  refreshSessionUser: () => Promise<void>;
  register: (
    username: string,
    password: string,
    userData: Omit<NewUserData, 'username'>
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
    const loadSession = async () => {
      await refreshSessionUser();
      setIsLoading(false);
    };

    void loadSession();
  }, [refreshSessionUser]);

  const login = useCallback(async (username: string, password: string) => {
    const result = await authService.login(username, password);

    if (!result.success) {
      return result.error;
    }

    setUser(result.user);
    return null;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);
  
  const register = useCallback(
    async (
      username: string,
      password: string,
      userData: Omit<NewUserData, 'username'>
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
