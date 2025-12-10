// frontend/lib/formatters.ts
import { formatDistanceToNowStrict, format } from 'date-fns';

export function formatTimestampRelative(isoDate: string) {
  try {
    return formatDistanceToNowStrict(new Date(isoDate), { addSuffix: true });
  } catch {
    return isoDate;
  }
}

export function formatTimestampFull(isoDate: string) {
  try {
    return format(new Date(isoDate), 'MMM d, yyyy HH:mm');
  } catch {
    return isoDate;
  }
}

/**
 * Format amount string to readable value with decimals and currency.
 * If amount looks like a big integer in wei, user may convert externally.
 * For simplicity: if input is decimal string, return `${num} ETH`
 */
export function formatAmount(amount: string | number, currency = 'ETH') {
  const num = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(num)) return `${amount} ${currency}`;
  // show up to 6 significant decimals but trim trailing zeros
  const formatted = Number(num).toLocaleString(undefined, {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  });
  return `${formatted} ${currency}`;
}
