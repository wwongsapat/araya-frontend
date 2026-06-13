"use client";

import React from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

/**
 * Wrap any page content with <AuthGuard> to require authentication.
 * - While auth is loading → shows a minimal loading skeleton
 * - If not authenticated → redirects to /login
 * - If authenticated → renders children
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#007aff] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Will redirect via the useEffect above; render nothing while redirecting
    return null;
  }

  return <>{children}</>;
}
