"use client";

import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionsAPI } from "@/lib/api";

/* ---------------------------------------------------------
   Types
---------------------------------------------------------- */

export type Tx = {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string | number;
  status: "pending" | "confirmed" | "failed" | string;
  timestamp: string;
  gasLimit?: string;
  gasPrice?: string;
};

/* ---------------------------------------------------------
   Normalizer (backend-proof)
---------------------------------------------------------- */

export const normalizeTx = (raw: any): Tx => ({
  id: raw.id ?? raw._id ?? String(Math.random()).slice(2),
  hash: raw.hash ?? raw.txHash ?? "",
  from: raw.from ?? raw.fromAddress ?? raw.sender ?? "",
  to: raw.to ?? raw.toAddress ?? raw.recipient ?? "",
  amount: raw.amount ?? raw.value ?? "0",
  status: raw.status ?? "pending",
  timestamp: raw.timestamp ?? raw.createdAt ?? new Date().toISOString(),
  gasLimit: raw.gasLimit,
  gasPrice: raw.gasPrice,
});

/* ---------------------------------------------------------
   Zod schema for creation form
---------------------------------------------------------- */

export const createTxSchema = z.object({
  toAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),

  amount: z
    .string()
    .refine((s) => Number(s) > 0, "Amount must be a positive number"),

  gasLimit: z.string().optional(),
  gasPrice: z.string().optional(),
});

export type CreateTxForm = z.infer<typeof createTxSchema>;

/* ---------------------------------------------------------
   Main Hook: useTransactions
---------------------------------------------------------- */

export function useTransactions() {
  /* ------------------ Data & State ------------------ */

  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Details modal
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Tx | null>(null);

  // Create drawer
  const [creating, setCreating] = useState(false);

  /* ------------------ Toast system ------------------- */

  type Toast = { id: number; message: string; variant?: "success" | "error" };
  const [toasts, setToasts] = useState<Toast[]>([]);
  let idCounter = 1;

  const pushToast = useCallback(
    (message: string, variant: "success" | "error" = "success") => {
      setToasts((prev) => [...prev, { id: idCounter++, message, variant }]);
    },
    []
  );

  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 1800);
    return () => clearTimeout(t);
  }, [toasts]);

  /* ------------------ Fetch list ------------------- */

  const fetchTxs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let raw;

      if (transactionsAPI?.getAll) {
        const res = await transactionsAPI.getAll();
        raw = res?.data;
      } else {
        const r = await fetch("/api/transactions");
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        raw = await r.json();
      }

      const list = Array.isArray(raw) ? raw : raw?.data ?? [];
      if (!Array.isArray(list)) throw new Error("Unexpected API response");

      setTxs(list.map(normalizeTx));
    } catch (err: any) {
      setError(err?.message ?? "Failed to load transactions");
      setTxs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTxs();
  }, [fetchTxs]);

  /* ------------------ Fetch details ------------------- */

  const openDetails = useCallback(
    async (id: string) => {
      setDetailsLoading(true);
      try {
        let raw;

        if (transactionsAPI?.getById) {
          const res = await transactionsAPI.getById(id);
          raw = res?.data;
        } else {
          const r = await fetch(`/api/transactions/${id}`);
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          raw = await r.json();
        }

        const payload = Array.isArray(raw) ? raw[0] : raw?.data ?? raw;

        setSelectedTx(normalizeTx(payload));
      } catch (err) {
        pushToast("Failed to load details", "error");
      } finally {
        setDetailsLoading(false);
      }
    },
    [pushToast]
  );

  const closeDetails = () => setSelectedTx(null);

  /* ------------------ Create transaction ------------------- */

  const createTransaction = useCallback(
    async (data: CreateTxForm) => {
      setCreating(true);
      try {
        let res;

        if (transactionsAPI?.create) {
          res = await transactionsAPI.create(data);
          res = res?.data ?? res;
        } else {
          const r = await fetch("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          res = await r.json();
        }

        const payload = Array.isArray(res) ? res[0] : res?.data ?? res;

        pushToast(`Created tx ${payload?.hash ?? ""}`, "success");

        await fetchTxs();
        return payload;
      } catch (err: any) {
        pushToast(err?.message ?? "Failed to create transaction", "error");
        throw err;
      } finally {
        setCreating(false);
      }
    },
    [fetchTxs, pushToast]
  );

  /* ---------------------------------------------------------
     Export API for components
  ---------------------------------------------------------- */
  return {
    txs,
    loading,
    error,
    fetchTxs,

    selectedTx,
    detailsLoading,
    openDetails,
    closeDetails,

    creating,
    createTransaction,

    toasts,
    pushToast,
  };
}
