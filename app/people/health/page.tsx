"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/shared/auth";
import { HealthDashboard } from "@/domains/people/health";
import type { HealthData } from "@/domains/people/health/types/health.types";

export default function HealthPage() {
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/health-data");
        const data = await res.json();
        setHealthData(data);
      } catch (err) {
        console.error("Failed to load health data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AuthGuard>
      <main className="min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-[#007aff] rounded-full animate-spin" />
          </div>
        ) : (
          <HealthDashboard initialData={healthData} />
        )}
      </main>
    </AuthGuard>
  );
}
