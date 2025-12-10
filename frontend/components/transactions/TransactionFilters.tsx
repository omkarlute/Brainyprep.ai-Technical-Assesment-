'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Props = {
  search: string;
  onSearch: (s: string) => void;

  status: string;
  onStatusChange: (s: string) => void;

  fromDate?: string;
  toDate?: string;

  onFromDateChange: (s?: string) => void;
  onToDateChange: (s?: string) => void;

  onClear: () => void;
};

/* -----------------------------------------------------------
   Year logic EXACTLY as you described:
   - YYYY only
   - When user enters 5th digit:
       oldYear + digit → digit (start fresh)
------------------------------------------------------------ */
function fixYear(raw: string): string {
  if (!raw) return "";

  const parts = raw.split("-");
  if (parts.length !== 3) return raw;

  let year = parts[0];

  // If user types 5th digit → reset to just last digit
  if (year.length > 4) {
    const lastDigit = year[year.length - 1];
    year = lastDigit; // Start new sequence from this digit
  }

  return `${year}-${parts[1]}-${parts[2]}`;
}

export function TransactionFilters({
  search,
  onSearch,
  status,
  onStatusChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onClear,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      
      {/* SEARCH */}
      <div className="flex gap-2 items-center flex-1">
        <Label htmlFor="tx-search" className="sr-only">Search</Label>

        <Input
          id="tx-search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search hash or address..."
        />

        <Button variant="ghost" onClick={() => onSearch('')}>Clear</Button>
      </div>

      {/* FILTER GROUP */}
      <div className="flex gap-4 items-end">

        {/* FROM DATE */}
        <div className="flex flex-col">
          <Label>From</Label>
          <input
            type="date"
            value={fromDate || ""}
            onChange={(e) => {
              const clean = fixYear(e.target.value);
              onFromDateChange(clean || undefined);
            }}
            className="rounded-md border px-2 py-1"
          />
        </div>

        {/* TO DATE */}
        <div className="flex flex-col">
          <Label>To</Label>
          <input
            type="date"
            value={toDate || ""}
            onChange={(e) => {
              const clean = fixYear(e.target.value);
              onToDateChange(clean || undefined);
            }}
            className="rounded-md border px-2 py-1"
          />
        </div>

        {/* STATUS */}
        <div className="flex flex-col">
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-md border px-2 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <Button variant="outline" onClick={onClear}>Clear filters</Button>
      </div>
    </div>
  );
}
