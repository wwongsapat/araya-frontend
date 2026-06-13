"use client";

import React from "react";
import { Home, Lightbulb, Thermometer, ShieldCheck } from "lucide-react";

export default function HouseView() {
  const previews = [
    { title: "Smart Lighting", desc: "Turn on/off lamps, set scenes, or schedule lighting.", icon: Lightbulb, color: "text-amber-500" },
    { title: "Climate Control", desc: "Monitor room temperature & adjust AC settings remotely.", icon: Thermometer, color: "text-blue-500" },
    { title: "Home Security", desc: "Check status of window/door sensors and camera streams.", icon: ShieldCheck, color: "text-green-500" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16 md:py-24 text-center space-y-12">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto">
          <Home className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">House Domain</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Smart household operations, sensor configurations, and automation dashboards are currently in development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {previews.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="p-5 bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/5 dark:border-white/5 space-y-3">
              <Icon className={`w-6 h-6 ${item.color}`} />
              <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
