"use client";

import "../styles/neon-theme.css";
import { useEffect, useState } from "react";
import { statsAPI } from "@/lib/api";
import Link from "next/link";
import { Loader2 } from "lucide-react";

/* ---------------------------------------------------------------------
   Neon Card
------------------------------------------------------------------------ */
function NeonCard({
  title,
  value,
  suffix = "",
}: {
  title: string;
  value: number | string;
  suffix?: string;
}) {
  return (
    <div className="glass-card neon-border rounded-2xl p-6 hover-glow transition-all">
      <div className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 mb-2">
        {title}
      </div>
      <div className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
        {value}
        {suffix}
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
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
    document.documentElement.classList.toggle("dark", saved !== "light");
  }, []);

  /* Fetch stats */
  useEffect(() => {
    async function load() {
      try {
        const res = await statsAPI.getStats();
        const d = res.data.data;

        // 🔥 NORMALIZE HERE (CRITICAL FIX)
        setStats({
          totalTransactions: Number(d.totalTransactions),
          totalVolume: Number(d.totalVolume),
          averageAmount: Number(d.averageAmount),
          successRate: Number(d.successRate),
          pendingCount: Number(d.pendingCount),
          confirmedCount: Number(d.confirmedCount),
          failedCount: Number(d.failedCount),
        });
      } catch (e) {
        console.error("Stats load failed", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      </div>
    );
  }

  /* UI */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white">
      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-cyan-600/70 mt-2">
              Overview of your blockchain activity
            </p>
          </div>

          <Link
            href="/transactions"
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90"
          >
            View Transactions →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <NeonCard title="Total Transactions" value={stats.totalTransactions} />
          <NeonCard title="Total Volume" value={stats.totalVolume.toFixed(2)} suffix=" ETH" />
          <NeonCard title="Success Rate" value={stats.successRate.toFixed(2)} suffix="%" />
          <NeonCard title="Average Amount" value={stats.averageAmount.toFixed(4)} suffix=" ETH" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <NeonCard title="Pending" value={stats.pendingCount} />
          <NeonCard title="Confirmed" value={stats.confirmedCount} />
          <NeonCard title="Failed" value={stats.failedCount} />
        </div>

      </div>
    </div>
  );
}
