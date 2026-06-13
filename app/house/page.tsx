"use client";

import { AuthGuard } from "@/shared/auth";
import { HouseView } from "@/domains/house";

export default function HousePage() {
  return (
    <AuthGuard>
      <main className="min-h-screen">
        <HouseView />
      </main>
    </AuthGuard>
  );
}
