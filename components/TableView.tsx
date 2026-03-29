"use client";

import React, { useState, useMemo } from "react";
import { HealthData } from "./utils";
import { format } from "date-fns";
import { ChevronUp, ChevronDown, ChevronsUpDown, Sun, Sunset, Moon, Activity, Heart } from "lucide-react";
import clsx from "clsx";

interface TableViewProps {
  data: HealthData[];
}

type SortField = "timestamp" | "systolic" | "diastolic" | "heart_rate" | "period";
type SortOrder = "asc" | "desc";

export default function TableView({ data }: TableViewProps) {
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc"); // Default to desc when changing to numeric/date columns
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle period string sorting properly
      if (sortField === "period") {
        const orderWeight = { Morning: 1, Afternoon: 2, Night: 3 };
        aVal = orderWeight[a.period as "Morning" | "Afternoon" | "Night"];
        bVal = orderWeight[b.period as "Morning" | "Afternoon" | "Night"];
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortOrder]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ChevronsUpDown size={14} className="text-gray-300 dark:text-gray-600" />;
    return sortOrder === "asc" ? <ChevronUp size={14} className="text-blue-500" /> : <ChevronDown size={14} className="text-blue-500" />;
  };

  const getPeriodIcon = (period: string) => {
    if (period === "Morning") return <Sun size={14} className="text-[#ff9500]" />;
    if (period === "Afternoon") return <Sunset size={14} className="text-[#ff3b30]" />;
    return <Moon size={14} className="text-[#5e5ce6]" />;
  };

  if (data.length === 0) {
    return (
      <div className="apple-card py-12 flex flex-col items-center justify-center text-center">
        <Activity size={48} className="text-gray-200 dark:text-gray-700 mb-4" />
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">No Data Available</h3>
        <p className="text-gray-500">There are no health records to display.</p>
      </div>
    );
  }

  return (
    <div className="apple-card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-white/5">
              <th 
                onClick={() => handleSort("timestamp")}
                className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  Date & Time {renderSortIcon("timestamp")}
                </div>
              </th>
              <th 
                onClick={() => handleSort("period")}
                className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  Period {renderSortIcon("period")}
                </div>
              </th>
              <th 
                onClick={() => handleSort("systolic")}
                className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  Systolic {renderSortIcon("systolic")}
                </div>
              </th>
              <th 
                onClick={() => handleSort("diastolic")}
                className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  Diastolic {renderSortIcon("diastolic")}
                </div>
              </th>
              <th 
                onClick={() => handleSort("heart_rate")}
                className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors select-none"
              >
                <div className="flex items-center gap-2 whitespace-nowrap">
                  Heart Rate {renderSortIcon("heart_rate")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {sortedData.map((row, idx) => (
              <tr 
                key={`${row.timestamp}-${idx}`} 
                className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {format(new Date(row.timestamp), "MMM d, yyyy")}
                  <span className="text-gray-400 font-normal ml-2">
                    {format(new Date(row.timestamp), "h:mm a")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getPeriodIcon(row.period)}
                    {row.period}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx(
                    "text-sm font-semibold", 
                    row.systolic >= 140 ? "text-red-500" : row.systolic <= 90 ? "text-blue-500" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {row.systolic}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx(
                    "text-sm font-semibold", 
                    row.diastolic >= 90 ? "text-red-500" : row.diastolic <= 60 ? "text-blue-500" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {row.diastolic}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {row.heart_rate >= 100 ? (
                      <Heart size={14} className="text-red-500" />
                    ) : (
                      <Heart size={14} className="text-gray-400 group-hover:text-pink-500 transition-colors" />
                    )}
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {row.heart_rate}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
