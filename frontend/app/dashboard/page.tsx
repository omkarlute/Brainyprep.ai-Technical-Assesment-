"use client";

import "../styles/neon-theme.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { statsAPI } from "@/lib/api";

/* ---------------------------------------------------------------------
   Types (optional but recommended)
------------------------------------------------------------------------ */
type Stats = {
  totalTransactions?: number;
  totalVolume?: number;
  successRate?: number;
  averageAmount?: number;
  pendingCount?: number;
  confirmedCount?: number;
  failedCount?: number;
};

/* ---------------------------------------------------------------------
   Reusable Neon Glass Card
------------------------------------------------------------------------ */
function NeonCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: string | number | null;
  accent?: string;
}) {
  return (
    <div
      className="glass-card neon-border rounded-2xl p-6 hover-glow transition-all duration-300
                 text-slate-900 dark:text-white"
      style={{ boxShadow: accent ? `0 0 22px ${accent}` : undefined }}
    >
      <div className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 mb-2">
        {title}
      </div>
      <div className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-purple-600
                      dark:from-cyan-300 dark:to-purple-300 bg-clip-text text-transparent">
        {value ?? "—"}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Dashboard Page
------------------------------------------------------------------------ */
export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH STATS ---------------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await statsAPI.getStats();

        // 🔍 DEBUG: check actual backend response
        console.log("STATS API RESPONSE:", res.data);

        // ✅ SAFE EXTRACTION (handles all backend shapes)
        const payload =
          res.data?.data ??
          res.data?.stats ??
          res.data;

        setStats(payload ?? null);
      } catch (err) {
        console.error("Stats fetch failed", err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-purple-50
                    dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-600 to-purple-600
                           bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-cyan-700 dark:text-cyan-300/70 mt-2 text-lg">
              Overview of your blockchain activity
            </p>
          </div>

          <Link
            href="/transactions"
            className="px-6 py-3 rounded-xl font-bold text-white
                       bg-gradient-to-r from-cyan-600 to-purple-600
                       hover:from-cyan-500 hover:to-purple-500"
          >
            View Transactions →
          </Link>
        </div>

        {/* STATS */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <NeonCard
            title="Total Transactions"
            value={stats?.totalTransactions ?? "—"}
          />

          <NeonCard
            title="Total Volume"
            value={
              stats?.totalVolume != null
                ? `${stats.totalVolume} ETH`
                : "—"
            }
          />

          <NeonCard
            title="Success Rate"
            value={
              stats?.successRate != null
                ? `${stats.successRate}%`
                : "—"
            }
          />

          <NeonCard
            title="Average Amount"
            value={
              stats?.averageAmount != null
                ? `${stats.averageAmount} ETH`
                : "—"
            }
          />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <NeonCard title="Pending" value={stats?.pendingCount ?? "—"} />
          <NeonCard title="Confirmed" value={stats?.confirmedCount ?? "—"} />
          <NeonCard title="Failed" value={stats?.failedCount ?? "—"} />
        </div>
      </div>
    </div>
  );
}
