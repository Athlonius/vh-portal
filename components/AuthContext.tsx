"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "Manager" | "Sales" | "Operations";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

const MOCK_USERS: Record<string, { name: string; password: string; role: UserRole }> = {
  "eynur@vh-portal.ge":  { name: "Eynur Ahmadov",    password: "admin123", role: "Manager" },
  "nino@vh-portal.ge":   { name: "Nino Giorgadze",    password: "sales123", role: "Sales" },
  "lasha@vh-portal.ge":  { name: "Lasha Mchedlidze",  password: "sales123", role: "Sales" },
  "giorgi@vh-portal.ge": { name: "Giorgi Kvaratskhelia", password: "ops123", role: "Operations" },
};

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  ready: false,
  login: () => false,
  logout: () => {},
  isManager: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vh_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setReady(true);
  }, []);

  const login = (email: string, password: string): boolean => {
    const record = MOCK_USERS[email.toLowerCase()];
    if (!record || record.password !== password) return false;
    const u: AuthUser = { name: record.name, email: email.toLowerCase(), role: record.role };
    localStorage.setItem("vh_user", JSON.stringify(u));
    setUser(u);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("vh_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, isManager: user?.role === "Manager" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
