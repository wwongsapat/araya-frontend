"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { format } from "date-fns";
import { Sun, Moon, Sunset } from "lucide-react";
import { HealthData } from "./DataProvider";

interface BPChartProps {
  data: HealthData[];
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;

  let Icon = Sun;
  let color = "#ff9500"; // Morning (Orange)

  if (payload.period === "Afternoon") {
    Icon = Sunset;
    color = "#ff3b30"; // Afternoon (Red)
  } else if (payload.period === "Night") {
    Icon = Moon;
    color = "#5e5ce6"; // Night (Purple)
  }

  // Offset the dot so it centers on the line coordinate
  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="none" viewBox="0 0 24 24">
      <Icon color={color} size={20} strokeWidth={2.5} />
    </svg>
  );
};

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
        <p className="text-[#ff3b30] font-semibold text-sm">
          Systolic: {data.systolic} mmHg
        </p>
        <p className="text-[#007aff] font-semibold text-sm">
          Diastolic: {data.diastolic} mmHg
        </p>
      </div>
    );
  }
  return null;
};

export default function BPChart({ data }: BPChartProps) {
  // If no data, return empty state
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No Data Available
      </div>
    );
  }

  // Calculate safe min max bounds for robust visualization
  const minDiastolic = Math.min(...data.map(d => d.diastolic)) - 10;
  const maxSystolic = Math.max(...data.map(d => d.systolic)) + 10;

  return (
    <div className="apple-card w-full h-[350px]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Blood Pressure</h2>
        <p className="text-sm text-gray-500">Systolic & Diastolic Trends</p>
      </div>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Apple style soft grid */}
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
              domain={[minDiastolic, maxSystolic]} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-apple-gray)" }}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-apple-gray-light)', strokeWidth: 2 }} />
            
            {/* Healthy Range Area */}
            <ReferenceArea y1={80} y2={120} fill="#34c759" fillOpacity={0.05} />

            <Line
              type="monotone"
              dataKey="systolic"
              stroke="#ff3b30"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#ff3b30" }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              stroke="#007aff"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#007aff" }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
