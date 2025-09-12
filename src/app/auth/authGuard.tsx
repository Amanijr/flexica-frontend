"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/auth/SessionContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading, error } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Authentication error: {error}</div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirecting...
  }

  return <>{children}</>;
}
