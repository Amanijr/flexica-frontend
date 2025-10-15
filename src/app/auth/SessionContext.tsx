"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { customAuth } from "@/app/auth/auth";

export interface Session {
  userId: string;
  email: string;
  role: "USER" | "ADMIN" | "VENDOR" | "ROLE_USER" | "ROLE_ADMIN" | "ROLE_VENDOR";
  username?: string;
  phone?: string;
  joinDate?: string;
  // extend as needed
}

interface SessionContextType {
  session: Session | null;
  loading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch session from backend
  const refreshSession = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await customAuth.getSession();
      if (!data) {
        setSession(null);
      } else {
        setSession(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch session");
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  //  Logout
  const logout = async () => {
    await customAuth.logout();
    setSession(null);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, loading, error, refreshSession, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return context;
}
export { customAuth };

