import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export type DataTableProps<TData> = {
  /** The data to display in the table */
  data: TData[];

  /** Column definitions using TanStack Table's ColumnDef */
  columns: ColumnDef<TData>[];

  /** Loading state */
  isLoading?: boolean;

  /** Error state */
  error?: string | null;

  /** Custom empty state component */
  emptyState?: ReactNode;

  /** Custom error state component */
  errorState?: (error: string) => ReactNode;

  // ==================== Pagination ====================
  /** Enable pagination (default: false) */
  enablePagination?: boolean;

  /** Default page size (default: 10) */
  pageSize?: number;

  /** Available page size options (default: [10, 20, 50, 100]) */
  pageSizeOptions?: number[];

  /** Server-side pagination - table won't paginate data automatically */
  manualPagination?: boolean;

  /** Total number of pages (required for server-side pagination) */
  pageCount?: number;

  /** Callback when pagination state changes (for server-side) */
  onPaginationChange?: (pagination: PaginationState) => void;

  // ==================== Sorting ====================
  /** Enable sorting (default: false) */
  enableSorting?: boolean;

  /** Server-side sorting - table won't sort data automatically */
  manualSorting?: boolean;

  /** Callback when sorting state changes (for server-side) */
  onSortingChange?: (sorting: SortingState) => void;

  // ==================== Search ====================
  /** Fields to search when using the search input - if empty disable search */
  searchFields?: (keyof TData)[];

  /** Placeholder text for search input (default: "Search...") */
  searchPlaceholder?: string;

  /** Server-side search - table won't filter data automatically */
  manualSearch?: boolean;

  /** Callback when search query changes (for server-side search) */
  onSearchChange?: (searchQuery: string) => void;

  // ==================== Column Visibility ====================
  /** Unique key for persisting table state in localStorage */
  storageKey?: string;

  /** Enable column visibility toggle (default: false) */
  enableColumnVisibility?: boolean;

  // ==================== Customization ====================
  /** Custom toolbar actions (rendered in top-right) */
  toolbarActions?: ReactNode;
};
