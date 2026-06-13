"use client";

import React from "react";
import Link from "next/link";
import { Heart, DollarSign, Home, ArrowRight, Shield } from "lucide-react";

export default function LandingView() {
  const features = [
    {
      title: "Health Tracking",
      description: "Monitor blood pressure, heart rate, and medication schedules with interactive charts.",
      icon: Heart,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Family Finance",
      description: "Track savings, expenses, bank deposits, and investment portfolios in one place.",
      icon: DollarSign,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Smart House",
      description: "Control lighting, monitor climate, and manage home security feeds remotely.",
      icon: Home,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 md:px-6 pt-16 md:pt-28 pb-12 md:pb-20 text-center space-y-8">
        <div className="space-y-5">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent leading-tight">
            Your family&apos;s
            <br />
            command center.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Health vitals. Financial records. Household operations.
            <br className="hidden md:block" />
            Everything your family needs, unified in one beautiful platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm rounded-full hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Get Started — It&apos;s Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 text-sm font-semibold text-[#007aff] hover:text-blue-600 transition-colors flex items-center gap-1.5"
          >
            Sign In <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-20 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 bg-white dark:bg-[#1c1c1e] rounded-[24px] border border-black/5 dark:border-white/5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <Shield size={14} />
          <span>End-to-end encrypted. Your data stays yours.</span>
        </div>
      </section>
    </div>
  );
}
