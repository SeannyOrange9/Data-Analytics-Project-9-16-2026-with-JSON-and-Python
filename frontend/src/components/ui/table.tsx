import type { ReactNode } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Inbox } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/cn';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyFor: (row: T) => string | number;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  sortable?: boolean;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  loading?: boolean;
  toolbar?: ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  keyFor,
  searchable,
  searchPlaceholder = 'Search…',
  onSearch,
  sortable,
  page,
  pageSize = 10,
  total,
  onPageChange,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyAction,
  loading,
  toolbar,
}: DataTableProps<T>) {
  const totalPages = total !== undefined ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const currentPage = page ?? 1;
  const from = total !== undefined ? (currentPage - 1) * pageSize + 1 : undefined;
  const to = total !== undefined ? Math.min(currentPage * pageSize, total) : undefined;

  return (
    <div className="card overflow-hidden">
      {(searchable || toolbar) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          {toolbar}
          {searchable && (
            <div className="relative ml-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="input w-64 pl-9"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-head">
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {sortable && col.sortValue && <ArrowUpDown className="h-3 w-3 text-slate-300" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.key} className="table-cell">
                        <div className="h-3.5 animate-pulse rounded bg-slate-200" style={{ width: `${60 + ((i * 17) % 120)}px` }} />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row, idx) => (
                  <tr key={keyFor(row)} className="hover:bg-slate-50/70">
                    {columns.map((col) => (
                      <td key={col.key} className={cn('table-cell', col.className)}>
                        {col.render(row, idx)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
              <Inbox className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">{emptyTitle}</h3>
            {emptyDescription && <p className="mt-1 max-w-sm text-sm text-slate-500">{emptyDescription}</p>}
            {emptyAction && <div className="mt-4">{emptyAction}</div>}
          </div>
        )}
      </div>
      {total !== undefined && onPageChange && (
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <p className="text-xs text-slate-500">
            Showing {from}–{to} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="secondary" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} className="!px-2 !py-1.5">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-xs text-slate-600">Page {currentPage} of {totalPages}</span>
            <Button variant="secondary" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} className="!px-2 !py-1.5">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export { ArrowUp, ArrowDown };