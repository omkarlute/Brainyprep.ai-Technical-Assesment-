// frontend/components/transactions/Pagination.tsx
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
};

export function Pagination({ page, perPage, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage + 1;
  const end = Math.min(total, page * perPage);

  const pagesToShow = [];
  for (let i = 1; i <= totalPages; i++) {
    pagesToShow.push(i);
    if (pagesToShow.length >= 7) break;
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Showing {start}-{end} of {total} transactions
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
        {pagesToShow.map((p) => (
          <Button
            key={p}
            variant={p === page ? 'default' : 'ghost'}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
