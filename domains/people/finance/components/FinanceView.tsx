"use client";

import React from "react";
import { DollarSign, Wallet, PiggyBank, TrendingUp } from "lucide-react";

export default function FinanceView() {
  const previews = [
    { title: "Expense Logger", desc: "Categorize household transactions, bills, and grocery logs.", icon: Wallet, color: "text-blue-500" },
    { title: "Savings Targets", desc: "Manage interest rates, targets, and family savings plans.", icon: PiggyBank, color: "text-green-500" },
    { title: "Portfolio Tracking", desc: "Monitor mutual funds, stocks, and assets over time.", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16 md:py-24 text-center space-y-12">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto">
          <DollarSign className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Family Finance</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Account balances, automated deposit lists, and ledger registries are currently in development.
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
