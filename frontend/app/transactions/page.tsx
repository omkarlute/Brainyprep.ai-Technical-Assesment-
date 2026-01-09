"use client";
import React, { useEffect, useMemo, useState } from "react";
import "../styles/neon-theme.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transactionsAPI } from "@/lib/api";
import { TransactionDetails } from "@/components/transactions/TransactionDetails";
import { CreateTransactionForm } from "@/components/transactions/CreateTransactionForm";
import { normalizeTx } from "@/lib/transactions/normalizeTx";
import { truncateAddr } from "@/lib/utils/truncateAddr";
import type { Tx } from "@/lib/transactions/types";
import { safeLower, formatRelative } from "@/lib/transactions/utils";


/* ----------------------------------------------------
   I Have used across the component for data normalization and helpers.
----------------------------------------------------- */

// Normalizes raw transaction data from API into our Tx type

// Truncate long addresses (show first 6 and last 4 chars)

// Safely converts string to lowercase, handling null/undefined

// Formats timestamp to relative time (e.g., "2 hours ago", "Jan 15, 2024")

/* ---------------- component ---------------- */
export default function TransactionsPage() {
  // Main data state
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Simple toast system for notifications
  type Toast = { id: number; msg: string; variant?: "success" | "error" };
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextIdRef, setNextIdRef] = useState(1);
  const pushToast = (msg: string, variant: "success" | "error" = "success") => {
    setToasts((t) => [...t, { id: nextIdRef, msg, variant }]);
    setNextIdRef((n) => n + 1);
    // Auto-remove after 2.5s
    setTimeout(() => setToasts((t) => t.slice(1)), 2500);
  };
  // Search and filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);
  // Pagination and sorting states
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [sortField, setSortField] = useState<"date" | "amount" | "status">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  // UI states for details
  const [selectedTx, setSelectedTx] = useState<Tx | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  // ---------- THEME ----------
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    return (
      (localStorage.getItem("theme") as "light" | "dark") ||
      (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });
  // Apply theme to document root
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
      try {
        localStorage.setItem("theme", theme);
      } catch {}
    }
  }, [theme]);
  /* -------- fetch -------- */
  // Fetches transactions from API, with fallback to fetch
