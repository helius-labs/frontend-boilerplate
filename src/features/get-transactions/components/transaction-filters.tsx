'use client';

// Transaction type filter dropdown
import { FILTERABLE_TYPES } from '@/features/get-transactions/lib/transaction-types';
import { cn } from '@/lib/utils';

/**
 * Dropdown filter for transaction types.
 * Used in the filtered transactions use case.
 */
export function TransactionFilters({ selectedType, onChange }: TransactionFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="tx-type" className="text-sm font-medium">
        Filter by type:
      </label>
      <select
        id="tx-type"
        value={selectedType}
        onChange={(e) => onChange(e.target.value as FilterableTransactionType)}
        className={cn(
          'px-3 py-1.5 rounded-lg text-sm',
          'border bg-background',
          'focus:outline-none focus:ring-2 focus:ring-primary'
        )}
      >
        {FILTERABLE_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}
