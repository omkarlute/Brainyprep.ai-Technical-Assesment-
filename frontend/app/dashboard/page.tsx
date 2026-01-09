"use client";

import "../styles/neon-theme.css";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------------------------------------------------------------------
   Neon Card
------------------------------------------------------------------------ */
function NeonCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: any;
  accent?: string;
}) {
  return (
    <div
      className="glass-card neon-border rounded-2xl p-6 hover-glow transition-all"
      style={{ boxShadow: accent ? `0 0 22px ${accent}` : undefined }}
    >
      <div className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 mb-2">
        {title}
      </div>
      <div className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-300 dark:to-purple-300 bg-clip-text text-transparent">
        {value}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Dashboard Page
------------------------------------------------------------------------ */
export default function DashboardPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  /* Theme */
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
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* Load Stats (SAFE) */
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stats`
        );
        if (!res.ok) throw new Error("Stats unavailable");
        const json = await res.json();
        setStats(json.data);
      } catch {
        // graceful fallback
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const safe = (v: any) => (v ?? "—");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-purple-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-cyan-700 dark:text-cyan-300/70 mt-2 text-lg">
              Overview of your blockchain activity
            </p>
          </div>

          <div className="flex gap-4 mt-6 md:mt-0">
            <button
              onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
              className="px-6 py-2.5 glass-card rounded-xl border"
            >
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <Link
              href="/transactions"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-purple-600"
            >
              View Transactions →
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <NeonCard title="Total Transactions" value={safe(stats?.totalTransactions)} />
          <NeonCard title="Total Volume" value={`${safe(stats?.totalVolume)} ETH`} />
          <NeonCard title="Success Rate" value={`${safe(stats?.successRate)}%`} />
          <NeonCard title="Average Amount" value={`${safe(stats?.averageAmount)} ETH`} />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <NeonCard title="Pending" value={safe(stats?.pendingCount)} />
          <NeonCard title="Confirmed" value={safe(stats?.confirmedCount)} />
          <NeonCard title="Failed" value={safe(stats?.failedCount)} />
        </div>
      </div>
    </div>
  );
}
