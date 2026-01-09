"use client";

import "../styles/neon-theme.css";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------------------------------------------------------------------
   Simple Dashboard (No Backend Stats)
------------------------------------------------------------------------ */
export default function DashboardPage() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    return (
      (localStorage.getItem("theme") as "light" | "dark") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  return (
    <div className="
      min-h-screen 
      bg-gradient-to-br 
      from-slate-50 via-cyan-50 to-purple-50 
      dark:from-slate-950 dark:via-purple-950 dark:to-slate-950
      text-slate-900 dark:text-white
      flex items-center justify-center
    ">
      <div className="glass-card neon-border rounded-3xl p-12 max-w-xl text-center space-y-6">
        <h1 className="
          text-5xl font-black
          bg-gradient-to-r from-cyan-600 to-purple-600
          dark:from-cyan-400 dark:to-purple-400
          bg-clip-text text-transparent
        ">
          Web3 Dashboard
        </h1>

        <p className="text-cyan-700 dark:text-cyan-300/70 text-lg">
          A blockchain-style transaction explorer built with Next.js & NestJS
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="px-6 py-2.5 rounded-xl glass-card hover-glow font-semibold border border-cyan-400/40"
          >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <Link
            href="/transactions"
            className="
              px-6 py-2.5 rounded-xl font-bold shadow-lg 
              text-white
              bg-gradient-to-r from-cyan-600 to-purple-600 
              hover:from-cyan-500 hover:to-purple-500 
              transition-all
            "
          >
            View Transactions →
          </Link>
        </div>
      </div>
    </div>
  );
}
