"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Home, Heart, DollarSign, LogOut } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/shared/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Close menus when pathname changes
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPeopleActive = pathname.startsWith("/people");

  // Get user initials for avatar
  const userInitial = user?.firstName?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <nav
        className={clsx(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b border-black/5 dark:border-white/5",
          scrolled
            ? "bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md py-2 shadow-sm"
            : "bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-none py-3"
        )}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group select-none">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent group-hover:opacity-85 transition-opacity">
              Araya
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {/* Only show nav links when authenticated */}
            {isAuthenticated && (
              <>
                <Link
                  href="/house"
                  className={clsx(
                    "text-sm font-medium transition-colors hover:text-[#007aff]",
                    pathname === "/house"
                      ? "text-[#007aff]"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  House
                </Link>

                {/* People Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={clsx(
                      "flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#007aff] outline-none",
                      isPeopleActive
                        ? "text-[#007aff]"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    People
                    <ChevronDown
                      size={14}
                      className={clsx("transition-transform duration-200", dropdownOpen && "rotate-180")}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 shadow-lg p-1">
                      <Link
                        href="/people/health"
                        className={clsx(
                          "flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                          pathname === "/people/health"
                            ? "text-[#007aff] font-semibold"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        <Heart size={16} className="text-red-500" />
                        Health
                      </Link>
                      <Link
                        href="/people/finance"
                        className={clsx(
                          "flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                          pathname === "/people/finance"
                            ? "text-[#007aff] font-semibold"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        <DollarSign size={16} className="text-green-500" />
                        Finance
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Auth button area */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity outline-none"
                >
                  {userInitial}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/10 shadow-lg p-1">
                    <div className="px-3.5 py-2.5 border-b border-black/5 dark:border-white/5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.firstName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-1"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Slide-in Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Slide-in Sidebar */}
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[80vw] bg-white dark:bg-[#1c1c1e] border-r border-black/5 dark:border-white/5 shadow-2xl md:hidden transform transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Araya
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isAuthenticated ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.firstName || "User"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Navigation</span>
                <Link
                  href="/house"
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors",
                    pathname === "/house"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-[#007aff]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  <Home size={18} className="text-blue-500" />
                  House
                </Link>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">People</span>
                <div className="space-y-1">
                  <Link
                    href="/people/health"
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors",
                      pathname === "/people/health"
                        ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                    )}
                  >
                    <Heart size={18} className="text-red-500" />
                    Health
                  </Link>
                  <Link
                    href="/people/finance"
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors",
                      pathname === "/people/finance"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-500"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                    )}
                  >
                    <DollarSign size={18} className="text-green-500" />
                    Finance
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to access your workspace</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-black/10">
          {isAuthenticated ? (
            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-red-500 bg-red-50 dark:bg-red-900/10 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
