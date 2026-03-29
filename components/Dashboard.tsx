"use client";

import React, { useState, useMemo } from "react";
import BPChart from "./BPChart";
import HRChart from "./HRChart";
import { HealthData } from "./DataProvider";
import { subDays, subMonths, isAfter } from "date-fns";
import clsx from "clsx";

type Timeframe = "1W" | "1M" | "3M" | "ALL";

interface DashboardProps {
  initialData: HealthData[];
}

export default function Dashboard({ initialData }: DashboardProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("ALL");

  const filteredData = useMemo(() => {
    if (!initialData || initialData.length === 0) return [];
    
    // Determine the latest date in the dataset to calculate offsets relative to it
    // instead of real current date, so that the static sample dataset always works.
    const latestTimestamp = Math.max(...initialData.map(d => d.timestamp));
    const latestDate = new Date(latestTimestamp);

    return initialData.filter(d => {
      const date = new Date(d.timestamp);
      switch (timeframe) {
        case "1W":
          return isAfter(date, subDays(latestDate, 7));
        case "1M":
          return isAfter(date, subMonths(latestDate, 1));
        case "3M":
          return isAfter(date, subMonths(latestDate, 3));
        case "ALL":
        default:
          return true;
      }
    });
  }, [initialData, timeframe]);

  const timeframes: Timeframe[] = ["1W", "1M", "3M", "ALL"];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 pb-20 space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Trends</h1>
          <p className="text-gray-500 mt-1">Review your Blood Pressure and Heart Rate history</p>
        </div>
        
        {/* Apple style segmented control */}
        <div className="flex bg-[#e3e3e8] dark:bg-[#2c2c2e] p-1 rounded-xl w-full md:w-auto">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={clsx(
                "flex-1 md:w-16 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                timeframe === tf 
                  ? "bg-white dark:bg-[#636366] text-black dark:text-white shadow-sm" 
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </header>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-1 gap-6">
        <BPChart data={filteredData} />
        <HRChart data={filteredData} />
      </div>

      <div className="apple-card mt-8 bg-blue-50/50 dark:bg-blue-900/10 border-none">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <p className="text-sm font-medium">Tip: Use the timeframe selector above to zoom in and out of your historical health records.</p>
        </div>
      </div>
    </div>
  );
}
