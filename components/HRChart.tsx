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
import { HealthData } from "./utils";

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
          {data.period === "Average" && <div className="w-2 h-2 rounded-full bg-[#8e8e93]" />}
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

const MinimalDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  // Protect against Recharts animation NaN bugs during domain changes
  if (typeof cx !== "number" || isNaN(cx) || typeof cy !== "number" || isNaN(cy)) {
    return null;
  }

  if (payload.period === "Average") {
    return <circle cx={cx} cy={cy} r={3} fill="#8e8e93" stroke="none" />;
  }

  let color = "#ff9500"; 
  if (payload.period === "Afternoon") color = "#ff3b30";
  if (payload.period === "Night") color = "#5e5ce6"; 

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
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart data={data} syncId="healthChart" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
