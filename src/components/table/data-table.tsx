import type { FilterFn, OnChangeFn, PaginationState, SortingState, VisibilityState } from '@tanstack/react-table';
import type { DataTableProps } from './types';

import { useMemo, useState } from 'react';

import { Box, Table } from '@chakra-ui/react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from 'react-icons/lu';

import { ColumnVisibilityMenu } from './components/column-visibility-menu';
import { TableEmpty } from './components/table-empty';
import { TableError } from './components/table-error';
import { TablePagination } from './components/table-pagination';
import { TableSkeleton } from './components/table-skeleton';
import { TableToolbar } from './components/table-toolbar';
import { useTableStorage } from './hooks/use-table-storage';
import { createActionsColumn } from './utils/create-actions-column';

const DataTable = <TData,>({
  data,
  columns,
  isLoading,
  error,
  emptyState,
  errorState,
  enablePagination = false,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  manualPagination = false,
  pageCount,
  onPaginationChange,
  enableSorting = true,
  manualSorting = false,
  onSortingChange,
  searchFields = [],
  searchPlaceholder = 'Search...',
  manualSearch = false,
  onSearchChange,
  storageKey,
  enableColumnVisibility = false,
  toolbarActions,
  rowActions,
}: DataTableProps<TData>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  // local column visibility state (when no storageKey provided)
  const [localColumnVisibility, setLocalColumnVisibility] = useState<VisibilityState>({});

  const { columnVisibility, setColumnVisibility } = useTableStorage({
    storageKey: storageKey ?? 'default-table',
    enabled: !!storageKey && enableColumnVisibility,
  });

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    setPagination(newPagination);
    onPaginationChange?.(newPagination);
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
    onSortingChange?.(newSorting);
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    onSearchChange?.(value);
  };

  // function that handles search
  const globalFilterFn: FilterFn<TData> = (row, _columnId, filterValue) => {
    if (!filterValue) return true;
    if (searchFields.length === 0) return true;

    const searchQuery = String(filterValue).toLowerCase();
    const rowData = row.original;

    // Search across all specified fields
    return searchFields.some((field) => {
      const value = rowData[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(searchQuery);
    });
  };

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (updater) => {
    const newVisibility = typeof updater === 'function' ? updater(currentColumnVisibility) : updater;

    if (storageKey && enableColumnVisibility) {
      setColumnVisibility(newVisibility);
    } else {
      setLocalColumnVisibility(newVisibility);
    }
  };

  // Determine which column visibility state to use
  const currentColumnVisibility = storageKey && enableColumnVisibility ? columnVisibility : localColumnVisibility;

  // Add actions column if rowActions is provided
  const columnsWithActions = useMemo(() => {
    if (!rowActions || rowActions.actions.length === 0) {
      return columns;
    }

    const actionsColumn = createActionsColumn(rowActions);
    return [...columns, actionsColumn];
  }, [columns, rowActions]);

  // TanStack Table is incompatible with React Compiler (expected) - disable warning
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: columnsWithActions,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    // Initial state
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    // Pagination
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
      manualPagination,
      pageCount,
      onPaginationChange: handlePaginationChange,
    }),
    // Sorting
    enableSorting,
    manualSorting,
    onSortingChange: handleSortingChange,
    getSortedRowModel: getSortedRowModel(),
    // Search/Filtering
    ...(searchFields.length && {
      getFilteredRowModel: getFilteredRowModel(),
      globalFilterFn: globalFilterFn,
      manualFiltering: manualSearch,
    }),
    // Column Visibility
    ...(enableColumnVisibility && {
      onColumnVisibilityChange: handleColumnVisibilityChange,
    }),
    state: {
      pagination,
      sorting,
      globalFilter,
      ...(enableColumnVisibility && { columnVisibility: currentColumnVisibility }),
    },
  });

  const showPagination = enablePagination && !isLoading && !error && data.length > 0;
  const showToolbar = searchFields.length || enableColumnVisibility || toolbarActions;

  return (
    <Box>
      {/* Toolbar */}
      {showToolbar && (
        <TableToolbar
          showSearch={!!searchFields.length}
          searchValue={globalFilter}
          onSearchChange={handleSearchChange}
          searchPlaceholder={searchPlaceholder}
          columnVisibilityMenu={enableColumnVisibility ? <ColumnVisibilityMenu table={table} /> : undefined}
          toolbarActions={toolbarActions}
        />
      )}

      <Table.Root variant="outline" size="sm">
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeader
                  key={header.id}
                  cursor={header.column.getCanSort() ? 'pointer' : 'default'}
                  onClick={header.column.getToggleSortingHandler()}
                  userSelect="none">
                  <Box display="flex" alignItems="center" gap={2}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <Box display="inline-flex" color="fg.muted">
                        {{
                          asc: <LuArrowUp size={14} />,
                          desc: <LuArrowDown size={14} />,
                        }[header.column.getIsSorted() as string] ?? <LuArrowUpDown size={14} />}
                      </Box>
                    )}
                  </Box>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {/* Loading state */}
          {isLoading && (
            <Table.Row>
              <Table.Cell colSpan={columnsWithActions.length}>
                <TableSkeleton rows={5} columns={columns.length} />
              </Table.Cell>
            </Table.Row>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <Table.Row>
              <Table.Cell colSpan={columnsWithActions.length}>
                {errorState ? <>{errorState(error)}</> : <TableError error={error} />}
              </Table.Cell>
            </Table.Row>
          )}

          {/* Empty state */}
          {!isLoading && !error && data.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={columnsWithActions.length}>
                {emptyState ? <>{emptyState}</> : <TableEmpty />}
              </Table.Cell>
            </Table.Row>
          )}

          {/* Table data */}
          {!isLoading &&
            !error &&
            data.length > 0 &&
            table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
                ))}
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination */}
      {showPagination && <TablePagination table={table} pageSizeOptions={pageSizeOptions} />}
    </Box>
  );
};

export { DataTable };
