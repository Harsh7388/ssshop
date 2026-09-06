"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "MANAGER" | "ADMIN" | string;
  phone?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshAuth: (newToken?: string) => Promise<UserProfile | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshAuth: async () => null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshAuth = async (newToken?: string): Promise<UserProfile | null> => {
    try {
      if (newToken && typeof window !== "undefined") {
        localStorage.setItem("ss_token", newToken);
      }
      
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("ss_token") : null;
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }

      const res = await fetch("/api/auth/me", {
        headers,
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          return data.user;
        } else {
          setUser(null);
          if (typeof window !== "undefined") localStorage.removeItem("ss_token");
          return null;
        }
      } else {
        setUser(null);
        if (typeof window !== "undefined") localStorage.removeItem("ss_token");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch auth user", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const logout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ss_token");
      }
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

