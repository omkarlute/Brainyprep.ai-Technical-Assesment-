"use client";

import React from "react";
import "../../app/styles/neon-theme.css";
import { Label } from "@/components/ui/label";

type Tx = {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string | number;
  status: string;
  timestamp: string;
  gasLimit?: string;
  gasPrice?: string;
};

type Props = {
  tx: Tx;
  onClose: () => void;
  onCopy: (v: string) => void;
};

const formatRelative = (iso: string) => {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const d = Math.floor(hr / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

export function TransactionDetails({ tx, onClose, onCopy }: Props) {
  if (!tx) return null;

  const fee =
    tx.gasLimit && tx.gasPrice
      ? Number(tx.gasLimit) * Number(tx.gasPrice)
      : null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-4">
      {/* Container */}
   <div
  className="
    w-full md:w-3/4 lg:w-1/2
    glass-card neon-border slide-up
    rounded-2xl shadow-2xl
    max-h-[90vh] overflow-y-auto
    p-8
    text-neutral-light dark:text-white
  "
>

        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <h2
            className="
              text-4xl font-extrabold tracking-tight
              bg-gradient-to-r from-cyan-700 to-purple-700 
              dark:from-cyan-400 dark:to-purple-400
              bg-clip-text text-transparent neon-text
            "
          >
            Transaction Details
          </h2>

          <div className="flex items-center gap-3">
            {/* Copy Hash */}
            <button
              onClick={() => onCopy(tx.hash)}
              className="
                px-4 py-2 rounded-xl text-sm font-semibold transition-all
                bg-gradient-to-r from-purple-600 to-pink-600
                hover:from-purple-500 hover:to-pink-500
                text-white shadow-lg
              "
              style={{ boxShadow: "0 0 12px rgba(168,85,247,0.45)" }}
            >
              📋 Copy Hash
            </button>

            {/* Explorer */}
            <button
              onClick={() =>
                window.open(`https://etherscan.io/tx/${tx.hash}`, "_blank")
              }
              className="
                px-4 py-2 rounded-xl text-sm font-semibold
                glass-card hover-glow transition-all
                border border-cyan-500/40
                text-cyan-700 dark:text-white
              "
            >
              🔗 Explorer
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="
                px-4 py-2 rounded-xl text-sm font-semibold
                glass-card hover-glow transition-all
                border border-red-500/40
                text-red-700 dark:text-red-300
              "
            >
              ✖ Close
            </button>
          </div>
        </div>

        {/* GRID CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* HASH */}
          <div>
            <Label className="text-cyan-700 dark:text-cyan-300 font-semibold">
              Hash
            </Label>
            <div className="font-mono text-sm break-all mt-1 text-slate-900 dark:text-cyan-200">
              {tx.hash}
            </div>
          </div>

          {/* TIMESTAMP */}
          <div>
            <Label className="text-cyan-700 dark:text-cyan-300 font-semibold">
              Timestamp
            </Label>
            <div className="mt-1">
              <span className="text-slate-900 dark:text-cyan-200">
                {formatRelative(tx.timestamp)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                ({new Date(tx.timestamp).toLocaleString()})
              </span>
            </div>
          </div>

          {/* FROM */}
          <div>
            <Label className="text-cyan-700 dark:text-cyan-300 font-semibold">
              From
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <div className="font-mono text-sm truncate text-purple-700 dark:text-purple-300">
                {tx.from}
              </div>
              <button
                onClick={() => onCopy(tx.from)}
                className="
                  px-3 py-1 rounded-lg text-xs font-semibold transition-all
                  bg-purple-500/20 hover:bg-purple-500/30
                  border border-purple-500/40
                  text-purple-700 dark:text-purple-300
                "
              >
                📋
              </button>
            </div>
          </div>

          {/* TO */}
          <div>
            <Label className="text-cyan-700 dark:text-cyan-300 font-semibold">
              To
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <div className="font-mono text-sm truncate text-pink-700 dark:text-pink-300">
                {tx.to}
              </div>
              <button
                onClick={() => onCopy(tx.to)}
                className="
                  px-3 py-1 rounded-lg text-xs font-semibold transition-all
                  bg-pink-500/20 hover:bg-pink-500/30
                  border border-pink-500/40
                  text-pink-700 dark:text-pink-300
                "
              >
                📋
              </button>
            </div>
          </div>

          {/* AMOUNT */}
          <div>
            <Label className="text-cyan-700 dark:text-cyan-300 font-semibold">
              Amount
            </Label>
            <div
              className="
                mt-1 text-2xl font-extrabold
                bg-gradient-to-r from-cyan-700 to-purple-700
                dark:from-cyan-400 dark:to-purple-400
                bg-clip-text text-transparent neon-text
              "
            >
              {Number(tx.amount).toLocaleString(undefined, {
                maximumFractionDigits: 8,
              })}{" "}
              ETH
            </div>
          </div>

          {/* STATUS */}
          <div>
            <Label className="text-cyan-700 dark:text-cyan-300 font-semibold">
              Status
            </Label>
            <div className="mt-1">
              <span
                className={`
                  inline-block px-3 py-1.5 rounded-lg text-xs font-bold
                  ${
                    tx.status === "confirmed"
                      ? "bg-green-200 text-green-800 dark:bg-green-600/30 dark:text-green-300"
                      : tx.status === "pending"
                      ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-600/30 dark:text-yellow-300"
                      : "bg-red-200 text-red-800 dark:bg-red-600/30 dark:text-red-300"
                  }
                `}
              >
                {tx.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* GAS LIMIT */}
          <div>
            <Label className="text-cyan-700 dark:text-cyan-300 font-semibold">
              Gas Limit
            </Label>
            <div className="mt-1 text-slate-800 dark:text-cyan-200">
              {tx.gasLimit ?? "—"}
            </div>
          </div>

          {/* GAS PRICE */}
          <div>
            <Label className="text-cyan-700 dark:text-cyan-300 font-semibold">
              Gas Price
            </Label>
            <div className="mt-1 text-slate-800 dark:text-cyan-200">
              {tx.gasPrice ?? "—"}
            </div>
          </div>

          {/* FEE */}
          <div className="md:col-span-2">
            <Label className="text-cyan-700 dark:text-cyan-300 font-semibold">
              Estimated Fee
            </Label>
            <div className="mt-1 text-slate-800 dark:text-cyan-200">
              {fee !== null
                ? `${fee.toLocaleString(undefined, {
                    maximumFractionDigits: 12,
                  })} (native units)`
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
