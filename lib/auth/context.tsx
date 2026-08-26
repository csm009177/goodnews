"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Role, hasPermission } from "@/lib/utils/roles";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  choirPart?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// TODO: 실제 API 연동
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@goodnews.kr": {
    password: "admin123",
    user: {
      id: "1",
      name: "관리자",
      email: "admin@goodnews.kr",
      role: "ADMIN",
      joinedAt: "2026-01-01T00:00:00Z",
    },
  },
  "pastor@goodnews.kr": {
    password: "pastor123",
    user: {
      id: "2",
      name: "목사님",
      email: "pastor@goodnews.kr",
      role: "PASTOR",
      joinedAt: "2026-01-01T00:00:00Z",
    },
  },
  "conductor@goodnews.kr": {
    password: "conductor123",
    user: {
      id: "3",
      name: "지휘자",
      email: "conductor@goodnews.kr",
      role: "CONDUCTOR",
      choirPart: "지휘",
      joinedAt: "2026-01-01T00:00:00Z",
    },
  },
  "member@goodnews.kr": {
    password: "member123",
    user: {
      id: "4",
      name: "합창단원",
      email: "member@goodnews.kr",
      role: "CHOIR_MEMBER",
      choirPart: "소프라노",
      joinedAt: "2026-03-01T00:00:00Z",
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 세션 복원
    const storedUser = localStorage.getItem("goodnews_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("goodnews_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const demoUser = DEMO_USERS[email];
      if (!demoUser || demoUser.password !== password) {
        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
      }

      setUser(demoUser.user);
      localStorage.setItem("goodnews_user", JSON.stringify(demoUser.user));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("goodnews_user");
  }, []);

  const checkPermission = useCallback(
    (requiredRole: Role) => {
      if (!user) return false;
      return hasPermission(user.role, requiredRole);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        hasPermission: checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}