const fetchTxs = async (opts?: { silent?: boolean }) => {
  if (!opts?.silent) setLoading(true);
  setError(null);
  try {
    const res = await transactionsAPI.getAll();
    const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
    const normalized = list.map(normalizeTx);
    setTxs(normalized);
  } catch (err: any) {
    console.error("fetchTxs error", err);
    if (!opts?.silent) setError(err?.message ?? "Failed to load transactions");
  } finally {
    if (!opts?.silent) setLoading(false);
  }
};

  // Initial fetch on mount
  useEffect(() => {
    void fetchTxs();
  }, []);
  // Auto-refresh every 15s (silent to avoid UI flicker)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTxs({ silent: true });
    }, 15000);
    return () => clearInterval(interval);
  }, []);
  // Debounce search input to avoid excessive filtering (300ms delay)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(t);
  }, [search]);
  // Reseting date input: prevent year overflow by resetting if >4 digits
  const sanitizeDate = (v: string) => {
    const parts = v.split("-");
    if (parts[0] && parts[0].length > 4) parts[0] = parts[0].slice(-1);
    return parts.join("-");
  };
  // Memoized filtered and sorted list based on current states
  const filtered = useMemo(() => {
    let arr = [...txs];
   
    // Status filter
    if (statusFilter !== "all")
      arr = arr.filter((t) => safeLower(t.status) === safeLower(statusFilter));
   
    // Date range filters
    if (fromDate) {
      const f = new Date(fromDate).setHours(0, 0, 0, 0);
      arr = arr.filter((t) => new Date(t.timestamp).getTime() >= f);
    }
    if (toDate) {
      const tt = new Date(toDate).setHours(23, 59, 59, 999);
      arr = arr.filter((t) => new Date(t.timestamp).getTime() <= tt);
    }
   
    // Search filter across hash, from, to
    if (debouncedSearch) {
      const s = debouncedSearch;
      arr = arr.filter((t) => {
        return (
          safeLower(t.hash).includes(s) ||
          safeLower(t.from).includes(s) ||
          safeLower(t.to).includes(s)
        );
      });
    }
   
    // Sorting logic
    arr.sort((a, b) => {
      if (sortField === "date") {
        const na = new Date(a.timestamp).getTime();
        const nb = new Date(b.timestamp).getTime();
        return sortDir === "asc" ? na - nb : nb - na;
      }
      if (sortField === "amount") {
        const na = Number(a.amount) || 0;
        const nb = Number(b.amount) || 0;
        return sortDir === "asc" ? na - nb : nb - na;
      }
      if (sortField === "status") {
        const order: Record<string, number> = {
          pending: 0,
          failed: 1,
          confirmed: 2,
        };
        const va = order[a.status] ?? 0;
        const vb = order[b.status] ?? 0;
        return sortDir === "asc" ? va - vb : vb - va;
      }
      return 0;
    });
    return arr;
  }, [txs, debouncedSearch, statusFilter, fromDate, toDate, sortField, sortDir]);
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  // Reset page if current page exceeds new page count
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount, page]);
  const start = (page - 1) * perPage;
  const end = Math.min(total, start + perPage);
  const visible = filtered.slice(start, end);
  // Toggle sort direction or field
  const toggleSort = (f: "date" | "amount" | "status") => {
    if (sortField === f) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(f);
      setSortDir("desc");
    }
  };
  // Clear all filters and reset pagination
  const clearAll = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setFromDate(undefined);
    setToDate(undefined);
    setPage(1);
  };
  // Copy text to clipboard
  const copyToClipboard = async (v: string) => {
    try {
      if (!navigator?.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(v);
      pushToast("Copied to clipboard", "success");
    } catch {
      pushToast("Copy failed — copy manually", "error");
    }
  };
  // Open transaction details, fetching fresh data if possible
  const openDetails = async (txId: string) => {
  try {
    const res = await transactionsAPI.getById(txId);
    const payload = res.data?.data ?? res.data;
    setSelectedTx(normalizeTx(payload));
  } catch (err) {
    console.error("openDetails error", err);
  }
};

  /* ----------------- OPTIMISTIC CREATE ----------------- */
 
  // Handles optimistic UI update for create, with rollback on error
  const createWithOptimism = async (input: any) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticTx: Tx = {
      id: tempId,
      hash: input?.hash ?? "",
      from: input?.from ?? input?.fromAddress ?? input?.sender ?? "",
      to: input?.to ?? input?.toAddress ?? input?.recipient ?? "",
      amount: input?.amount ?? input?.value ?? "0",
      status: "pending",
      timestamp: new Date().toISOString(),
      __optimistic__: true,
    };
    setTxs((prev) => [optimisticTx, ...prev]);
    pushToast("Submitting transaction…", "success");
    try {
      let created: any;
const res = await transactionsAPI.create(input);
created = res.data;

        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        created = await r.json();
      }
      const normalized = normalizeTx(created?.data ?? created);
      setTxs((prev) =>
        prev.map((t) =>
          t.id === tempId ? { ...normalized, __optimistic__: false } : t
        )
      );
      pushToast(`Created tx ${normalized.hash ?? ""}`, "success");
      return normalized;
    } catch (err: any) {
      setTxs((prev) =>
        prev.map((t) => (t.id === tempId ? { ...t, status: "failed" } : t))
      );
      pushToast(err?.message ?? "Create failed", "error");
      // Remove failed optimistic entry after toast
      setTimeout(
        () => setTxs((prev) => prev.filter((t) => t.id !== tempId)),
        2500
      );
      throw err;
    }
  };
  // Handler for successful create (refetch and toast)
  const handleCreated = async (created: any | null) => {
    await fetchTxs();
    if (created?.id) {
      pushToast(`Created tx ${created.hash ?? ""}`, "success");
    }
  };
  /* ----------------- CSV EXPORT ----------------- */
  // Converts filtered transactions to CSV string
  const toCsv = (rows: Tx[]) => {
    const header = [
      "id",
      "hash",
      "from",
      "to",
      "amount",
      "status",
      "timestamp",
      "gasLimit",
      "gasPrice",
    ];
    const escape = (v: any) => {
      const s = (v ?? "").toString();
      if (s.includes(",") || s.includes("\n") || s.includes('"')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    const lines = [header.join(",")].concat(
      rows.map((r) =>
        [
          r.id,
          r.hash,
          r.from,
          r.to,
          r.amount,
          r.status,
          r.timestamp,
          r.gasLimit ?? "",
          r.gasPrice ?? "",
        ]
          .map(escape)
          .join(",")
      )
    );
    return lines.join("\n");
  };
  // Triggers CSV download
  const exportCsv = () => {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date()
      .toISOString()
      .slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  /* UI render */
  // Base page background with gradient
  const pageBg =
    "min-h-screen bg-gradient-to-br " +
    "dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 " +
    "from-white via-slate-100 to-white " +
    "dark:text-white text-slate-900";
  // Loading skeleton
  if (loading) {
    return (
      <div className={pageBg}>
        <div className="container mx-auto py-8 px-4">
          <div className="space-y-6 animate-pulse">
            <div className="h-12 w-64 rounded-lg glass-card neon-border" />
            <div className="h-96 rounded-2xl glass-card neon-border" />
          </div>
        </div>
      </div>
    );
  }
  // Error state with retry
  if (error) {
    return (
      <div className={"min-h-screen flex items-center justify-center " + pageBg}>
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-2xl mx-auto glass-card neon-border rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold dark:text-red-300 text-red-600 mb-4">
              Connection Error
            </h2>
            <p className="dark:text-red-200/80 text-red-700/80 mb-6">{error}</p>
            <button
              onClick={() => void fetchTxs()}
              className="px-8 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={pageBg}>
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 slide-up">
          <div>
            <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Web3 Transactions
            </h1>
            <p className="dark:text-cyan-300/70 text-slate-600 text-lg">
              Decentralized blockchain explorer
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="px-5 py-2.5 rounded-xl glass-card hover-glow transition-all font-medium border border-cyan-500/30"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-xl font-bold transition-all shadow-lg"
            >
              + New Transaction
            </button>
          </div>
        </div>
        {/* Stats Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 slide-up"
          style={{ animationDelay: "0.05s" } as React.CSSProperties}
        >
          <div className="glass-card rounded-2xl p-6 neon-border hover-glow transition-all">
            <div className="dark:text-cyan-300/70 text-slate-600 text-sm mb-2">
              Total Transactions
            </div>
            <div className="text-4xl font-black dark:text-cyan-200 text-slate-800">
              {txs.length}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 neon-border hover-glow transition-all">
            <div className="dark:text-purple-300/70 text-slate-600 text-sm mb-2">
              Active Filters
            </div>
            <div className="text-4xl font-black dark:text-purple-200 text-slate-800">
              {(statusFilter !== "all" ? 1 : 0) +
                (fromDate ? 1 : 0) +
                (toDate ? 1 : 0) +
                (debouncedSearch ? 1 : 0)}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 neon-border hover-glow transition-all">
            <div className="dark:text-pink-300/70 text-slate-600 text-sm mb-2">
              Filtered Results
            </div>
            <div className="text-4xl font-black dark:text-pink-200 text-slate-800">
              {total}
            </div>
          </div>
        </div>
        {/* Filters Row */}
        <div
          className="glass-card rounded-2xl p-6 neon-border slide-up"
          style={{ animationDelay: "0.1s" } as React.CSSProperties}
        >
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block dark:text-cyan-300/90 text-slate-700 text-sm font-semibold mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Hash, address..."
                    className="w-full px-4 py-2.5 pr-10 rounded-xl transition-all bg-white/70 dark:bg-slate-900/80 border dark:border-cyan-500/30 border-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-400 outline-none"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block dark:text-cyan-300/90 text-slate-700 text-sm font-semibold mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl transition-all bg-white/70 dark:bg-slate-900/80 border dark:border-cyan-500/30 border-slate-300 focus:border-cyan-400 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block dark:text-cyan-300/90 text-slate-700 text-sm font-semibold mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate ?? ""}
                  onChange={(e) =>
                    setFromDate(sanitizeDate(e.target.value) || undefined)
                  }
                  className="w-full px-4 py-2.5 rounded-xl transition-all bg-white/70 dark:bg-slate-900/80 border dark:border-cyan-500/30 border-slate-300 focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="block dark:text-cyan-300/90 text-slate-700 text-sm font-semibold mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate ?? ""}
                  onChange={(e) =>
                    setToDate(sanitizeDate(e.target.value) || undefined)
                  }
                  className="w-full px-4 py-2.5 rounded-xl transition-all bg-white/70 dark:bg-slate-900/80 border dark:border-cyan-500/30 border-slate-300 focus:border-cyan-400 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearAll}
                className="px-6 py-2.5 glass-card border border-red-500/30 rounded-xl font-semibold hover-glow transition-all dark:text-red-300 text-red-600"
              >
                Clear All
              </button>
              <button
                onClick={exportCsv}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all"
              >
                📊 Export CSV
              </button>
            </div>
          </div>
          <div className="mt-4 dark:text-cyan-300/60 text-slate-600 text-sm">
            Showing{" "}
            <span className="dark:text-cyan-300 text-slate-800 font-bold">
              {total === 0 ? 0 : start + 1}
            </span>
            -
            <span className="dark:text-cyan-300 text-slate-800 font-bold">
              {end}
            </span>{" "}
            of{" "}
            <span className="dark:text-cyan-300 text-slate-800 font-bold">
              {total}
            </span>{" "}
            transactions
          </div>
        </div>
        {/* Table */}
        <div
          className="glass-card rounded-2xl neon-border overflow-hidden slide-up"
          style={{ animationDelay: "0.15s" } as React.CSSProperties}
        >
          {total === 0 ? (
            <div className="p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl dark:text-cyan-300/70 text-slate-700">
                No transactions found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gradient-to-r dark:from-cyan-900/40 dark:to-purple-900/40 from-cyan-200/30 to-purple-200/30 border-b border-cyan-500/30">
                  <tr>
                    <th className="p-4 text-left dark:text-cyan-300 text-slate-700 font-bold">
                      Hash
                    </th>
                    <th className="p-4 text-left dark:text-cyan-300 text-slate-700 font-bold">
                      From
                    </th>
                    <th className="p-4 text-left dark:text-cyan-300 text-slate-700 font-bold">
                      To
                    </th>
                    <th
                      className="p-4 text-right dark:text-cyan-300 text-slate-700 font-bold cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => toggleSort("amount")}
                    >
                      Amount{" "}
                      {sortField === "amount" && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="p-4 text-left dark:text-cyan-300 text-slate-700 font-bold cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => toggleSort("status")}
                    >
                      Status{" "}
                      {sortField === "status" && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="p-4 text-left dark:text-cyan-300 text-slate-700 font-bold cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => toggleSort("date")}
                    >
                      Time {sortField === "date" && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="p-4 text-center dark:text-cyan-300 text-slate-700 font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-cyan-500/10 hover:bg-cyan-500/10 transition-all"
                    >
                      <td className="p-4">
                        <div className="font-mono text-sm dark:text-cyan-300 text-slate-700 truncate max-w-[200px]">
                          {t.hash}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-sm dark:text-purple-300 text-slate-700"
                            title={t.from}
                          >
                            {truncateAddr(t.from)}
                          </span>
                          <button
                            onClick={() => void copyToClipboard(t.from)}
                            className="px-2 py-1 rounded-lg text-xs transition-all glass-card hover-glow border border-purple-500/40"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-sm dark:text-pink-300 text-slate-700"
                            title={t.to}
                          >
                            {truncateAddr(t.to)}
                          </span>
                          <button
                            onClick={() => void copyToClipboard(t.to)}
                            className="px-2 py-1 rounded-lg text-xs transition-all glass-card hover-glow border border-pink-500/40"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          {Number(t.amount).toLocaleString(undefined, {
                            maximumFractionDigits: 8,
                          })}{" "}
                          ETH
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                            ${
                              t.status === "confirmed"
                                ? "bg-gradient-to-r from-green-600/30 to-emerald-600/30 dark:text-green-300 text-green-700 border border-green-500/50"
                                : t.status === "pending"
                                ? "bg-gradient-to-r from-yellow-600/30 to-orange-600/30 dark:text-yellow-300 text-yellow-800 border border-yellow-500/50"
                                : "bg-gradient-to-r from-red-600/30 to-pink-600/30 dark:text-red-300 text-red-800 border border-red-500/50"
                            }`}
                        >
                          {t.__optimistic__ ? "⏳ PENDING*" : t.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold dark:text-cyan-300 text-slate-800">
                            {formatRelative(t.timestamp)}
                          </span>
                          <span className="text-xs dark:text-slate-400 text-slate-600">
                            {new Date(t.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => void openDetails(t.id)}
                            className="px-4 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() => void copyToClipboard(t.hash)}
                            className="px-3 py-2 glass-card border border-purple-500/30 rounded-lg hover-glow transition-all font-semibold text-sm"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Pagination */}
        {total > 0 && (
          <div
            className="glass-card rounded-2xl p-6 neon-border slide-up"
            style={{ animationDelay: "0.2s" } as React.CSSProperties}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-2.5 rounded-xl font-bold transition-all bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(pageCount, 5) }).map((_, i) => {
                    const idx = i + 1;
                    return (
                      <button
                        key={idx}
                        onClick={() => setPage(idx)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                          page === idx
                            ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                            : "glass-card hover-glow dark:text-cyan-300 text-slate-800"
                        }`}
                      >
                        {idx}
                      </button>
                    );
                  })}
                  {pageCount > 5 && (
                    <span className="dark:text-cyan-300 text-slate-700 px-2">
                      ...
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                  className="px-6 py-2.5 rounded-xl font-bold transition-all bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
              <div className="dark:text-cyan-300/80 text-slate-700">
                Page{" "}
                <span className="font-bold dark:text-cyan-300 text-slate-900">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-bold dark:text-cyan-300 text-slate-900">
                  {pageCount}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[99999] pointer-events-none flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-xl shadow-2xl font-semibold transition-all slide-up glass-card neon-border ${
              toast.variant === "success"
                ? "border-green-400/50"
                : "border-red-400/50"
            }`}
          >
            {toast.msg}
          </div>
        ))}
      </div>
      {/* Modals */}
      {selectedTx && (
        <TransactionDetails
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
          onCopy={(v) => void copyToClipboard(v)}
        />
      )}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <CreateTransactionForm
            onClose={() => setShowCreate(false)}
            onCreated={handleCreated}
            onToast={(m, v) => pushToast(m, v)}
            apiCreate={createWithOptimism}
          />
        </div>
      )}
    </div>
  );
}
