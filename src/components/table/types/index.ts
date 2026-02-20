import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import type { ReactNode } from 'react';

// ==================== Row Actions Types ====================

/** Built-in action types with predefined icons and labels */
export type BuiltInActionType = 'view' | 'edit' | 'duplicate' | 'delete';

/** Built-in action configuration */
export type BuiltInRowAction<TData> = {
  type: BuiltInActionType;
  onClick: (row: TData) => void;
  /** Override the default translated label */
  label?: string;
  /** Condition to show this action (in addition to canEdit logic) */
  isVisible?: (row: TData) => boolean;
};

/** Custom action configuration */
export type CustomRowAction<TData> = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: (row: TData) => void;
  /** Whether to show a separator before this action */
  hasSeparator?: boolean;
  /** Whether this action is destructive (styled in red) */
  isDestructive?: boolean;
  /** Condition to show this action */
  isVisible?: (row: TData) => boolean;
};

/** Union type for any row action */
export type RowAction<TData> = BuiltInRowAction<TData> | CustomRowAction<TData>;

/** Type guard to check if action is built-in */
export const isBuiltInAction = <TData>(action: RowAction<TData>): action is BuiltInRowAction<TData> => {
  return 'type' in action;
};

/** Row actions configuration passed to DataTable */
export type RowActionsConfig<TData> = {
  /** Array of actions to display */
  actions: RowAction<TData>[];
  /** Controls visibility of built-in edit/duplicate actions vs view (default: true) */
  canEdit?: boolean;
  /** Controls visibility of built-in delete action (default: follows canEdit) */
  canDelete?: boolean;
  /** Header text for actions column */
  columnHeader?: string;
};

// ==================== DataTable Props ====================

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

  // ==================== Row Actions ====================
  /** Row-level actions configuration */
  rowActions?: RowActionsConfig<TData>;
};
