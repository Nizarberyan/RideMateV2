"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { User, AuthResponse } from "@repo/api-client";
import { client } from "../lib/api";

type AuthContextType = {
  user: User | null;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshAuth = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const response = await client.auth.refresh(refreshToken);
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        return true;
      }
    } catch (e) {
      console.error("Token refresh failed", e);
      logout();
    }
    return false;
  }, []);

  const login = useCallback(
    (authData: AuthResponse) => {
      setUser(authData.user);
      localStorage.setItem("token", authData.access_token);
      localStorage.setItem("refresh_token", authData.refresh_token);
      router.push("/dashboard");
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await client.auth.logout();
    } catch (e) {
      console.error("Logout error", e);
    }
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Fetch current user profile to verify token
          const userData = await client.auth.getProfile();
          setUser(userData);
        } catch (error) {
          // Try to refresh
          const success = await refreshAuth();
          if (success) {
            const userData = await client.auth.getProfile();
            setUser(userData);
          } else {
            console.error("Token verification and refresh failed");
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Refresh interval every 45 mins
    const interval = setInterval(() => {
      if (localStorage.getItem("refresh_token")) {
        refreshAuth();
      }
    }, 1000 * 60 * 45);

    return () => clearInterval(interval);
  }, [logout, refreshAuth]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
