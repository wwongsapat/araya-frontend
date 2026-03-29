"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Sun, Moon, Sunset, Heart } from "lucide-react";
import { HealthData } from "./DataProvider";

interface HRChartProps {
  data: HealthData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as HealthData;
    return (
      <div className="bg-white dark:bg-[#1c1c1e] p-3 rounded-xl shadow-lg border border-black/5 dark:border-white/10">
        <p className="text-xs text-gray-500 font-medium mb-1">
          {format(new Date(data.timestamp), "MMM d, yyyy - h:mm a")}
        </p>
        <div className="flex items-center gap-2 mb-2">
          {data.period === "Morning" && <Sun size={14} className="text-[#ff9500]" />}
          {data.period === "Afternoon" && <Sunset size={14} className="text-[#ff3b30]" />}
          {data.period === "Night" && <Moon size={14} className="text-[#5e5ce6]" />}
          <span className="text-sm font-semibold">{data.period}</span>
        </div>
        <p className="text-[#ff2d55] font-semibold text-lg flex items-center gap-1">
          <Heart size={16} fill="#ff2d55" className="animate-pulse" />
          {data.heart_rate} <span className="text-sm text-gray-500 font-normal">BPM</span>
        </p>
      </div>
    );
  }
  return null;
};

// We don't render big symbols on the line itself here to keep it distinct from BP chart,
// but we still could. The prompt mentioned "symbol that indicate morning... on each datapoint".
// Let's implement minimal dot variant for Heart Rate

const MinimalDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  let color = "#ff9500"; // Morning (Orange)
  if (payload.period === "Afternoon") color = "#ff3b30"; // Afternoon (Red)
  if (payload.period === "Night") color = "#5e5ce6"; // Night (Purple)

  return (
    <circle cx={cx} cy={cy} r={4} fill={color} stroke="white" strokeWidth={2} />
  );
};

export default function HRChart({ data }: HRChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No Data Available
      </div>
    );
  }

  const minHR = Math.max(0, Math.min(...data.map(d => d.heart_rate)) - 10);
  const maxHR = Math.max(...data.map(d => d.heart_rate)) + 10;

  return (
    <div className="apple-card w-full h-[350px]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Heart Rate</h2>
        <p className="text-sm text-gray-500">Beats Per Minute (BPM)</p>
      </div>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff2d55" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff2d55" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-apple-gray-light)" />
            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(unixTime) => format(new Date(unixTime), "MMM d")}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-apple-gray)" }}
              dy={10}
            />
            <YAxis 
              domain={[minHR, maxHR]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-apple-gray)" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-apple-gray-light)', strokeWidth: 2 }} />
            <Area
              type="monotone"
              dataKey="heart_rate"
              stroke="#ff2d55"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorHr)"
              dot={<MinimalDot />}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#ff2d55" }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
