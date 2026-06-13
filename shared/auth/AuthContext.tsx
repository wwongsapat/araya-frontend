"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
  refreshToken as apiRefresh,
} from "./authService";
import { decodeToken } from "./tokenUtils";

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}

function extractUser(accessToken: string): AuthUser | null {
  const decoded = decodeToken(accessToken);
  if (!decoded) return null;
  return {
    id: decoded.sub,
    email: decoded.email || "",
    firstName: decoded.first_name || "",
    role: decoded.role || "",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: attempt silent refresh to restore session from HttpOnly cookie
  useEffect(() => {
    let cancelled = false;

    async function tryRestore() {
      try {
        const accessToken = await apiRefresh();
        if (!cancelled) {
          setUser(extractUser(accessToken));
        }
      } catch {
        // No valid refresh cookie — user is a guest
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    tryRestore();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const accessToken = await apiLogin(email, password);
    setUser(extractUser(accessToken));
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string) => {
    await apiRegister(email, password, firstName);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
