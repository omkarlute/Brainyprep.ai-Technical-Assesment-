// frontend/components/transactions/TransactionTable.tsx
'use client';
import React from 'react';
import { Transaction, truncateAddress } from '@/lib/types';
import { formatAmount, formatTimestampRelative, formatTimestampFull } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

type SortField = 'date' | 'amount' | 'status';
type SortDir = 'asc' | 'desc';

type Props = {
  items: Transaction[];
  onSortChange: (field: SortField) => void;
  sortField: SortField;
  sortDir: SortDir;
};

function statusColorClass(status: Transaction['status']) {
  if (status === 'pending') return 'bg-yellow-200 text-yellow-800';
  if (status === 'confirmed') return 'bg-green-200 text-green-800';
  if (status === 'failed') return 'bg-red-200 text-red-800';
  return '';
}

export function TransactionTable({ items, onSortChange, sortField, sortDir }: Props) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-3 cursor-pointer" onClick={() => onSortChange('date')}>
              <div className="flex items-center gap-2">
                Date
                {sortField === 'date' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
              </div>
            </th>
            <th className="p-3">Hash</th>
            <th className="p-3">From</th>
            <th className="p-3">To</th>
            <th className="p-3 cursor-pointer" onClick={() => onSortChange('amount')}>
              <div className="flex items-center gap-2">
                Amount
                {sortField === 'amount' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
              </div>
            </th>
            <th className="p-3 cursor-pointer" onClick={() => onSortChange('status')}>
              <div className="flex items-center gap-2">
                Status
                {sortField === 'status' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
              </div>
            </th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((tx) => (
            <tr key={tx.id} className="hover:bg-muted/10">
              <td className="p-3">
                <div className="text-sm">{formatTimestampRelative(tx.timestamp)}</div>
                <div className="text-xs text-muted-foreground">{formatTimestampFull(tx.timestamp)}</div>
              </td>
              <td className="p-3 font-mono text-sm break-all">{tx.hash}</td>
              <td className="p-3">
                <div>{truncateAddress(tx.from)}</div>
                <div className="text-xs text-muted-foreground">{tx.from}</div>
              </td>
              <td className="p-3">
                <div>{truncateAddress(tx.to)}</div>
                <div className="text-xs text-muted-foreground">{tx.to}</div>
              </td>
              <td className="p-3">{formatAmount(tx.amount, tx.currency || 'ETH')}</td>
              <td className="p-3">
                <span className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm ${statusColorClass(tx.status)}`}>
                  {tx.status}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2 items-center">
                  <button
                    className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm"
                    onClick={() => navigator.clipboard?.writeText(tx.hash)}
                    title="Copy hash"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
