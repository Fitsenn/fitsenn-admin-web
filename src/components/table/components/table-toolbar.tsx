import type { ReactNode } from 'react';

import { useEffect, useState } from 'react';

import { Box, HStack, Input } from '@chakra-ui/react';

type TableToolbarProps = {
  showSearch?: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** Column visibility menu (optional) */
  columnVisibilityMenu?: ReactNode;
  /** Custom toolbar actions (optional) */
  toolbarActions?: ReactNode;
};

const TableToolbar = ({
  showSearch = false,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  columnVisibilityMenu,
  toolbarActions,
}: TableToolbarProps) => {
  const [localValue, setLocalValue] = useState(searchValue);

  useEffect(() => {
    setLocalValue(searchValue);
  }, [searchValue]);

  // debounce the search callback (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onSearchChange]);

  return (
    <Box pb={4}>
      <HStack justifyContent="space-between" alignItems="center">
        <div>
          {showSearch && (
            <Input
              placeholder={searchPlaceholder}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              width="300px"
              size="sm"
            />
          )}
        </div>

        {(columnVisibilityMenu || toolbarActions) && (
          <HStack gap={2}>
            {columnVisibilityMenu}
            {toolbarActions}
          </HStack>
        )}
      </HStack>
    </Box>
  );
};

export { TableToolbar };
