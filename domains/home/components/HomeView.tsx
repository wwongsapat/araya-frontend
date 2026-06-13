"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Heart, DollarSign, ArrowRight } from "lucide-react";
import { useAuth } from "@/shared/auth";

export default function HomeView() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const displayName = user?.firstName || "Araya";

  const cards = [
    {
      title: "House",
      description: "Manage rooms, appliances, smart automation, and security feeds.",
      icon: Home,
      href: "/house",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "hover:border-blue-500/30",
    },
    {
      title: "Health Trends",
      description: "Track blood pressure, heart rate, physical activities, and medications.",
      icon: Heart,
      href: "/people/health",
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "hover:border-red-500/30",
    },
    {
      title: "Family Finance",
      description: "Review bank deposits, monthly budgets, investments, and expenses.",
      icon: DollarSign,
      href: "/people/finance",
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "hover:border-green-500/30",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 space-y-12">
      {/* Hero section */}
      <header className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
          {greeting}, {displayName}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
          Welcome back to your family ERP workspace. Monitor health vitals, track expenses, and manage household configurations from one unified hub.
        </p>
      </header>

      {/* Grid of Domains */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative flex flex-col justify-between p-6 bg-white dark:bg-[#1c1c1e] rounded-[24px] border border-black/5 dark:border-white/5 ${card.borderColor} shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]`}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${card.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-1.5 text-sm font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0">
                Explore <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
