import type { Table } from '@tanstack/react-table';

import { Box, HStack, IconButton, Portal, Select, Text, createListCollection } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from 'react-icons/lu';

type TablePaginationProps<TData> = {
  table: Table<TData>;
  pageSizeOptions?: number[];
};

const TablePagination = <TData,>({ table, pageSizeOptions = [10, 20, 50, 100] }: TablePaginationProps<TData>) => {
  const { t } = useTranslation();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  const startRow = table.getState().pagination.pageIndex * pageSize + 1;
  const endRow = Math.min(startRow + pageSize - 1, totalRows);

  const pageSizeCollection = createListCollection({
    items: pageSizeOptions.map((size) => ({ label: String(size), value: String(size) })),
  });

  return (
    <Box py={4} borderTopWidth="1px">
      <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
        <HStack gap={4}>
          <Text fontSize="sm" color="fg.muted">
            {t('table.showing', { start: startRow, end: endRow, total: totalRows })}
          </Text>

          <HStack gap={2} alignItems="center">
            <Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">
              {t('table.rowsPerPage')}
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
                  <Select.ValueText />
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

        <HStack gap={1}>
          <IconButton
            aria-label={t('table.firstPage')}
            size="sm"
            variant="ghost"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
            <LuChevronsLeft />
          </IconButton>

          <IconButton
            aria-label={t('table.previousPage')}
            size="sm"
            variant="ghost"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            <LuChevronLeft />
          </IconButton>

          <HStack gap={1} px={2}>
            <Text fontSize="sm" color="fg.muted">
              {t('table.pageOf', { current: currentPage, total: totalPages })}
            </Text>
          </HStack>

          <IconButton
            aria-label={t('table.nextPage')}
            size="sm"
            variant="ghost"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            <LuChevronRight />
          </IconButton>

          <IconButton
            aria-label={t('table.lastPage')}
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
