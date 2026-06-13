"use client";

import { useAuth } from "@/shared/auth";
import { HomeView, LandingView } from "@/domains/home";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#007aff] rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {isAuthenticated ? <HomeView /> : <LandingView />}
    </main>
  );
}
