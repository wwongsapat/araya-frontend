"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, registerUser } from "@/shared/auth";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to home
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(email, password, firstName);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Don't show register form if still checking auth or already authenticated
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#007aff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-[24px] border border-black/5 dark:border-white/5 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
          <p className="text-sm text-gray-500">Sign up to get started with your family platform</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-xs font-semibold leading-relaxed">
            Account created successfully! You can now{" "}
            <Link href="/login" className="underline font-bold">
              Sign In
            </Link>
            .
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block" htmlFor="register-name">
              First Name
            </label>
            <input
              id="register-name"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Araya"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-black/5 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#007aff] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block" htmlFor="register-email">
              Email address
            </label>
            <input
              id="register-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-black/5 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#007aff] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-black/5 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#007aff] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-[#007aff] font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
