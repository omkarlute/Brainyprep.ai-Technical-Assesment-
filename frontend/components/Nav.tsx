"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wallet, Sun, Moon } from "lucide-react";
import "@/app/styles/neon-theme.css";

export function Nav() {
  const pathname = usePathname();

  // Stable initial theme (same on server + client)
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Prevent hydration mismatches
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // After hydration, load user/system preference
  useEffect(() => {
    if (!hydrated) return;

    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const chosen = saved ?? (prefersDark ? "dark" : "light");
    setTheme(chosen);
  }, [hydrated]);

  // Apply theme class and persist preference
  useEffect(() => {
    if (!hydrated) return;

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme, hydrated]);

  return (
    <nav className="glass-card neon-border backdrop-blur-xl sticky top-0 z-[9999] h-16">
      <div className="container mx-auto flex h-full items-center justify-between px-4">

        {/* Left / Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <Wallet className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Blockchain Transactions Dashboard
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center space-x-4">

          <Link href="/dashboard">
            <button
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                pathname === "/dashboard"
                  ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg"
                  : "glass-card hover-glow border border-cyan-500/30 dark:text-cyan-300 text-slate-800"
              }`}
            >
              Dashboard
            </button>
          </Link>

          <Link href="/transactions">
            <button
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                pathname === "/transactions"
                  ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg"
                  : "glass-card hover-glow border border-cyan-500/30 dark:text-cyan-300 text-slate-800"
              }`}
            >
              Transactions
            </button>
          </Link>

          {/* Theme button — only render after hydration */}
          {hydrated && (
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="glass-card hover-glow w-11 h-11 flex items-center justify-center rounded-xl border border-cyan-500/40 transition-all"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-800" />
              )}
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}
