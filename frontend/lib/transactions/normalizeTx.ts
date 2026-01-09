
import type { Tx } from "./types";

export const normalizeTx = (r: any): Tx => ({
  id: r.id ?? r._id ?? String(Math.random()).slice(2),
  hash: r.hash ?? r.txHash ?? "",
  from: r.from ?? r.fromAddress ?? r.sender ?? "",
  to: r.to ?? r.toAddress ?? r.recipient ?? "",
  amount: r.amount ?? r.value ?? "0",
  status: (r.status ?? "pending") as string,
  timestamp: r.timestamp ?? r.createdAt ?? new Date().toISOString(),
  gasLimit: r.gasLimit,
  gasPrice: r.gasPrice,
});
