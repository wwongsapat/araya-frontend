"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import BPChart from "./BPChart";
import HRChart from "./HRChart";
import TableView from "./TableView";
import { HealthData, aggregateData } from "./utils";
import { subDays, format } from "date-fns";
import clsx from "clsx";

type Timeframe = "1W" | "1M" | "3M" | "ALL" | "CUSTOM";

interface DashboardProps {
  initialData: HealthData[];
}

// ── Dual Range Slider ──────────────────────────────────────────────────────────
interface DualRangeSliderProps {
  start: number;
  end: number;
  onStartChange: (v: number) => void;
  onEndChange: (v: number) => void;
}

function DualRangeSlider({ start, end, onStartChange, onEndChange }: DualRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  // "start" | "end" → resize that thumb; "pan" → slide the whole range
  const dragging = useRef<"start" | "end" | "pan" | null>(null);
  const panAnchor = useRef<{ pct: number; start: number; end: number } | null>(null);
  const THUMB_ZONE = 6; // pct radius around a thumb that counts as grabbing it

  const pctFromClientX = useCallback((clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const pct = pctFromClientX(e.clientX);
    const distStart = Math.abs(pct - start);
    const distEnd = Math.abs(pct - end);

    if (distStart <= THUMB_ZONE && distStart <= distEnd) {
      dragging.current = "start";
    } else if (distEnd <= THUMB_ZONE) {
      dragging.current = "end";
    } else if (pct > start && pct < end) {
      // Click inside the filled band → pan mode
      dragging.current = "pan";
      panAnchor.current = { pct, start, end };
    } else {
      // Click outside both thumbs and range → jump nearest thumb
      dragging.current = distStart <= distEnd ? "start" : "end";
    }
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }, [start, end, pctFromClientX]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const pct = pctFromClientX(e.clientX);

    if (dragging.current === "pan" && panAnchor.current) {
      const delta = pct - panAnchor.current.pct;
      const span = panAnchor.current.end - panAnchor.current.start;
      let newStart = Math.round(panAnchor.current.start + delta);
      let newEnd = Math.round(panAnchor.current.end + delta);
      // Clamp so the window doesn't exceed [0, 100]
      if (newStart < 0) { newStart = 0; newEnd = span; }
      if (newEnd > 100) { newEnd = 100; newStart = 100 - span; }
      onStartChange(newStart);
      onEndChange(newEnd);
    } else if (dragging.current === "start") {
      onStartChange(Math.round(Math.min(pct, end - 1)));
    } else if (dragging.current === "end") {
      onEndChange(Math.round(Math.max(pct, start + 1)));
    }
  }, [start, end, pctFromClientX, onStartChange, onEndChange]);

  const onPointerUp = useCallback(() => {
    dragging.current = null;
    panAnchor.current = null;
  }, []);

  return (
    <div
      ref={trackRef}
      className="relative w-full h-7 cursor-pointer select-none touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Track */}
      <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full rounded-full bg-[#e3e3e8] dark:bg-[#3a3a3c]" />
      {/* Active fill — shows grab cursor to hint at panning */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-[#007aff] cursor-grab active:cursor-grabbing"
        style={{ left: `${start}%`, right: `${100 - end}%` }}
      />
      {/* Start thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-[#007aff] rounded-full shadow-md transition-transform hover:scale-110"
        style={{ left: `${start}%` }}
      />
      {/* End thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-[#007aff] rounded-full shadow-md transition-transform hover:scale-110"
        style={{ left: `${end}%` }}
      />
    </div>
  );
}
// ──────────────────────────────────────────────────────────────────────────────

export default function Dashboard({ initialData }: DashboardProps) {
  const [viewMode, setViewMode] = useState<"charts" | "table">("charts");
  const [timeframe, setTimeframe] = useState<Timeframe>("ALL");

  // Track slider as index range over the full aggregated dataset
  const [sliderStart, setSliderStart] = useState(0);
  const [sliderEnd, setSliderEnd] = useState(100);

  const handleTimeframeChange = (tf: Timeframe) => {
    setTimeframe(tf);
    if (initialData.length === 0) return;

    const latestTimestamp = Math.max(...initialData.map((d) => d.timestamp));
    const latestDate = new Date(latestTimestamp);
    const earliestTimestamp = initialData[0]?.timestamp || 0;
    const totalSpan = latestTimestamp - earliestTimestamp;

    let targetTime = earliestTimestamp;
    if (tf === "1W") targetTime = subDays(latestDate, 7).getTime();
    else if (tf === "1M") targetTime = subDays(latestDate, 31).getTime();
    else if (tf === "3M") targetTime = subDays(latestDate, 93).getTime();

    if (tf !== "CUSTOM" && totalSpan > 0) {
      const startPct = tf === "ALL"
        ? 0
        : Math.max(0, Math.round(((targetTime - earliestTimestamp) / totalSpan) * 100));
      setSliderStart(startPct);
      setSliderEnd(100);
    }
  };

  const MS_IN_DAY = 24 * 60 * 60 * 1000;

  // Compute visible domain from slider percentages over raw data timestamps
  const { earliestTs, latestTs } = useMemo(() => {
    if (initialData.length === 0) return { earliestTs: 0, latestTs: 0 };
    return {
      earliestTs: initialData[0].timestamp,
      latestTs: initialData[initialData.length - 1].timestamp,
    };
  }, [initialData]);

  const visibleDomain = useMemo(() => {
    const span = latestTs - earliestTs;
    return {
      start: earliestTs + (sliderStart / 100) * span,
      end: earliestTs + (sliderEnd / 100) * span,
    };
  }, [earliestTs, latestTs, sliderStart, sliderEnd]);

  const timeSpanMs = visibleDomain.end - visibleDomain.start;
  const days = timeSpanMs / MS_IN_DAY;

  let bucketMs = 0;
  if (days > 183) bucketMs = 30 * MS_IN_DAY;
  else if (days > 93) bucketMs = 14 * MS_IN_DAY;
  else if (days > 31) bucketMs = 3 * MS_IN_DAY;

  // Aggregate over the FULL dataset, then slice to the visible window
  const aggregatedData = useMemo(
    () => aggregateData(initialData, bucketMs),
    [initialData, bucketMs]
  );

  const chartData = useMemo(() => {
    return aggregatedData.filter(
      (d) => d.timestamp >= visibleDomain.start && d.timestamp <= visibleDomain.end
    );
  }, [aggregatedData, visibleDomain]);

  const rawVisibleData = useMemo(() => {
    return initialData.filter(
      (d) => d.timestamp >= visibleDomain.start && d.timestamp <= visibleDomain.end
    );
  }, [initialData, visibleDomain]);

  const timeframes: Timeframe[] = ["1W", "1M", "3M", "ALL"];

  const startLabel = format(new Date(visibleDomain.start || Date.now()), "MMM d, yyyy");
  const endLabel = format(new Date(visibleDomain.end || Date.now()), "MMM d, yyyy");

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 pb-20 space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Trends</h1>
          <p className="text-gray-500 mt-1">Review your Blood Pressure and Heart Rate history</p>
        </div>

        {/* Timeframe segmented control */}
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
            <div className="flex-1 md:w-20 py-1.5 text-sm font-medium rounded-lg text-center bg-white dark:bg-[#636366] text-blue-500 shadow-sm">
              Custom
            </div>
          )}
        </div>
      </header>

      {/* View Switcher */}
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
          <div className="grid grid-cols-1 gap-6">
            <BPChart data={chartData} />
            <HRChart data={chartData} />
          </div>

          {/* Native dual-range timeline slider — zero SVG geometry, zero NaN */}
          <div className="apple-card mt-4 p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Timeline</span>
              <span className="text-xs font-medium text-[#007aff]">
                {startLabel} – {endLabel}
              </span>
            </div>

            <DualRangeSlider
              start={sliderStart}
              end={sliderEnd}
              onStartChange={(v) => { setSliderStart(v); setTimeframe("CUSTOM"); }}
              onEndChange={(v) => { setSliderEnd(v); setTimeframe("CUSTOM"); }}
            />

            <div className="flex justify-between mt-3 text-[10px] text-gray-400 font-medium">
              <span>{format(new Date(earliestTs || Date.now()), "MMM yyyy")}</span>
              <span>{format(new Date(latestTs || Date.now()), "MMM yyyy")}</span>
            </div>
          </div>

          {bucketMs > 0 && (
            <div className="apple-card bg-green-50/50 dark:bg-green-900/10 border-none">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  Aggregation active — showing {days > 183 ? "monthly" : days > 93 ? "2-week" : "3-day"} averages for clarity.
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <TableView data={rawVisibleData} />
      )}
    </div>
  );
}
