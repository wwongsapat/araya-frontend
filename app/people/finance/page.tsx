"use client";

import { AuthGuard } from "@/shared/auth";
import { FinanceView } from "@/domains/people/finance";

export default function FinancePage() {
  return (
    <AuthGuard>
      <main className="min-h-screen">
        <FinanceView />
      </main>
    </AuthGuard>
  );
}
