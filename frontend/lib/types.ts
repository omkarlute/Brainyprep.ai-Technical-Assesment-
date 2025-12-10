// frontend/lib/types.ts
export type TxStatus = 'pending' | 'confirmed' | 'failed';

export interface Transaction {
  id: string;            // internal id
  hash: string;
  from: string;
  to: string;
  amount: string;        // string to preserve precision, e.g. "1500000000000000000" or "1.5"
  currency?: string;     // e.g. "ETH"
  status: TxStatus;
  timestamp: string;     // ISO string
  gasLimit?: string;
  gasPrice?: string;
}

// small helpers
export const truncateAddress = (addr: string) => {
  if (!addr) return '';
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};
