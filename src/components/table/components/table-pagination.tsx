import type { Table } from '@tanstack/react-table';

import { Box, HStack, IconButton, Portal, Select, Text, createListCollection } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from 'react-icons/lu';

type TablePaginationProps<TData> = {
  table: Table<TData>;
  pageSizeOptions?: number[];
};

const TablePagination = <TData,>({ table, pageSizeOptions = [10, 20, 50, 100] }: TablePaginationProps<TData>) => {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  // Calculate the range of rows being displayed
  const startRow = table.getState().pagination.pageIndex * pageSize + 1;
  const endRow = Math.min(startRow + pageSize - 1, totalRows);

  // Create collection for Select component
  const pageSizeCollection = createListCollection({
    items: pageSizeOptions.map((size) => ({ label: String(size), value: String(size) })),
  });

  return (
    <Box py={4} borderTopWidth="1px">
      <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
        {/* Left side: Row info and page size selector */}
        <HStack gap={4}>
          <Text fontSize="sm" color="fg.muted">
            Showing {startRow}-{endRow} of {totalRows}
          </Text>

          <HStack gap={2} alignItems="center">
            <Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">
              Rows per page:
            </Text>
            <Select.Root
              collection={pageSizeCollection}
              size="sm"
              width="70px"
              defaultValue={[String(pageSize)]}
              onValueChange={(details) => table.setPageSize(Number(details.value[0]))}>
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select" />
                </Select.Trigger>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {pageSizeCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        <Select.ItemText>{item.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </HStack>
        </HStack>

        {/* Right side: Pagination controls */}
        <HStack gap={1}>
          <IconButton
            aria-label="First page"
            size="sm"
            variant="ghost"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
            <LuChevronsLeft />
          </IconButton>

          <IconButton
            aria-label="Previous page"
            size="sm"
            variant="ghost"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            <LuChevronLeft />
          </IconButton>

          <HStack gap={1} px={2}>
            <Text fontSize="sm" color="fg.muted">
              Page {currentPage} of {totalPages}
            </Text>
          </HStack>

          <IconButton
            aria-label="Next page"
            size="sm"
            variant="ghost"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            <LuChevronRight />
          </IconButton>

          <IconButton
            aria-label="Last page"
            size="sm"
            variant="ghost"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}>
            <LuChevronsRight />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
};

export { TablePagination };
