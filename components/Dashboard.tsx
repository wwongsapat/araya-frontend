"use client";

import React, { useState, useEffect } from "react";
import BPChart from "./BPChart";
import HRChart from "./HRChart";
import TableView from "./TableView";
import { HealthData } from "./DataProvider";
import { subDays, subMonths } from "date-fns";
import clsx from "clsx";

type Timeframe = "1W" | "1M" | "3M" | "ALL" | "CUSTOM";

interface DashboardProps {
  initialData: HealthData[];
}

export default function Dashboard({ initialData }: DashboardProps) {
  const [viewMode, setViewMode] = useState<"charts" | "table">("charts");
  const [timeframe, setTimeframe] = useState<Timeframe>("ALL");
  const [brushState, setBrushState] = useState<{ startIndex?: number; endIndex?: number }>({
    startIndex: 0,
    endIndex: initialData.length > 0 ? initialData.length - 1 : 0,
  });

  // Calculate default indices when timeframe buttons are clicked
  const handleTimeframeChange = (tf: Timeframe) => {
    setTimeframe(tf);

    if (initialData.length === 0) return;

    const latestTimestamp = Math.max(...initialData.map((d) => d.timestamp));
    const latestDate = new Date(latestTimestamp);
    
    let targetTime = 0;
    if (tf === "1W") targetTime = subDays(latestDate, 7).getTime();
    else if (tf === "1M") targetTime = subMonths(latestDate, 1).getTime();
    else if (tf === "3M") targetTime = subMonths(latestDate, 3).getTime();
    else if (tf === "ALL") targetTime = 0;

    if (tf !== "CUSTOM") {
      let startIndex = initialData.findIndex((d) => d.timestamp >= targetTime);
      if (startIndex === -1) startIndex = 0; 
      
      setBrushState({
        startIndex,
        endIndex: initialData.length - 1,
      });
    }
  };

  const handleBrushChange = (newBrush: any) => {
    setBrushState({
      startIndex: newBrush.startIndex,
      endIndex: newBrush.endIndex,
    });
    setTimeframe("CUSTOM");
  };

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
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
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
          {timeframe === "CUSTOM" && (
            <div className="flex-1 md:w-20 py-1.5 text-sm font-medium rounded-lg text-center bg-white dark:bg-[#636366] text-blue-500 shadow-sm transition-all duration-200">
              Custom
            </div>
          )}
        </div>
      </header>
      
      {/* Top View Switcher */}
      <div className="flex justify-center mb-2">
        <div className="flex bg-[#e3e3e8] dark:bg-[#2c2c2e] p-1 rounded-xl w-full md:w-auto shadow-inner">
          <button
            onClick={() => setViewMode("charts")}
            className={clsx(
              "flex-1 md:w-24 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200",
              viewMode === "charts" 
                ? "bg-white dark:bg-[#636366] text-black dark:text-white shadow-sm" 
                : "text-gray-500 hover:text-black dark:hover:text-white"
            )}
          >
            Charts
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={clsx(
              "flex-1 md:w-24 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200",
              viewMode === "table" 
                ? "bg-white dark:bg-[#636366] text-black dark:text-white shadow-sm" 
                : "text-gray-500 hover:text-black dark:hover:text-white"
            )}
          >
            List
          </button>
        </div>
      </div>

      {viewMode === "charts" ? (
        <>
          {/* Grid Layout for Charts */}
          <div className="grid grid-cols-1 gap-6">
            <BPChart 
              data={initialData} 
              brushState={brushState} 
              onBrushChange={handleBrushChange} 
            />
            <HRChart data={initialData} />
          </div>

          <div className="apple-card mt-8 bg-blue-50/50 dark:bg-blue-900/10 border-none">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p className="text-sm font-medium flex-1">
                Tip: Drag the handles on the interactive slider under the Blood Pressure chart to scrub through historical periods. The Heart Rate chart will automatically sync.
              </p>
            </div>
          </div>
        </>
      ) : (
        <TableView data={initialData} />
      )}
    </div>
  );
}
